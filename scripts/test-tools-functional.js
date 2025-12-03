#!/usr/bin/env node

/**
 * Comprehensive Functional Tool Testing Script
 * Actually tests tool functionality, not just endpoint existence
 */

const BASE_URL = process.env.BASE_URL || 'https://creatorflow-iota.vercel.app'

// Test results storage
const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  authToken: null,
  testUserId: null
}

function logTest(name, status, details = {}) {
  const test = {
    name,
    status, // 'pass', 'fail', 'error'
    details,
    timestamp: new Date().toISOString()
  }
  results.tests.push(test)
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '⚠️' : '❌'
  console.log(`${icon} ${name}: ${status.toUpperCase()}`)
  if (details.message) console.log(`   ${details.message}`)
  if (details.error) console.log(`   Error: ${details.error}`)
}

async function makeRequest(method, path, body = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${BASE_URL}${path}`, options)
    const data = await response.json().catch(() => ({ error: 'Invalid JSON response' }))
    
    return {
      status: response.status,
      ok: response.ok,
      data
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    }
  }
}

// Step 1: Create test user and authenticate
async function setupAuth() {
  console.log('🔐 Setting up authentication...')
  
  // Use a random domain to avoid abuse prevention limits
  const randomDomain = `test${Math.floor(Math.random() * 10000)}.example.com`
  const testEmail = `test-${Date.now()}@${randomDomain}`
  const testPassword = 'TestPassword123!'
  
  // Try to sign up
  const signupResult = await makeRequest('POST', '/api/auth', {
    action: 'signup',
    email: testEmail,
    password: testPassword,
    fullName: 'Test User'
  })
  
  if (signupResult.ok && signupResult.data.token) {
    results.authToken = signupResult.data.token
    results.testUserId = signupResult.data.user?.id
    logTest('Authentication Setup', 'pass', {
      message: `Test user created: ${testEmail}`
    })
    return true
  }
  
  // If signup failed, try login (user might already exist)
  const loginResult = await makeRequest('POST', '/api/auth', {
    action: 'signin',
    email: testEmail,
    password: testPassword
  })
  
  if (loginResult.ok && loginResult.data.token) {
    results.authToken = loginResult.data.token
    results.testUserId = loginResult.data.user?.id
    logTest('Authentication Setup', 'pass', {
      message: `Test user logged in: ${testEmail}`
    })
    return true
  }
  
  logTest('Authentication Setup', 'error', {
    message: 'Could not create or login test user',
    error: signupResult.data?.error || loginResult.data?.error || 'Unknown error'
  })
  return false
}

// Test Documents Feature
async function testDocuments() {
  console.log('\n📄 Testing Documents Feature...')
  
  if (!results.authToken) {
    logTest('Documents - Create', 'error', { message: 'No auth token' })
    return
  }
  
  // Create a document
  const createResult = await makeRequest('POST', '/api/documents', {
    title: 'Test Document',
    content: 'This is a test document for functional testing.',
    category: 'Test',
    tags: 'test, functional',
    is_pinned: false
  }, results.authToken)
  
  if (!createResult.ok || !createResult.data.success) {
    logTest('Documents - Create', 'fail', {
      message: `Failed to create document`,
      error: createResult.data?.error || 'Unknown error',
      status: createResult.status
    })
    return
  }
  
  const docId = createResult.data.document?.id
  logTest('Documents - Create', 'pass', {
    message: `Document created with ID: ${docId}`
  })
  
  // Get all documents
  const getResult = await makeRequest('GET', '/api/documents', null, results.authToken)
  
  if (!getResult.ok || !getResult.data.success) {
    logTest('Documents - Read', 'fail', {
      message: 'Failed to retrieve documents',
      error: getResult.data?.error
    })
  } else {
    const docs = getResult.data.documents || []
    const foundDoc = docs.find(d => d.id === docId)
    if (foundDoc) {
      logTest('Documents - Read', 'pass', {
        message: `Retrieved ${docs.length} document(s), found created document`
      })
    } else {
      logTest('Documents - Read', 'fail', {
        message: 'Created document not found in list'
      })
    }
  }
  
  // Update document
  if (docId) {
    const updateResult = await makeRequest('POST', '/api/documents', {
      id: docId,
      title: 'Updated Test Document',
      content: 'This document has been updated.',
      category: 'Test',
      tags: 'test, updated',
      is_pinned: true
    }, results.authToken)
    
    if (updateResult.ok && updateResult.data.success) {
      logTest('Documents - Update', 'pass', {
        message: 'Document updated successfully'
      })
    } else {
      logTest('Documents - Update', 'fail', {
        message: 'Failed to update document',
        error: updateResult.data?.error
      })
    }
    
    // Delete document
    const deleteResult = await makeRequest('DELETE', `/api/documents?id=${docId}`, null, results.authToken)
    
    if (deleteResult.ok && deleteResult.data.success) {
      logTest('Documents - Delete', 'pass', {
        message: 'Document deleted successfully'
      })
    } else {
      logTest('Documents - Delete', 'fail', {
        message: 'Failed to delete document',
        error: deleteResult.data?.error
      })
    }
  }
}

// Test Hashtag Research
async function testHashtagResearch() {
  console.log('\n#️⃣ Testing Hashtag Research...')
  
  if (!results.authToken) {
    logTest('Hashtag Research - Research', 'error', { message: 'No auth token' })
    return
  }
  
  // Research hashtags
  const researchResult = await makeRequest('POST', '/api/hashtag-research', {
    action: 'research',
    niche: 'technology',
    platform: 'instagram',
    content: 'AI and machine learning'
  }, results.authToken)
  
  if (!researchResult.ok) {
    logTest('Hashtag Research - Research', 'fail', {
      message: 'Failed to research hashtags',
      error: researchResult.data?.error,
      status: researchResult.status
    })
  } else {
    const trending = researchResult.data.trending || []
    const recommended = researchResult.data.recommended || []
    const totalHashtags = trending.length + recommended.length
    logTest('Hashtag Research - Research', 'pass', {
      message: `Found ${totalHashtags} hashtag suggestions (${trending.length} trending, ${recommended.length} recommended)`
    })
  }
  
  // Save a hashtag set
  const saveResult = await makeRequest('POST', '/api/hashtag-research', {
    action: 'save',
    name: 'Test Hashtag Set',
    hashtags: '#ai #machinelearning #tech #innovation',
    platform: 'instagram',
    description: 'Technology hashtags'
  }, results.authToken)
  
  if (!saveResult.ok || !saveResult.data.success) {
    logTest('Hashtag Research - Save Set', 'fail', {
      message: 'Failed to save hashtag set',
      error: saveResult.data?.error
    })
  } else {
    const setId = saveResult.data.hashtagSet?.id
    logTest('Hashtag Research - Save Set', 'pass', {
      message: `Hashtag set saved with ID: ${setId}`
    })
    
    // Get saved sets
    const getSetsResult = await makeRequest('GET', '/api/hashtag-research?action=sets', null, results.authToken)
    
    if (getSetsResult.ok && getSetsResult.data.success) {
      const sets = getSetsResult.data.hashtagSets || []
      const foundSet = sets.find(s => s.id === setId)
      if (foundSet) {
        logTest('Hashtag Research - Retrieve Sets', 'pass', {
          message: `Retrieved ${sets.length} set(s), found saved set`
        })
      } else {
        logTest('Hashtag Research - Retrieve Sets', 'fail', {
          message: 'Saved set not found in list'
        })
      }
    } else {
      logTest('Hashtag Research - Retrieve Sets', 'fail', {
        message: 'Failed to retrieve hashtag sets',
        error: getSetsResult.data?.error
      })
    }
  }
}

// Test Content Templates
async function testContentTemplates() {
  console.log('\n📝 Testing Content Templates...')
  
  if (!results.authToken) {
    logTest('Content Templates - Create', 'error', { message: 'No auth token' })
    return
  }
  
  // Create a template
  const createResult = await makeRequest('POST', '/api/content-templates', {
    name: 'Test Template',
    platform: 'instagram',
    content: 'Check out this amazing {{topic}}! #{{hashtag}}',
    variables: JSON.stringify(['topic', 'hashtag']),
    category: 'Promotional',
    description: 'A test template for functional testing'
  }, results.authToken)
  
  if (!createResult.ok || !createResult.data.success) {
    logTest('Content Templates - Create', 'fail', {
      message: 'Failed to create template',
      error: createResult.data?.error,
      status: createResult.status
    })
    return
  }
  
  const templateId = createResult.data.template?.id
  logTest('Content Templates - Create', 'pass', {
    message: `Template created with ID: ${templateId}`
  })
  
  // Get all templates
  const getResult = await makeRequest('GET', '/api/content-templates', null, results.authToken)
  
  if (!getResult.ok || !getResult.data.success) {
    logTest('Content Templates - Read', 'fail', {
      message: 'Failed to retrieve templates',
      error: getResult.data?.error
    })
  } else {
    const templates = getResult.data.templates || []
    const foundTemplate = templates.find(t => t.id === templateId)
    if (foundTemplate) {
      logTest('Content Templates - Read', 'pass', {
        message: `Retrieved ${templates.length} template(s), found created template`
      })
    } else {
      logTest('Content Templates - Read', 'fail', {
        message: 'Created template not found in list'
      })
    }
  }
  
  // Update template (POST with id)
  if (templateId) {
    const updateResult = await makeRequest('POST', '/api/content-templates', {
      id: templateId,
      name: 'Updated Test Template',
      platform: 'instagram',
      content: 'Updated content with {{topic}}!',
      variables: JSON.stringify(['topic'])
    }, results.authToken)
    
    if (updateResult.ok && updateResult.data.success) {
      logTest('Content Templates - Update', 'pass', {
        message: 'Template updated successfully'
      })
    } else {
      logTest('Content Templates - Update', 'fail', {
        message: 'Failed to update template',
        error: updateResult.data?.error
      })
    }
    
    // Delete template
    const deleteResult = await makeRequest('DELETE', `/api/content-templates?id=${templateId}`, null, results.authToken)
    
    if (deleteResult.ok && deleteResult.data.success) {
      logTest('Content Templates - Delete', 'pass', {
        message: 'Template deleted successfully'
      })
    } else {
      logTest('Content Templates - Delete', 'fail', {
        message: 'Failed to delete template',
        error: deleteResult.data?.error
      })
    }
  }
}

// Test Engagement Inbox
async function testEngagementInbox() {
  console.log('\n💬 Testing Engagement Inbox...')
  
  if (!results.authToken) {
    logTest('Engagement Inbox - Add', 'error', { message: 'No auth token' })
    return
  }
  
  // Add engagement item
  const addResult = await makeRequest('POST', '/api/engagement-inbox', {
    action: 'add',
    platform: 'instagram',
    type: 'comment',
    author_name: 'Test User',
    author_handle: '@testuser',
    content: 'Great post! Love this content.',
    engagement_metrics: { likes: 5, replies: 2 }
  }, results.authToken)
  
  if (!addResult.ok || !addResult.data.success) {
    logTest('Engagement Inbox - Add', 'fail', {
      message: 'Failed to add engagement item',
      error: addResult.data?.error,
      status: addResult.status
    })
    return
  }
  
  const engagementId = addResult.data.engagement?.id
  logTest('Engagement Inbox - Add', 'pass', {
    message: `Engagement item added with ID: ${engagementId}`
  })
  
  // Get all engagement items
  const getResult = await makeRequest('GET', '/api/engagement-inbox', null, results.authToken)
  
  if (!getResult.ok || !getResult.data.success) {
    logTest('Engagement Inbox - Read', 'fail', {
      message: 'Failed to retrieve engagement items',
      error: getResult.data?.error
    })
  } else {
    const items = getResult.data.engagements || []
    const foundItem = items.find(i => i.id === engagementId)
    if (foundItem) {
      logTest('Engagement Inbox - Read', 'pass', {
        message: `Retrieved ${items.length} item(s), found added item`
      })
    } else {
      logTest('Engagement Inbox - Read', 'fail', {
        message: 'Added item not found in list'
      })
    }
  }
  
  // Update status
  if (engagementId) {
    const updateResult = await makeRequest('POST', '/api/engagement-inbox', {
      action: 'update',
      id: engagementId,
      status: 'read'
    }, results.authToken)
    
    if (updateResult.ok && updateResult.data.success) {
      logTest('Engagement Inbox - Update Status', 'pass', {
        message: 'Engagement status updated successfully'
      })
    } else {
      logTest('Engagement Inbox - Update Status', 'fail', {
        message: 'Failed to update engagement status',
        error: updateResult.data?.error
      })
    }
  }
}

// Test AI Bots
async function testAIBots() {
  console.log('\n🤖 Testing AI Bots...')
  
  if (!results.authToken) {
    logTest('AI Bots - Content Assistant', 'error', { message: 'No auth token' })
    return
  }
  
  // Test Content Assistant
  const contentAssistantResult = await makeRequest('POST', '/api/bots/content-assistant', {
    content: 'I want to create a post about AI technology',
    platform: 'instagram',
    hashtags: '#ai #tech'
  }, results.authToken)
  
  if (!contentAssistantResult.ok) {
    logTest('AI Bots - Content Assistant', 'fail', {
      message: 'Failed to get content assistance',
      error: contentAssistantResult.data?.error,
      status: contentAssistantResult.status
    })
  } else {
    const hasAnalysis = contentAssistantResult.data.analysis
    logTest('AI Bots - Content Assistant', hasAnalysis ? 'pass' : 'fail', {
      message: hasAnalysis ? `Received analysis with score ${hasAnalysis.score}` : 'No analysis in response'
    })
  }
  
  // Test Content Repurposing
  const repurposingResult = await makeRequest('POST', '/api/bots/content-repurposing', {
    originalContent: 'This is a blog post about AI and machine learning.',
    contentType: 'blog',
    targetPlatforms: ['instagram', 'twitter']
  }, results.authToken)
  
  if (!repurposingResult.ok) {
    logTest('AI Bots - Content Repurposing', 'fail', {
      message: 'Failed to repurpose content',
      error: repurposingResult.data?.error
    })
  } else {
    const hasRepurposed = repurposingResult.data.repurposed && repurposingResult.data.repurposed.length > 0
    logTest('AI Bots - Content Repurposing', hasRepurposed ? 'pass' : 'fail', {
      message: hasRepurposed ? `Content repurposed for ${repurposingResult.data.repurposed.length} platform(s)` : 'No repurposed content in response'
    })
  }
  
  // Test Content Gap Analyzer
  const gapAnalyzerResult = await makeRequest('POST', '/api/bots/content-gap-analyzer', {
    competitorTopics: ['AI', 'Machine Learning', 'Technology']
  }, results.authToken)
  
  if (!gapAnalyzerResult.ok) {
    logTest('AI Bots - Content Gap Analyzer', 'fail', {
      message: 'Failed to analyze content gaps',
      error: gapAnalyzerResult.data?.error
    })
  } else {
    const hasGaps = gapAnalyzerResult.data.gaps || gapAnalyzerResult.data.suggestions
    logTest('AI Bots - Content Gap Analyzer', hasGaps ? 'pass' : 'fail', {
      message: hasGaps ? 'Content gaps identified' : 'No gaps found in response'
    })
  }
}

// Run all tests
async function runAllTests() {
  console.log('='.repeat(60))
  console.log('  CreatorFlow Functional Tool Test')
  console.log('='.repeat(60))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Time: ${new Date().toLocaleString()}`)
  console.log('')
  
  // Setup
  const authSuccess = await setupAuth()
  if (!authSuccess) {
    console.log('\n❌ Cannot proceed without authentication')
    return
  }
  
  // Run functional tests
  await testDocuments()
  await testHashtagResearch()
  await testContentTemplates()
  await testEngagementInbox()
  await testAIBots()
  
  // Summary
  console.log('')
  console.log('='.repeat(60))
  console.log('  TEST SUMMARY')
  console.log('='.repeat(60))
  
  const passed = results.tests.filter(t => t.status === 'pass').length
  const failed = results.tests.filter(t => t.status === 'fail').length
  const errors = results.tests.filter(t => t.status === 'error').length
  
  console.log(`✅ Passed: ${passed}`)
  console.log(`⚠️  Failed: ${failed}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📊 Total: ${results.tests.length}`)
  console.log('')
  
  // Generate report
  const fs = require('fs')
  const report = `# CreatorFlow Functional Tool Test Report

**Generated:** ${results.timestamp}
**Base URL:** ${results.baseUrl}

## Test Results Summary

- ✅ **Passed:** ${passed}
- ⚠️  **Failed:** ${failed}
- ❌ **Errors:** ${errors}
- 📊 **Total Tests:** ${results.tests.length}

---

## Detailed Test Results

${results.tests.map(test => {
  const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '⚠️' : '❌'
  return `### ${icon} ${test.name}

