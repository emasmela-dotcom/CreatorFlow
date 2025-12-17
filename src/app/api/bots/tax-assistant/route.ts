import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Creator Tax Assistant - Helps creators with taxes
 * Available for all tiers, performance scales with plan tier
 */

interface TaxAnalysis {
  year: number
  income: {
    total: number
    bySource: {
      sponsorships: number
      affiliate: number
      products: number
      ads: number
      other: number
    }
    quarterly: {
      Q1: number
      Q2: number
      Q3: number
      Q4: number
    }
  }
  expenses: {
    total: number
    byCategory: {
      equipment: number
      software: number
      homeOffice: number
      travel: number
      marketing: number
      professional: number
      other: number
    }
    deductible: number
    nonDeductible: number
  }
  taxes: {
    estimatedTax: number
    selfEmploymentTax: number
    incomeTax: number
    totalTax: number
    quarterlyEstimate: number
    taxRate: number
  }
  deductions: {
    homeOffice: {
      eligible: boolean
      amount: number
      method: string
    }
    equipment: {
      total: number
      items: Array<{ name: string; amount: number; deductible: boolean }>
    }
    software: {
      total: number
      subscriptions: Array<{ name: string; amount: number }>
    }
  }
  recommendations: Array<{
    category: 'income' | 'expenses' | 'deductions' | 'taxes' | 'planning'
    priority: 'high' | 'medium' | 'low'
    issue: string
    suggestion: string
    action: string
  }>
  reports: {
    scheduleC: {
      grossIncome: number
      expenses: number
      netIncome: number
    }
    quarterlyTaxes: {
      Q1: { due: string; amount: number; paid: number }
      Q2: { due: string; amount: number; paid: number }
      Q3: { due: string; amount: number; paid: number }
      Q4: { due: string; amount: number; paid: number }
    }
  }
}

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = $1',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

async function getIncomeData(userId: string, year: number): Promise<{
  total: number
  bySource: { sponsorships: number; affiliate: number; products: number; ads: number; other: number }
  quarterly: { Q1: number; Q2: number; Q3: number; Q4: number }
}> {
  try {
    // Get income from invoices
    const invoiceResult = await db.execute({
      sql: `
        SELECT 
          amount,
          EXTRACT(QUARTER FROM created_at) as quarter,
          category
        FROM invoices
        WHERE user_id = $1 
          AND EXTRACT(YEAR FROM created_at) = $2
          AND status = 'paid'
      `,
      args: [userId, year]
    })
    
    let total = 0
    const bySource = {
      sponsorships: 0,
      affiliate: 0,
      products: 0,
      ads: 0,
      other: 0
    }
    const quarterly = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }
    
    invoiceResult.rows.forEach((row: any) => {
      const amount = parseFloat(row.amount || 0)
      total += amount
      
      const category = (row.category || 'other').toLowerCase()
      if (category.includes('sponsor') || category.includes('brand')) {
        bySource.sponsorships += amount
      } else if (category.includes('affiliate')) {
        bySource.affiliate += amount
      } else if (category.includes('product') || category.includes('sale')) {
        bySource.products += amount
      } else if (category.includes('ad') || category.includes('advertising')) {
        bySource.ads += amount
      } else {
        bySource.other += amount
      }
      
      const quarter = parseInt(row.quarter || 1)
      if (quarter === 1) quarterly.Q1 += amount
      else if (quarter === 2) quarterly.Q2 += amount
      else if (quarter === 3) quarterly.Q3 += amount
      else if (quarter === 4) quarterly.Q4 += amount
    })
    
    return { total, bySource, quarterly }
  } catch (error) {
    return {
      total: 0,
      bySource: { sponsorships: 0, affiliate: 0, products: 0, ads: 0, other: 0 },
      quarterly: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }
    }
  }
}

