// server-ws.js
const WebSocket = require('ws')

// Estadísticas del servidor
let stats = {
	messagesCount: 0,
	activeConnections: 0,
	totalConnections: 0,
}

const wss = new WebSocket.Server({ port: 8080 }, () => {
	console.log('WebSocket server listening on ws://localhost:8080')
})

// Función para enviar estadísticas a todos los clientes
function broadcastStats() {
	const statsMessage = JSON.stringify({
		type: 'stats',
		payload: {
			messagesCount: stats.messagesCount,
			activeConnections: stats.activeConnections,
			totalConnections: stats.totalConnections,
		},
	})

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(statsMessage)
		}
	})
}

wss.on('connection', (ws, req) => {
	console.log('Client connected')

	// Actualizar estadísticas de conexión
	stats.activeConnections++
	stats.totalConnections++

	// send welcome
	ws.send(
		JSON.stringify({ type: 'system', payload: { message: 'Bienvenido al WS de prueba' } })
	)

	// Enviar estadísticas iniciales al cliente recién conectado
	ws.send(
		JSON.stringify({
			type: 'stats',
			payload: {
				messagesCount: stats.messagesCount,
				activeConnections: stats.activeConnections,
				totalConnections: stats.totalConnections,
			},
		})
	)

	// Broadcast estadísticas actualizadas a todos los clientes
	broadcastStats()

	ws.on('message', (raw) => {
		console.log('Received message from client')
		let msg
		try {
			msg = JSON.parse(raw)
		} catch (e) {
			msg = { type: 'text', payload: raw.toString() }
		}

		// Incrementar contador de mensajes
		stats.messagesCount++

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

		// Enviar estadísticas actualizadas después de cada mensaje
		broadcastStats()
	})

	ws.on('close', () => {
		console.log('Client disconnected')

		// Decrementar conexiones activas cuando se desconecta un cliente
		stats.activeConnections = Math.max(0, stats.activeConnections - 1)

		// Broadcast estadísticas actualizadas
		broadcastStats()
	})

	ws.on('error', (err) => {
		console.error('WS Error:', err)
	})
})
