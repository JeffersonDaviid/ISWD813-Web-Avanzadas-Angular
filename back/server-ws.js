// server-ws.js
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 }, () => {
	console.log('WebSocket server listening on ws://localhost:8080')
})

wss.on('connection', (ws, req) => {
	console.log('Client connected')

	// send welcome
	ws.send(
		JSON.stringify({ type: 'system', payload: { message: 'Bienvenido al WS de prueba' } })
	)

	ws.on('message', (raw) => {
		console.log('Received message from client')
		let msg
		try {
			msg = JSON.parse(raw)
		} catch (e) {
			msg = { type: 'text', payload: raw.toString() }
		}

		// Determine broadcast structure based on message type
		let broadcast
		if (msg.type === 'file') {
			broadcast = JSON.stringify({
				type: 'broadcast',
				messageType: 'file',
				payload: {
					from: 'user',
					fileName: msg.payload.fileName,
					fileSize: msg.payload.fileSize,
					fileType: msg.payload.fileType,
					fileData: msg.payload.fileData,
					receivedAt: Date.now(),
				},
			})
		} else {
			// Handle text messages properly
			let messageText = ''
			if (typeof msg.payload === 'string') {
				messageText = msg.payload
			} else if (msg.payload && msg.payload.text) {
				messageText = msg.payload.text
			} else if (msg.payload && msg.payload.message) {
				messageText = msg.payload.message
			} else {
				messageText = String(msg.payload)
			}

			broadcast = JSON.stringify({
				type: 'broadcast',
				messageType: 'text',
				payload: {
					from: 'user',
					message: messageText,
					text: messageText, // Include both for compatibility
					receivedAt: Date.now(),
				},
			})
		}

		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(broadcast)
			}
		})
	})

	ws.on('close', () => {
		console.log('Client disconnected')
	})

	ws.on('error', (err) => {
		console.error('WS Error:', err)
	})
})
