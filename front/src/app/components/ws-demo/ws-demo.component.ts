import { Component, OnInit, OnDestroy } from '@angular/core'
import { WebsocketService, WSMessage } from '../../services/websocket.service'
import { Subscription } from 'rxjs'

@Component({
	selector: 'app-ws-demo',
	template: `
		<div class="chat-container">
			<!-- Header -->
			<div class="header">
				<h2 class="title">WebSocket Chat</h2>
				<div class="status">
					<span
						class="status-dot"
						[class.connected]="connected"
						[class.disconnected]="!connected"></span>
					<span class="status-text">{{ connected ? 'Conectado' : 'Desconectado' }}</span>
				</div>
			</div>

			<!-- Input Section -->
			<div class="input-section">
				<!-- Text Message Input -->
				<div class="message-input-container">
					<input
						[(ngModel)]="outMsg"
						placeholder="Escribe tu mensaje..."
						class="message-input"
						(keydown.enter)="send()" />
					<button
						(click)="send()"
						class="send-button"
						[disabled]="!outMsg.trim()">
						<span class="send-icon">→</span>
					</button>
				</div>

				<!-- File Input -->
				<div class="file-input-container">
					<input
						type="file"
						#fileInput
						(change)="onFileSelected($event)"
						class="file-input"
						id="file-input" />
					<label
						for="file-input"
						class="file-input-label">
						<span class="file-icon">📎</span>
						<span>Adjuntar archivo</span>
					</label>
					<button
						*ngIf="selectedFile"
						(click)="sendFile()"
						class="send-file-button">
						Enviar archivo
					</button>
				</div>

				<!-- File Preview -->
				<div
					*ngIf="selectedFile"
					class="file-preview">
					<div class="file-preview-content">
						<div class="file-preview-icon">
							<div
								*ngIf="isImage(selectedFile.type); else fileIconTemplate"
								class="preview-image">
								<img
									[src]="getSelectedFilePreview()"
									[alt]="selectedFile.name" />
							</div>
							<ng-template #fileIconTemplate>
								<span class="file-type-icon">{{ getFileIcon(selectedFile.type) }}</span>
							</ng-template>
						</div>
						<div class="file-preview-info">
							<div class="file-name">{{ selectedFile.name }}</div>
							<div class="file-details">
								{{ formatFileSize(selectedFile.size) }} •
								{{ getFileTypeDisplay(selectedFile.type) }}
							</div>
						</div>
						<button
							(click)="clearSelectedFile()"
							class="clear-file-button">
							×
						</button>
					</div>
				</div>
			</div>

			<!-- Messages Container -->
			<div class="messages-container">
				<div
					*ngIf="messages.length === 0"
					class="empty-state">
					<div class="empty-icon">💬</div>
					<p>No hay mensajes aún</p>
					<small>Envía un mensaje para comenzar la conversación</small>
				</div>

				<div class="messages-list">
					<div
						*ngFor="let m of messages; trackBy: trackByIndex"
						class="message-wrapper">
						<!-- Text Message -->
						<div
							*ngIf="isTextMessage(m)"
							class="message text-message">
							<div class="message-content">
								<div class="message-text">{{ getMessageText(m) }}</div>
								<div class="message-time">
									{{ formatTime(m.payload?.receivedAt || m.payload?.ts) }}
								</div>
							</div>
						</div>

						<!-- File Message -->
						<div
							*ngIf="isFileMessage(m)"
							class="message file-message">
							<div class="file-header">
								<span class="file-type-icon">{{ getFileIcon(m.payload?.fileType) }}</span>
								<span class="file-label">
									{{ isImage(m.payload?.fileType) ? 'Imagen' : 'Archivo' }}
								</span>
								<span class="message-time">{{ formatTime(m.payload?.receivedAt) }}</span>
							</div>

							<div class="file-content">
								<div class="file-preview-section">
									<div
										*ngIf="isImage(m.payload?.fileType); else fileIconDisplay"
										class="image-thumbnail">
										<img
											[src]="getImageDataUrl(m.payload)"
											[alt]="m.payload?.fileName"
											(click)="viewImage(m.payload)"
											class="thumbnail-image" />
									</div>
									<ng-template #fileIconDisplay>
										<div class="file-icon-display">
											<span class="file-type-icon large">{{
												getFileIcon(m.payload?.fileType)
											}}</span>
										</div>
									</ng-template>
								</div>

								<div class="file-info">
									<div class="file-name-section">
										<span class="file-name-main">{{
											getFileNameWithoutExtension(m.payload?.fileName)
										}}</span>
										<span class="file-extension"
											>.{{ getFileExtension(m.payload?.fileName) }}</span
										>
									</div>

									<div class="file-meta">
										<span class="file-size">{{
											formatFileSize(m.payload?.fileSize)
										}}</span>
										<span class="file-type">{{
											getFileTypeDisplay(m.payload?.fileType)
										}}</span>
									</div>

									<div class="file-actions">
										<button
											(click)="downloadFile(m.payload)"
											class="action-button download">
											↓ Descargar
										</button>
										<button
											*ngIf="isImage(m.payload?.fileType)"
											(click)="viewImage(m.payload)"
											class="action-button view">
											👁 Ver
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Controls -->
			<div class="controls">
				<button
					(click)="disconnect()"
					class="disconnect-button">
					Desconectar
				</button>
			</div>
		</div>

		<!-- Image Modal -->
		<div
			*ngIf="modalImageUrl"
			class="image-modal"
			(click)="closeModal()">
			<div class="modal-content">
				<img
					[src]="modalImageUrl"
					[alt]="modalImageName"
					(click)="$event.stopPropagation()" />
				<button
					(click)="closeModal()"
					class="close-modal">
					×
				</button>
			</div>
		</div>
	`,
	styles: [
		`
			.chat-container {
				max-width: 800px;
				margin: 0 auto;
				height: 100vh;
				display: flex;
				flex-direction: column;
				background: #f8f9fa;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			}

			.header {
				background: white;
				padding: 1rem 1.5rem;
				border-bottom: 1px solid #e9ecef;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
			}

			.title {
				margin: 0;
				color: #2c3e50;
				font-size: 1.5rem;
				font-weight: 600;
			}

			.status {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.status-dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				transition: background-color 0.3s ease;
			}

			.status-dot.connected {
				background-color: #28a745;
			}

			.status-dot.disconnected {
				background-color: #dc3545;
			}

			.status-text {
				font-size: 0.875rem;
				color: #6c757d;
				font-weight: 500;
			}

			.input-section {
				background: white;
				padding: 1rem 1.5rem;
				border-bottom: 1px solid #e9ecef;
			}

			.message-input-container {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 1rem;
			}

			.message-input {
				flex: 1;
				padding: 0.75rem 1rem;
				border: 1px solid #dee2e6;
				border-radius: 24px;
				font-size: 0.95rem;
				outline: none;
				transition: border-color 0.2s ease;
			}

			.message-input:focus {
				border-color: #007bff;
			}

			.send-button {
				width: 48px;
				height: 48px;
				border-radius: 50%;
				border: none;
				background: #007bff;
				color: white;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.2s ease;
			}

			.send-button:hover:not(:disabled) {
				background: #0056b3;
				transform: translateY(-1px);
			}

			.send-button:disabled {
				background: #6c757d;
				cursor: not-allowed;
			}

			.send-icon {
				font-size: 1.2rem;
				font-weight: bold;
			}

			.file-input-container {
				display: flex;
				align-items: center;
				gap: 1rem;
			}

			.file-input {
				display: none;
			}

			.file-input-label {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: 0.5rem 1rem;
				border: 1px solid #dee2e6;
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.2s ease;
				font-size: 0.875rem;
				color: #6c757d;
			}

			.file-input-label:hover {
				background: #f8f9fa;
				border-color: #adb5bd;
			}

			.file-icon {
				font-size: 1rem;
			}

			.send-file-button {
				padding: 0.5rem 1rem;
				background: #28a745;
				color: white;
				border: none;
				border-radius: 8px;
				cursor: pointer;
				font-size: 0.875rem;
				font-weight: 500;
				transition: all 0.2s ease;
			}

			.send-file-button:hover {
				background: #218838;
			}

			.file-preview {
				margin-top: 1rem;
				padding: 1rem;
				background: #f8f9fa;
				border-radius: 8px;
				border: 1px solid #dee2e6;
			}

			.file-preview-content {
				display: flex;
				align-items: center;
				gap: 1rem;
			}

			.file-preview-icon .preview-image {
				width: 48px;
				height: 48px;
				border-radius: 6px;
				overflow: hidden;
			}

			.file-preview-icon .preview-image img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.file-type-icon {
				font-size: 2rem;
			}

			.file-preview-info {
				flex: 1;
			}

			.file-name {
				font-weight: 500;
				color: #2c3e50;
				font-size: 0.9rem;
			}

			.file-details {
				font-size: 0.8rem;
				color: #6c757d;
				margin-top: 0.25rem;
			}

			.clear-file-button {
				width: 24px;
				height: 24px;
				border-radius: 50%;
				border: none;
				background: #dc3545;
				color: white;
				cursor: pointer;
				font-size: 1rem;
				line-height: 1;
			}

			.messages-container {
				flex: 1;
				overflow: hidden;
				display: flex;
				flex-direction: column;
			}

			.empty-state {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #6c757d;
				text-align: center;
			}

			.empty-icon {
				font-size: 3rem;
				margin-bottom: 1rem;
				opacity: 0.5;
			}

			.messages-list {
				flex: 1;
				overflow-y: auto;
				padding: 1rem 1.5rem;
				display: flex;
				flex-direction: column-reverse;
			}

			.message-wrapper {
				margin-bottom: 1rem;
			}

			.message {
				background: white;
				border-radius: 12px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				overflow: hidden;
			}

			.text-message {
				padding: 1rem 1.25rem;
			}

			.message-content {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				gap: 1rem;
			}

			.message-text {
				color: #2c3e50;
				font-size: 0.95rem;
				line-height: 1.4;
			}

			.message-time {
				font-size: 0.75rem;
				color: #6c757d;
				white-space: nowrap;
			}

			.file-message {
				padding: 1rem 1.25rem;
			}

			.file-header {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
				color: #6c757d;
				font-size: 0.875rem;
			}

			.file-label {
				font-weight: 500;
			}

			.file-content {
				display: flex;
				gap: 1rem;
			}

			.file-preview-section {
				flex-shrink: 0;
			}

			.image-thumbnail {
				width: 80px;
				height: 80px;
				border-radius: 8px;
				overflow: hidden;
				cursor: pointer;
				transition: transform 0.2s ease;
			}

			.image-thumbnail:hover {
				transform: scale(1.05);
			}

			.thumbnail-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.file-icon-display {
				width: 60px;
				height: 60px;
				background: #f8f9fa;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.file-type-icon.large {
				font-size: 1.5rem;
			}

			.file-info {
				flex: 1;
				min-width: 0;
			}

			.file-name-section {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.5rem;
			}

			.file-name-main {
				font-weight: 500;
				color: #2c3e50;
				word-break: break-word;
			}

			.file-extension {
				background: #007bff;
				color: white;
				padding: 0.125rem 0.5rem;
				border-radius: 12px;
				font-size: 0.75rem;
				font-weight: 500;
			}

			.file-meta {
				display: flex;
				gap: 1rem;
				margin-bottom: 0.75rem;
				font-size: 0.8rem;
				color: #6c757d;
			}

			.file-actions {
				display: flex;
				gap: 0.5rem;
			}

			.action-button {
				padding: 0.375rem 0.75rem;
				border: none;
				border-radius: 6px;
				font-size: 0.8rem;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.action-button.download {
				background: #28a745;
				color: white;
			}

			.action-button.download:hover {
				background: #218838;
			}

			.action-button.view {
				background: #17a2b8;
				color: white;
			}

			.action-button.view:hover {
				background: #138496;
			}

			.controls {
				padding: 1rem 1.5rem;
				background: white;
				border-top: 1px solid #e9ecef;
			}

			.disconnect-button {
				padding: 0.5rem 1rem;
				background: #dc3545;
				color: white;
				border: none;
				border-radius: 6px;
				cursor: pointer;
				font-size: 0.875rem;
				font-weight: 500;
			}

			.disconnect-button:hover {
				background: #c82333;
			}

			.image-modal {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.9);
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 1000;
				backdrop-filter: blur(4px);
			}

			.modal-content {
				position: relative;
				max-width: 90vw;
				max-height: 90vh;
			}

			.modal-content img {
				max-width: 100%;
				max-height: 100%;
				object-fit: contain;
				border-radius: 8px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
			}

			.close-modal {
				position: absolute;
				top: -40px;
				right: -40px;
				width: 32px;
				height: 32px;
				border-radius: 50%;
				border: none;
				background: white;
				cursor: pointer;
				font-size: 1.2rem;
				line-height: 1;
				color: #2c3e50;
			}
		`,
	],
})
export class WsDemoComponent implements OnInit, OnDestroy {
	messages: WSMessage[] = []
	outMsg = ''
	connected = false
	selectedFile: File | null = null
	selectedFilePreviewUrl: string = ''
	modalImageUrl: string = ''
	modalImageName: string = ''
	private subMsg?: Subscription
	private subStatus?: Subscription