async function getExpenseData(userId: string, year: number): Promise<{
  total: number
  byCategory: { equipment: number; software: number; homeOffice: number; travel: number; marketing: number; professional: number; other: number }
  deductible: number
  nonDeductible: number
}> {
  try {
    const expenseResult = await db.execute({
      sql: `
        SELECT 
          amount,
          category,
          is_deductible
        FROM expenses
        WHERE user_id = $1 
          AND EXTRACT(YEAR FROM expense_date) = $2
      `,
      args: [userId, year]
    })
    
    let total = 0
    let deductible = 0
    let nonDeductible = 0
    const byCategory = {
      equipment: 0,
      software: 0,
      homeOffice: 0,
      travel: 0,
      marketing: 0,
      professional: 0,
      other: 0
    }
    
    expenseResult.rows.forEach((row: any) => {
      const amount = parseFloat(row.amount || 0)
      total += amount
      
      if (row.is_deductible !== false) {
        deductible += amount
      } else {
        nonDeductible += amount
      }
      
      const category = (row.category || 'other').toLowerCase()
      if (category.includes('equipment') || category.includes('camera') || category.includes('computer')) {
        byCategory.equipment += amount
      } else if (category.includes('software') || category.includes('subscription') || category.includes('app')) {
        byCategory.software += amount
      } else if (category.includes('office') || category.includes('home')) {
        byCategory.homeOffice += amount
      } else if (category.includes('travel')) {
        byCategory.travel += amount
      } else if (category.includes('marketing') || category.includes('advertising')) {
        byCategory.marketing += amount
      } else if (category.includes('professional') || category.includes('legal') || category.includes('accounting')) {
        byCategory.professional += amount
      } else {
        byCategory.other += amount
      }
    })
    
    return { total, byCategory, deductible, nonDeductible }
  } catch (error) {
    return {
      total: 0,
      byCategory: { equipment: 0, software: 0, homeOffice: 0, travel: 0, marketing: 0, professional: 0, other: 0 },
      deductible: 0,
      nonDeductible: 0
    }
  }
}

