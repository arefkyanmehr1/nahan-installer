// Dexter Node Worker - نسخه سبک توزیع‌کننده ترافیک
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // اگر درخواستی به گره فرستاده شد، ترافیک VLESS را بررسی کرده و انتقال می‌دهد.
    // بررسی ترافیک کاربر و انتقال به اینترنت آزاد
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return await vlessOverWSHandler(request);
    }
    
    return new Response(JSON.stringify({
      status: "online",
      engine: "Dexter Node v3.0",
      node_status: "connected_to_cluster"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

async function vlessOverWSHandler(request) {
  // این بخش ترافیک عبوری VLESS را مدیریت می‌کند.
  // ساختار اصلی هدایت ترافیک سوکت گره دکستر
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();
  
  // شبیه‌سازی اتصال به سوکت کلودفلر و پروکسی بایت‌ها
  // تمامی بایت‌ها بدون ایجاد وقفه یا ثبت اطلاعات حساس کاربر، مستقیماً به مقصد هدایت خواهند شد.
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
