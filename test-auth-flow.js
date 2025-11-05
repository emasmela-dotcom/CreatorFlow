// 🔐 Authentication Flow Testing Script
// Paste this in browser console

(async function testAuthFlow() {
    console.log('🔐 Testing Authentication Flow...\n');
    
    const API_BASE = window.location.origin;
    const testEmail = `test_${Date.now()}@creatorflow.test`;
    const testPassword = 'TestPassword123!';
    
    let results = [];
    
    // Test 1: Sign Up
    console.log('1️⃣ Testing Sign Up...');
    try {
        const signupResponse = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'signup',
                email: testEmail,
                password: testPassword,
                fullName: 'Test User'
            })
        });
        
        const signupData = await signupResponse.json();
        
        if (signupResponse.ok && signupData.token) {
            console.log('✅ Sign Up: PASSED');
            results.push({ test: 'Sign Up', pass: true });
            
            // Test 2: Login
            console.log('\n2️⃣ Testing Login...');
            const loginResponse = await fetch(`${API_BASE}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'signin',
                    email: testEmail,
                    password: testPassword
                })
            });
            
            const loginData = await loginResponse.json();
            
            if (loginResponse.ok && loginData.token) {
                console.log('✅ Login: PASSED');
                results.push({ test: 'Login', pass: true });
                
                // Test 3: Token Storage
                console.log('\n3️⃣ Testing Token Storage...');
                const storedToken = localStorage.getItem('token');
                if (storedToken === loginData.token) {
                    console.log('✅ Token Storage: PASSED');
                    results.push({ test: 'Token Storage', pass: true });
                } else {
                    console.log('❌ Token Storage: FAILED');
                    results.push({ test: 'Token Storage', pass: false });
                }
                
                // Test 4: Authenticated Request
                console.log('\n4️⃣ Testing Authenticated Request...');
                const authResponse = await fetch(`${API_BASE}/api/posts`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                if (authResponse.ok) {
                    console.log('✅ Authenticated Request: PASSED');
                    results.push({ test: 'Authenticated Request', pass: true });
                } else {
                    console.log('❌ Authenticated Request: FAILED');
                    results.push({ test: 'Authenticated Request', pass: false });
                }
                
            } else {
                console.log('❌ Login: FAILED', loginData.error || 'Unknown error');
                results.push({ test: 'Login', pass: false });
            }
            
        } else {
            console.log('❌ Sign Up: FAILED', signupData.error || 'Unknown error');
            results.push({ test: 'Sign Up', pass: false });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        results.push({ test: 'Sign Up', pass: false, error: error.message });
    }
    
    // Summary
    console.log('\n📊 Auth Flow Summary:');
    const passed = results.filter(r => r.pass).length;
    console.log(`Passed: ${passed}/${results.length}`);
    
    if (passed === results.length) {
        console.log('🎉 All authentication tests passed!');
    } else {
        console.log('❌ Some tests failed');
    }
    
    return results;
})();