function calculateTaxes(
  income: number,
  expenses: number,
  selfEmploymentTaxRate: number = 0.1413,
  incomeTaxRate: number = 0.22
): {
  estimatedTax: number
  selfEmploymentTax: number
  incomeTax: number
  totalTax: number
  quarterlyEstimate: number
  taxRate: number
} {
  const netIncome = income - expenses
  
  // Self-employment tax (14.13% on net income up to $160,200 for 2024)
  const selfEmploymentTax = Math.min(netIncome, 160200) * selfEmploymentTaxRate
  
  // Income tax (on net income after self-employment tax deduction)
  const incomeAfterSETax = netIncome - (selfEmploymentTax / 2) // Half of SE tax is deductible
  const incomeTax = incomeAfterSETax * incomeTaxRate
  
  const totalTax = selfEmploymentTax + incomeTax
  const quarterlyEstimate = totalTax / 4
  const taxRate = income > 0 ? (totalTax / income) * 100 : 0
  
  return {
    estimatedTax: totalTax,
    selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
    incomeTax: Math.round(incomeTax * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    quarterlyEstimate: Math.round(quarterlyEstimate * 100) / 100,
    taxRate: Math.round(taxRate * 100) / 100
  }
}

function generateTaxAnalysis(
  year: number,
  income: any,
  expenses: any,
  taxes: any
): TaxAnalysis {
  const recommendations: TaxAnalysis['recommendations'] = []
  
  // Income recommendations
  if (income.total === 0) {
    recommendations.push({
      category: 'income',
      priority: 'high',
      issue: 'No income recorded for this year',
      suggestion: 'Make sure to record all income sources (sponsorships, affiliate, products)',
      action: 'Add income records in the Expenses/Invoices section'
    })
  }
  
  // Expense recommendations
  if (expenses.total === 0 && income.total > 0) {
    recommendations.push({
      category: 'expenses',
      priority: 'high',
      issue: 'No expenses recorded',
      suggestion: 'Track deductible expenses to reduce taxable income',
      action: 'Add expenses for equipment, software, home office, travel, etc.'
    })
  }
  
  if (expenses.deductible < income.total * 0.1) {
    recommendations.push({
      category: 'expenses',
      priority: 'medium',
      issue: 'Low expense ratio',
      suggestion: 'Consider tracking more deductible expenses (software subscriptions, equipment, home office)',
      action: 'Review expense categories and add missing deductions'
    })
  }
  
  // Tax recommendations
  if (taxes.taxRate > 30) {
    recommendations.push({
      category: 'taxes',
      priority: 'high',
      issue: 'High tax rate',
      suggestion: 'Consider increasing deductible expenses or consulting a tax professional',
      action: 'Review expenses and maximize deductions'
    })
  }
  
  if (taxes.quarterlyEstimate > 1000) {
    recommendations.push({
      category: 'taxes',
      priority: 'high',
      issue: 'Quarterly tax payments required',
      suggestion: `Make quarterly estimated tax payments of $${taxes.quarterlyEstimate.toLocaleString()} to avoid penalties`,
      action: 'Set up quarterly tax payments (due: Jan 15, Apr 15, Jun 15, Sep 15)'
    })
  }
  
  // Deduction recommendations
  if (expenses.byCategory.homeOffice === 0 && income.total > 0) {
    recommendations.push({
      category: 'deductions',
      priority: 'medium',
      issue: 'Home office deduction not claimed',
      suggestion: 'If you work from home, you may be eligible for home office deduction',
      action: 'Calculate home office deduction (simplified or actual expense method)'
    })
  }
  
  // Planning recommendations
  if (income.quarterly.Q4 > income.quarterly.Q1 * 2) {
    recommendations.push({
      category: 'planning',
      priority: 'medium',
      issue: 'Income increased significantly in Q4',
      suggestion: 'Consider increasing Q4 estimated tax payment to avoid underpayment penalty',
      action: 'Review Q4 income and adjust tax payment'
    })
  }
  
  const netIncome = income.total - expenses.deductible
  
  return {
    year,
    income,
    expenses,
    taxes,
    deductions: {
      homeOffice: {
        eligible: expenses.byCategory.homeOffice > 0,
        amount: expenses.byCategory.homeOffice,
        method: 'simplified'
      },
      equipment: {
        total: expenses.byCategory.equipment,
        items: []
      },
      software: {
        total: expenses.byCategory.software,
        subscriptions: []
      }
    },
    recommendations,
    reports: {
      scheduleC: {
        grossIncome: income.total,
        expenses: expenses.deductible,
        netIncome: Math.round(netIncome * 100) / 100
      },
      quarterlyTaxes: {
        Q1: { due: `${year}-04-15`, amount: taxes.quarterlyEstimate, paid: 0 },
        Q2: { due: `${year}-06-15`, amount: taxes.quarterlyEstimate, paid: 0 },
        Q3: { due: `${year}-09-15`, amount: taxes.quarterlyEstimate, paid: 0 },
        Q4: { due: `${year + 1}-01-15`, amount: taxes.quarterlyEstimate, paid: 0 }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { year } = body

    const taxYear = year || new Date().getFullYear()

    const limitCheck = await canMakeAICall(user.userId)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: limitCheck.message || 'AI call limit exceeded',
        current: limitCheck.current,
        limit: limitCheck.limit,
        upgradeRequired: true
      }, { status: 403 })
    }

    const tier = await getUserPlanTier(user.userId)

    // Get income and expense data
    const incomeData = await getIncomeData(user.userId, taxYear)
    const expenseData = await getExpenseData(user.userId, taxYear)

    // Calculate taxes
    const taxData = calculateTaxes(incomeData.total, expenseData.deductible)

    // Generate analysis
    const analysis = generateTaxAnalysis(taxYear, incomeData, expenseData, taxData)

    // Save analysis
    try {
      await db.execute({
        sql: `CREATE TABLE IF NOT EXISTS tax_analyses (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          tax_year INTEGER NOT NULL,
          total_income DECIMAL(10, 2) NOT NULL,
          total_expenses DECIMAL(10, 2) NOT NULL,
          estimated_tax DECIMAL(10, 2) NOT NULL,
          analysis_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )`
      })

      await db.execute({
        sql: `
          INSERT INTO tax_analyses (
            user_id, tax_year, total_income, total_expenses, estimated_tax, analysis_data, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          ON CONFLICT (user_id, tax_year)
          DO UPDATE SET
            total_income = EXCLUDED.total_income,
            total_expenses = EXCLUDED.total_expenses,
            estimated_tax = EXCLUDED.estimated_tax,
            analysis_data = EXCLUDED.analysis_data,
            updated_at = NOW()
        `,
        args: [
          user.userId,
          taxYear,
          incomeData.total,
          expenseData.total,
          taxData.totalTax,
          JSON.stringify(analysis)
        ]
      })
    } catch (error) {
      // Try without ON CONFLICT
      try {
        await db.execute({
          sql: `
            INSERT INTO tax_analyses (
              user_id, tax_year, total_income, total_expenses, estimated_tax, analysis_data, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          `,
          args: [
            user.userId,
            taxYear,
            incomeData.total,
            expenseData.total,
            taxData.totalTax,
            JSON.stringify(analysis)
          ]
        })
      } catch (e) {
        console.error('Error saving tax analysis:', e)
      }
    }

    await logAICall(user.userId, 'Tax Assistant', '/api/bots/tax-assistant')

    return NextResponse.json({
      success: true,
      analysis,
      tier,
      usage: {
        aiCalls: {
          current: limitCheck.current + 1,
          limit: limitCheck.limit
        }
      }
    })
  } catch (error: any) {
    console.error('Tax Assistant Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to generate tax analysis'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    try {
      const result = await db.execute({
        sql: `
          SELECT tax_year, total_income, total_expenses, estimated_tax, analysis_data, created_at, updated_at
          FROM tax_analyses
          WHERE user_id = $1 AND tax_year = $2
          LIMIT 1
        `,
        args: [user.userId, year]
      })

      if (result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          analysis: result.rows[0]
        })
      } else {
        return NextResponse.json({
          success: true,
          analysis: null,
          message: 'No tax analysis found for this year'
        })
      }
    } catch (error) {
      return NextResponse.json({
        success: true,
        analysis: null
      })
    }
  } catch (error: any) {
    console.error('Tax Assistant GET error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get tax analysis'
    }, { status: 500 })
  }
}

