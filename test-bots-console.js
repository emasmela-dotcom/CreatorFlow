// 🤖 Automated Bot Testing - Paste this in browser console (F12)
// Run this on: https://creatorflow-iota.vercel.app/dashboard (AI Bots tab)

(async function testAllBots() {
    console.log('🤖 Starting Automated Bot Tests...\n');
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token found. Please log in first!');
        return;
    }
    
    const API_BASE = window.location.origin;
    const bots = [
        { name: 'Content Assistant', endpoint: 'content-assistant', needsContent: true },
        { name: 'Scheduling Assistant', endpoint: 'scheduling-assistant' },
        { name: 'Engagement Analyzer', endpoint: 'engagement-analyzer' },
        { name: 'Trend Scout', endpoint: 'trend-scout' },
        { name: 'Content Curation', endpoint: 'content-curation' },
        { name: 'Analytics Coach', endpoint: 'analytics-coach' }
    ];
    
    const results = [];
    
    for (const bot of bots) {
        try {
            const startTime = Date.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            let body = { platform: 'instagram' };
            if (bot.needsContent) {
                body = {
                    content: 'Test content for automated testing',
                    platform: 'instagram',
                    hashtags: '#test #automation'
                };
            }
            
            const response = await fetch(`${API_BASE}/api/bots/${bot.endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const hasData = data.analysis || data.recommendations || data.success;
            
            const result = {
                name: bot.name,
                pass: hasData && response.status === 200,
                duration,
                status: response.status,
                hasData
            };
            
            results.push(result);
            
            console.log(
                result.pass ? '✅' : '❌',
                bot.name,
                `| ${result.duration}ms | Status: ${result.status} | Data: ${result.hasData ? 'Yes' : 'No'}`
            );
            
        } catch (error) {
            results.push({
                name: bot.name,
                pass: false,
                error: error.message
            });
            console.error('❌', bot.name, '| Error:', error.message);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    const avgTime = results.filter(r => r.duration).reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
    
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log(`Average Response Time: ${Math.round(avgTime)}ms`);
    console.log(`Success Rate: ${Math.round((passed / results.length) * 100)}%`);
    
    // Show failures
    const failures = results.filter(r => !r.pass);
    if (failures.length > 0) {
        console.log('\n❌ Failed Tests:');
        failures.forEach(f => console.log(`  - ${f.name}: ${f.error || 'Unknown error'}`));
    } else {
        console.log('\n🎉 All bots passed!');
    }
    
    return results;
})();