	constructor(private ws: WebsocketService) {}

	ngOnInit(): void {
		this.subMsg = this.ws.messages$().subscribe((msg) => {
			// Solo mostrar mensajes que NO son del sistema o bienvenida
			if (msg.type !== 'system' && msg.type !== 'welcome') {
				this.messages.unshift(msg)
			}
		})

		this.subStatus = this.ws.status$().subscribe((state) => {
			this.connected = state
		})
	}

	send() {
		if (!this.outMsg) return
		const message: WSMessage = {
			type: 'chat',
			payload: { text: this.outMsg, ts: Date.now() },
		}
		this.ws.send(message)
		this.outMsg = ''
	}

	disconnect() {
		this.ws.close()
	}

	onFileSelected(event: any) {
		const file = event.target.files[0]
		if (file) {
			this.selectedFile = file

			// Generate preview URL for images
			if (this.isImage(file.type)) {
				const reader = new FileReader()
				reader.onload = (e) => {
					this.selectedFilePreviewUrl = e.target?.result as string
				}
				reader.readAsDataURL(file)
			} else {
				this.selectedFilePreviewUrl = ''
			}
		}
	}

	getSelectedFilePreview(): string {
		return this.selectedFilePreviewUrl
	}

	sendFile() {
		if (!this.selectedFile) return

		const reader = new FileReader()
		reader.onload = (e) => {
			const fileData = e.target?.result as string
			const base64Data = fileData.split(',')[1] // Remove data:type;base64, prefix

			const fileMessage: WSMessage = {
				type: 'file',
				payload: {
					fileName: this.selectedFile!.name,
					fileSize: this.selectedFile!.size,
					fileType: this.selectedFile!.type,
					fileData: base64Data,
				},
			}

			this.ws.send(fileMessage)
			this.selectedFile = null
			this.selectedFilePreviewUrl = ''
			// Reset file input
			const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
			if (fileInput) fileInput.value = ''
		}
		reader.readAsDataURL(this.selectedFile)
	}