- **Status:** ${test.status.toUpperCase()}
- **Time:** ${test.timestamp}
${test.details.message ? `- **Details:** ${test.details.message}` : ''}
${test.details.error ? `- **Error:** ${test.details.error}` : ''}
${test.details.status ? `- **HTTP Status:** ${test.details.status}` : ''}
`
}).join('\n')}

---

## Recommendations

${errors > 0 ? `
### ❌ Critical Issues

The following tests had errors:
${results.tests.filter(t => t.status === 'error').map(t => `- ${t.name}: ${t.details.error || t.details.message || 'Unknown error'}`).join('\n')}
` : ''}

${failed > 0 ? `
### ⚠️  Failed Tests

The following tests failed:
${results.tests.filter(t => t.status === 'fail').map(t => `- ${t.name}: ${t.details.error || t.details.message || 'Unknown issue'}`).join('\n')}
` : ''}

${passed === results.tests.length ? `
### ✅ All Tests Passed!

All tools are functioning correctly. The system is ready for use.
` : ''}

---

**Note:** This is a functional test that actually exercises tool functionality, not just endpoint existence.
`

  fs.writeFileSync('tools_report.md', report)
  console.log('📄 Report saved to: tools_report.md')
}

// Run
runAllTests().catch(error => {
  console.error('❌ Test execution failed:', error)
  process.exit(1)
})

