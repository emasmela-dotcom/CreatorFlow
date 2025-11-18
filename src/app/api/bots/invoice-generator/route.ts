import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Invoice Generator Bot - Create and manage invoices
 * Available for all tiers
 */

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * GET - List invoices
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Invoice Generator
    const tier = await getUserPlanTier(user.userId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let sqlQuery = `
      SELECT i.*, c.client_name, c.client_email, c.company_name 
      FROM invoices i 
      LEFT JOIN invoice_clients c ON i.client_id = c.id 
      WHERE i.user_id = ?
    `
    const args: any[] = [user.userId]

    if (status) {
      sqlQuery += ' AND i.status = ?'
      args.push(status)
    }
    if (clientId) {
      sqlQuery += ' AND i.client_id = ?'
      args.push(parseInt(clientId))
    }

    sqlQuery += ' ORDER BY i.invoice_date DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const result = await db.execute({ sql: sqlQuery, args })

    // Get items and payments for each invoice
    for (const invoice of result.rows) {
      const items = await db.execute({
        sql: 'SELECT * FROM invoice_items WHERE invoice_id = ?',
        args: [invoice.id]
      })
      invoice.items = items.rows

      const payments = await db.execute({
        sql: 'SELECT * FROM invoice_payments WHERE invoice_id = ?',
        args: [invoice.id]
      })
      invoice.payments = payments.rows
      invoice.paid_amount = payments.rows.reduce((sum: number, p: any) => 
        sum + parseFloat(p.payment_amount || 0), 0)
      invoice.balance = parseFloat(invoice.total_amount || 0) - invoice.paid_amount
    }

    return NextResponse.json({
      success: true,
      invoices: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Invoice Generator Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch invoices' 
    }, { status: 500 })
  }
}

/**
 * POST - Create invoice
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Invoice Generator
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const {
      clientId,
      invoiceDate,
      dueDate,
      items,
      taxRate = 0,
      discountAmount = 0,
      notes,
      terms,
      paymentTerms = 'Net 30',
      currency = 'USD'
    } = body

    if (!clientId || !invoiceDate || !dueDate || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'Client, dates, and at least one item are required' 
      }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      const quantity = parseFloat(item.quantity) || 1
      const unitPrice = parseFloat(item.unit_price) || 0
      return sum + (quantity * unitPrice)
    }, 0)

    const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100
    const discount = parseFloat(discountAmount) || 0
    const total = subtotal + taxAmount - discount

    // Ensure tables exist (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS invoice_company_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        company_name VARCHAR(255),
        invoice_prefix VARCHAR(20) DEFAULT 'INV',
        next_invoice_number INTEGER DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INTEGER,
        invoice_date DATE NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_rate DECIMAL(5, 2) DEFAULT 0,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        notes TEXT,
        terms TEXT,
        payment_terms VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      // Try to add column if table exists
      try {
        await db.execute({ sql: `ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS item_description TEXT` })
      } catch (e) {}
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        item_description TEXT,
        description TEXT,
        quantity DECIMAL(10, 2) NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS invoice_clients (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255),
        company_name VARCHAR(255),
        address TEXT,
        phone VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Get next invoice number
    const settingsResult = await db.execute({
      sql: 'SELECT * FROM invoice_company_settings WHERE user_id = ? LIMIT 1',
      args: [user.userId]
    })
    const settings = settingsResult.rows[0] || {}
    const invoicePrefix = settings.invoice_prefix || 'INV'
    let nextNumber = settings.next_invoice_number || 1
    
    // Ensure unique invoice number
    let invoiceNumber = `${invoicePrefix}-${String(nextNumber).padStart(6, '0')}`
    let exists = true
    while (exists) {
      const checkResult = await db.execute({
        sql: 'SELECT id FROM invoices WHERE invoice_number = ?',
        args: [invoiceNumber]
      })
      if (checkResult.rows.length === 0) {
        exists = false
      } else {
        nextNumber++
        invoiceNumber = `${invoicePrefix}-${String(nextNumber).padStart(6, '0')}`
      }
    }

    // Create invoice
    const invoiceResult = await db.execute({
      sql: `
        INSERT INTO invoices (
          user_id, invoice_number, client_id, invoice_date, due_date,
          status, subtotal, tax_rate, tax_amount, discount_amount,
          total_amount, currency, notes, terms, payment_terms
        )
        VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `,
      args: [
        user.userId,
        invoiceNumber,
        clientId,
        invoiceDate,
        dueDate,
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        currency,
        notes || null,
        terms || null,
        paymentTerms
      ]
    })

    const invoice = invoiceResult.rows[0]

    // Create invoice items
    for (const item of items) {
      await db.execute({
        sql: `
          INSERT INTO invoice_items (invoice_id, item_description, description, quantity, unit_price, total)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          invoice.id,
          item.description,
          item.description,
          parseFloat(item.quantity) || 1,
          parseFloat(item.unit_price) || 0,
          (parseFloat(item.quantity) || 1) * (parseFloat(item.unit_price) || 0)
        ]
      })
    }

    // Update invoice number
    await db.execute({
      sql: `
        UPDATE invoice_company_settings 
        SET next_invoice_number = next_invoice_number + 1 
        WHERE user_id = ?
      `,
      args: [user.userId]
    })

    return NextResponse.json({
      success: true,
      invoice,
      tier
    })
  } catch (error: any) {
    console.error('Invoice Generator Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create invoice' 
    }, { status: 500 })
  }
}

