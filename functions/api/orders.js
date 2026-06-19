export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing order ID' }), { status: 400 });
  }

  try {
    const data = await context.env.MORYTORY_ORDERS.get(`order_${id}`);
    if (!data) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    
    // Set CORS headers
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const { orderId, targetImage, effect, arVideo, music, overlayText, overlayFont, overlayFontSize, createdAt } = data;

    if (!orderId || !targetImage) {
      return new Response(JSON.stringify({ error: 'Missing orderId or targetImage' }), { status: 400 });
    }

    // Nén base64 và lưu vào KV
    const orderData = JSON.stringify({
      orderId,
      targetImage,
      effect: effect || 'snow',
      arVideo: arVideo || null,
      music: music || null,
      overlayText: overlayText || '',
      overlayFont: overlayFont || 'serif',
      overlayFontSize: overlayFontSize || 16,
      createdAt: createdAt || new Date().toISOString()
    });

    // Lưu vào KV store với expiration là 7 ngày (604800s) để tiết kiệm dung lượng
    await context.env.MORYTORY_ORDERS.put(`order_${orderId}`, orderData, {
      expirationTtl: 604800
    });

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
