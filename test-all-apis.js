// 🧪 Complete API Testing Script
// Paste this in browser console on: https://creatorflow-iota.vercel.app/dashboard

(async function testAllAPIs() {
    console.log('🧪 Starting Complete API Testing...\n');
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found. Please log in first!');
        return;
    }
    
    const API_BASE = window.location.origin;
    const results = [];
    
    // Test all critical APIs
    const apis = [
        { name: 'Get User Posts', method: 'GET', url: '/api/posts', needsAuth: true },
        { name: 'Get Purchase Posts Info', method: 'GET', url: '/api/user/purchase-posts', needsAuth: true },
        { name: 'Get Subscription Info', method: 'GET', url: '/api/subscription/manage', needsAuth: true },
        { name: 'Content Assistant Bot', method: 'POST', url: '/api/bots/content-assistant', needsAuth: true, body: { content: 'Test', platform: 'instagram', hashtags: '#test' } },
        { name: 'Scheduling Assistant Bot', method: 'POST', url: '/api/bots/scheduling-assistant', needsAuth: true, body: { platform: 'instagram' } },
        { name: 'Engagement Analyzer Bot', method: 'POST', url: '/api/bots/engagement-analyzer', needsAuth: true, body: { platform: 'instagram' } },
        { name: 'Trend Scout Bot', method: 'POST', url: '/api/bots/trend-scout', needsAuth: true, body: { platform: 'instagram' } },
        { name: 'Content Curation Bot', method: 'POST', url: '/api/bots/content-curation', needsAuth: true, body: { platform: 'instagram' } },
        { name: 'Analytics Coach Bot', method: 'POST', url: '/api/bots/analytics-coach', needsAuth: true, body: { platform: 'instagram' } },
    ];
    
    for (const api of apis) {
        try {
            const startTime = Date.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const options = {
                method: api.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            };
            
            if (api.needsAuth) {
                options.headers['Authorization'] = `Bearer ${token}`;
            }
            
            if (api.body) {
                options.body = JSON.stringify(api.body);
            }
            
            const response = await fetch(`${API_BASE}${api.url}`, options);
            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;
            
            let data = null;
            try {
                data = await response.json();
            } catch (e) {
                // Not JSON response
            }
            
            const pass = response.ok && (data !== null);
            
            results.push({
                name: api.name,
                pass,
                status: response.status,
                duration,
                hasData: data !== null
            });
            
            console.log(
                pass ? '✅' : '❌',
                api.name,
                `| ${response.status} | ${duration}ms`
            );
            
            if (!pass && data?.error) {
                console.error(`   Error: ${data.error}`);
            }
            
        } catch (error) {
            results.push({
                name: api.name,
                pass: false,
                error: error.message
            });
            console.error('❌', api.name, '| Error:', error.message);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    const avgTime = results.filter(r => r.duration).reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
    
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log(`Average Response Time: ${Math.round(avgTime)}ms`);
    console.log(`Success Rate: ${Math.round((passed / results.length) * 100)}%`);
    
    const failures = results.filter(r => !r.pass);
    if (failures.length > 0) {
        console.log('\n❌ Failed APIs:');
        failures.forEach(f => console.log(`  - ${f.name}: ${f.error || `HTTP ${f.status}`}`));
    } else {
        console.log('\n🎉 All APIs passed!');
    }
    
    return results;
})();

