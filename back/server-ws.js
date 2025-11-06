// server-ws.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server listening on ws://localhost:8080');
});

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  // send welcome
  ws.send(JSON.stringify({ type: 'system', payload: { message: 'Bienvenido al WS de prueba' } }));

  ws.on('message', (raw) => {
    console.log('Received:', raw.toString());
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (e) {
      msg = { type: 'text', payload: raw.toString() };
    }

    const broadcast = JSON.stringify({
      type: 'broadcast',
      payload: { from: 'server', message: msg.payload, receivedAt: Date.now() }
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(broadcast);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WS Error:', err);
  });
});