	isTextMessage(message: WSMessage): boolean {
		return (
			!message.messageType ||
			message.messageType === 'text' ||
			message.type === 'chat' ||
			message.type === 'system'
		)
	}

	isFileMessage(message: WSMessage): boolean {
		return message.messageType === 'file'
	}

	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	formatTime(timestamp: number): string {
		if (!timestamp) return ''
		const date = new Date(timestamp)
		return date.toLocaleTimeString()
	}

	downloadFile(filePayload: any) {
		if (!filePayload?.fileData) return

		// Create a blob from base64 data
		const byteCharacters = atob(filePayload.fileData)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i)
		}
		const byteArray = new Uint8Array(byteNumbers)
		const blob = new Blob([byteArray], { type: filePayload.fileType })

		// Create download link
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = filePayload.fileName
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	}

	// Image handling methods
	isImage(fileType: string): boolean {
		if (!fileType) return false
		return fileType.startsWith('image/')
	}

	getImageDataUrl(filePayload: any): string {
		if (!filePayload?.fileData || !filePayload?.fileType) return ''
		return `data:${filePayload.fileType};base64,${filePayload.fileData}`
	}

	viewImage(filePayload: any) {
		if (!this.isImage(filePayload?.fileType)) return

		this.modalImageUrl = this.getImageDataUrl(filePayload)
		this.modalImageName = filePayload.fileName || 'Imagen'
	}

	closeModal() {
		this.modalImageUrl = ''
		this.modalImageName = ''
	}

	// File type icon and display methods
	getFileIcon(fileType: string): string {
		if (!fileType) return '📄'

		if (fileType.startsWith('image/')) return '🖼️'
		if (fileType.startsWith('video/')) return '🎥'
		if (fileType.startsWith('audio/')) return '🎵'
		if (fileType.includes('pdf')) return '📕'
		if (fileType.includes('word') || fileType.includes('document')) return '📘'
		if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
		if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️'
		if (
			fileType.includes('zip') ||
			fileType.includes('rar') ||
			fileType.includes('compressed')
		)
			return '🗜️'
		if (fileType.includes('text')) return '📝'
		if (
			fileType.includes('json') ||
			fileType.includes('javascript') ||
			fileType.includes('html') ||
			fileType.includes('css')
		)
			return '💻'

		return '📄'
	}

	getFileTypeDisplay(fileType: string): string {
		if (!fileType) return 'Desconocido'

		const typeMap: { [key: string]: string } = {
			'image/jpeg': 'JPEG Image',
			'image/jpg': 'JPG Image',
			'image/png': 'PNG Image',
			'image/gif': 'GIF Image',
			'image/webp': 'WebP Image',
			'video/mp4': 'MP4 Video',
			'video/avi': 'AVI Video',
			'audio/mp3': 'MP3 Audio',
			'audio/wav': 'WAV Audio',
			'application/pdf': 'PDF Document',
			'application/msword': 'Word Document',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				'Word Document',
			'application/vnd.ms-excel': 'Excel Spreadsheet',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				'Excel Spreadsheet',
			'text/plain': 'Text File',
			'application/json': 'JSON File',
			'text/html': 'HTML File',
			'text/css': 'CSS File',
			'application/javascript': 'JavaScript File',
			'application/zip': 'ZIP Archive',
			'application/x-rar-compressed': 'RAR Archive',
		}

		return typeMap[fileType] || fileType.split('/').pop()?.toUpperCase() || 'Archivo'
	}

	getFileExtension(fileName: string): string {
		if (!fileName) return ''
		const extension = fileName.split('.').pop()
		return extension ? extension.toUpperCase() : ''
	}

	getFileNameWithoutExtension(fileName: string): string {
		if (!fileName) return ''
		const parts = fileName.split('.')
		if (parts.length === 1) return fileName
		return parts.slice(0, -1).join('.')
	}

	getMessageText(message: WSMessage): string {
		if (!message.payload) return 'Mensaje vacío'

		// Si es string directamente
		if (typeof message.payload === 'string') {
			return message.payload
		}

		// Si es objeto, buscar propiedades comunes
		if (typeof message.payload === 'object' && message.payload !== null) {
			if (message.payload.message) {
				return String(message.payload.message)
			}

			if (message.payload.text) {
				return String(message.payload.text)
			}

			return JSON.stringify(message.payload, null, 2)
		}

		// Fallback
		return String(message.payload)
	}

	clearSelectedFile() {
		this.selectedFile = null
		this.selectedFilePreviewUrl = ''
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
		if (fileInput) fileInput.value = ''
	}

	trackByIndex(index: number, item: WSMessage): number {
		return index
	}
	ngOnDestroy(): void {
		if (this.subMsg) this.subMsg.unsubscribe()
		if (this.subStatus) this.subStatus.unsubscribe()
	}
}
