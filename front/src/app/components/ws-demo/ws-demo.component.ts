import { Component, OnInit, OnDestroy } from '@angular/core'
import { WebsocketService, WSMessage, WSStats } from '../../services/websocket.service'
import { Subscription } from 'rxjs'

@Component({
	selector: 'app-ws-demo',
	template: `
		<div class="h-screen max-w-4xl mx-auto flex flex-col bg-white shadow-xl">
			<!-- Header -->
			<div
				class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm flex-shrink-0">
				<h2 class="text-lg sm:text-xl font-semibold text-gray-900">WebSocket Chat</h2>
				<div class="flex items-center gap-4">
					<button
						(click)="toggleStats()"
						class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
						{{ showStats ? 'Ocultar' : 'Mostrar' }} Estadísticas
					</button>
					<div class="flex items-center gap-2">
						<div
							class="w-2 h-2 rounded-full transition-colors"
							[ngClass]="connected ? 'bg-green-500' : 'bg-red-500'"></div>
						<span class="text-sm text-gray-600">{{
							connected ? 'Conectado' : 'Desconectado'
						}}</span>
					</div>
				</div>
			</div>

			<!-- Estadísticas Section -->
			<div
				*ngIf="showStats"
				class="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div
						class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
						<div class="text-2xl font-bold text-blue-600 mb-1">
							{{ stats.messagesCount }}
						</div>
						<div class="text-sm text-gray-600">Mensajes Enviados</div>
						<div class="text-xs text-gray-500 mt-1">📤 Total de mensajes</div>
					</div>
					<div
						class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
						<div class="text-2xl font-bold text-green-600 mb-1">
							{{ stats.activeConnections }}
						</div>
						<div class="text-sm text-gray-600">Personas Conectadas</div>
						<div class="text-xs text-gray-500 mt-1">🟢 Actualmente en línea</div>
					</div>
					<div
						class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
						<div class="text-2xl font-bold text-purple-600 mb-1">
							{{ stats.totalConnections }}
						</div>
						<div class="text-sm text-gray-600">Total de Conexiones</div>
						<div class="text-xs text-gray-500 mt-1">👥 Histórico total</div>
					</div>
				</div>
			</div>

			<!-- Messages Container -->
			<div class="flex-1 overflow-hidden flex flex-col min-h-0">
				<div
					*ngIf="messages.length === 0"
					class="flex-1 flex flex-col items-center justify-center text-gray-500">
					<div class="text-6xl mb-4 opacity-50">💬</div>
					<p class="text-lg">No hay mensajes aún</p>
					<small class="text-sm">Envía un mensaje para comenzar la conversación</small>
				</div>

				<div
					class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 flex flex-col-reverse"
					style="-webkit-overflow-scrolling: touch;">
					<div *ngFor="let m of messages; trackBy: trackByIndex">
						<!-- Text Message -->
						<div
							*ngIf="isTextMessage(m)"
							class="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
							<div
								class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
								<div class="text-gray-900 text-sm sm:text-base break-words flex-1">
									{{ getMessageText(m) }}
								</div>
								<div class="text-xs text-gray-500 whitespace-nowrap">
									{{ formatTime(m.payload?.receivedAt || m.payload?.ts) }}
								</div>
							</div>
						</div>

						<!-- File Message -->
						<div
							*ngIf="isFileMessage(m)"
							class="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
							<div class="flex items-center gap-2 mb-3 text-sm text-gray-600">
								<span class="text-lg">{{ getFileIcon(m.payload?.fileType) }}</span>
								<span class="font-medium">
									{{
										isImage(m.payload?.fileType)
											? 'Imagen'
											: isVideo(m.payload?.fileType)
											? 'Video'
											: isAudio(m.payload?.fileType)
											? 'Audio'
											: 'Archivo'
									}}
								</span>
								<span class="text-xs ml-auto">{{
									formatTime(m.payload?.receivedAt)
								}}</span>
							</div>

							<div class="flex flex-col sm:flex-row gap-3">
								<!-- File Preview -->
								<div class="flex justify-center sm:justify-start flex-shrink-0">
									<div
										*ngIf="isImage(m.payload?.fileType)"
										class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
										<img
											[src]="getImageDataUrl(m.payload)"
											[alt]="m.payload?.fileName"
											(click)="viewImage(m.payload)"
											class="w-full h-full object-cover" />
									</div>
									<div
										*ngIf="isVideo(m.payload?.fileType) && !isImage(m.payload?.fileType)"
										class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
										<video
											[src]="getVideoDataUrl(m.payload)"
											(click)="viewVideo(m.payload)"
											class="w-full h-full object-cover"
											muted></video>
									</div>
									<div
										*ngIf="
											!isImage(m.payload?.fileType) &&
											!isVideo(m.payload?.fileType) &&
											!isAudio(m.payload?.fileType)
										"
										class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
										<span class="text-2xl">{{ getFileIcon(m.payload?.fileType) }}</span>
									</div>
									<div
										*ngIf="isAudio(m.payload?.fileType)"
										class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
										(click)="playAudio(m.payload)">
										<span class="text-white text-2xl">🎵</span>
									</div>
								</div>

								<!-- File Info -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-2">
										<span class="font-medium text-gray-900 truncate">
											{{ getFileNameWithoutExtension(m.payload?.fileName) }}
										</span>
										<span
											class="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
											.{{ getFileExtension(m.payload?.fileName) }}
										</span>
									</div>

									<div class="flex gap-4 mb-3 text-xs text-gray-600">
										<span>{{ formatFileSize(m.payload?.fileSize) }}</span>
										<span>{{ getFileTypeDisplay(m.payload?.fileType) }}</span>
									</div>

									<div class="flex flex-wrap gap-2">
										<button
											(click)="downloadFile(m.payload)"
											class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
											↓ Descargar
										</button>
										<button
											*ngIf="isImage(m.payload?.fileType)"
											(click)="viewImage(m.payload)"
											class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
											👁 Ver
										</button>
										<button
											*ngIf="isVideo(m.payload?.fileType)"
											(click)="viewVideo(m.payload)"
											class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
											🎬 Ver Video
										</button>
										<button
											*ngIf="isAudio(m.payload?.fileType)"
											(click)="playAudio(m.payload)"
											class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
											🎵 Reproducir
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Input Section -->
			<div class="bg-white border-t border-gray-200 p-4 sm:p-6 flex-shrink-0 space-y-4">
				<!-- Text Message Input -->
				<div class="flex gap-2">
					<input
						[(ngModel)]="outMsg"
						placeholder="Escribe tu mensaje..."
						class="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
						(keydown.enter)="send()" />
					<button
						(click)="send()"
						[disabled]="!outMsg.trim()"
						class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:hover:scale-100">
						<span class="text-lg font-bold">→</span>
					</button>
				</div>

				<!-- File Input -->
				<div class="flex flex-wrap items-center gap-2">
					<input
						type="file"
						#fileInput
						(change)="onFileSelected($event)"
						class="hidden"
						id="file-input" />
					<label
						for="file-input"
						class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors">
						<span class="text-lg">📎</span>
						<span class="hidden sm:inline">Adjuntar archivo</span>
					</label>
					<button
						*ngIf="selectedFile"
						(click)="sendFile()"
						class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
						Enviar archivo
					</button>
					<button
						(click)="disconnect()"
						class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto">
						Desconectar
					</button>
				</div>

				<!-- File Preview -->
				<div
					*ngIf="selectedFile"
					class="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<div class="flex items-center gap-4">
						<div class="flex-shrink-0">
							<div
								*ngIf="isImage(selectedFile.type)"
								class="w-12 h-12 rounded-lg overflow-hidden">
								<img
									[src]="getSelectedFilePreview()"
									[alt]="selectedFile.name"
									class="w-full h-full object-cover" />
							</div>
							<div
								*ngIf="isVideo(selectedFile.type) && !isImage(selectedFile.type)"
								class="w-12 h-12 rounded-lg overflow-hidden">
								<video
									[src]="getSelectedFilePreview()"
									class="w-full h-full object-cover"
									muted></video>
							</div>
							<div
								*ngIf="
									isAudio(selectedFile.type) &&
									!isImage(selectedFile.type) &&
									!isVideo(selectedFile.type)
								"
								class="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
								<span class="text-white text-xl">🎵</span>
							</div>
							<div
								*ngIf="
									!isImage(selectedFile.type) &&
									!isVideo(selectedFile.type) &&
									!isAudio(selectedFile.type)
								"
								class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
								<span class="text-xl">{{ getFileIcon(selectedFile.type) }}</span>
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<div class="font-medium text-gray-900 truncate">
								{{ selectedFile.name }}
							</div>
							<div class="text-sm text-gray-600">
								{{ formatFileSize(selectedFile.size) }} •
								{{ getFileTypeDisplay(selectedFile.type) }}
							</div>
						</div>
						<button
							(click)="clearSelectedFile()"
							class="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors">
							×
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Image Modal -->
		<div
			*ngIf="modalImageUrl"
			class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
			(click)="closeModal()">
			<div class="relative max-w-[90vw] max-h-[90vh]">
				<img
					[src]="modalImageUrl"
					[alt]="modalImageName"
					(click)="$event.stopPropagation()"
					class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
				<button
					(click)="closeModal()"
					class="absolute -top-10 -right-10 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-800 transition-colors">
					×
				</button>
			</div>
		</div>

		<!-- Video Modal -->
		<div
			*ngIf="modalVideoUrl"
			class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
			(click)="closeModal()">
			<div class="relative max-w-[90vw] max-h-[90vh]">
				<video
					[src]="modalVideoUrl"
					(click)="$event.stopPropagation()"
					class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
					controls
					autoplay>
					Tu navegador no soporta el elemento video.
				</video>
				<button
					(click)="closeModal()"
					class="absolute -top-10 -right-10 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-800 transition-colors">
					×
				</button>
				<div class="absolute -bottom-8 left-0 text-white text-sm opacity-75">
					{{ modalVideoName }}
				</div>
			</div>
		</div>

		<!-- Audio Modal -->
		<div
			*ngIf="modalAudioUrl"
			class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
			(click)="closeModal()">
			<div class="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
				<div class="text-center mb-6">
					<div
						class="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
						<span class="text-white text-3xl">🎵</span>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 truncate">
						{{ modalAudioName }}
					</h3>
				</div>
				<audio
					[src]="modalAudioUrl"
					(click)="$event.stopPropagation()"
					class="w-full"
					controls
					autoplay>
					Tu navegador no soporta el elemento de audio.
				</audio>
				<button
					(click)="closeModal()"
					class="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-lg transition-colors">
					×
				</button>
			</div>
		</div>
	`,
	styles: [],
})
export class WsDemoComponent implements OnInit, OnDestroy {
	messages: WSMessage[] = []
	outMsg = ''
	connected = false
	selectedFile: File | null = null
	selectedFilePreviewUrl: string = ''
	modalImageUrl: string = ''
	modalImageName: string = ''
	modalVideoUrl: string = ''
	modalVideoName: string = ''
	modalAudioUrl: string = ''
	modalAudioName: string = ''

	// Estadísticas
	stats: WSStats = {
		messagesCount: 0,
		activeConnections: 0,
		totalConnections: 0,
	}
	showStats = true

	private subMsg?: Subscription
	private subStatus?: Subscription
	private subStats?: Subscription

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

		this.subStats = this.ws.getStats$().subscribe((stats) => {
			this.stats = stats
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

			// Generate preview URL for images, videos and audio
			if (this.isImage(file.type) || this.isVideo(file.type) || this.isAudio(file.type)) {
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

	// Image, Video and Audio handling methods
	isImage(fileType: string): boolean {
		if (!fileType) return false
		return fileType.startsWith('image/')
	}

	isVideo(fileType: string): boolean {
		if (!fileType) return false
		return fileType.startsWith('video/')
	}

	isAudio(fileType: string): boolean {
		if (!fileType) return false
		return fileType.startsWith('audio/')
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

	getVideoDataUrl(filePayload: any): string {
		if (!filePayload?.fileData || !filePayload?.fileType) return ''
		return `data:${filePayload.fileType};base64,${filePayload.fileData}`
	}

	viewVideo(filePayload: any) {
		if (!this.isVideo(filePayload?.fileType)) return

		this.modalVideoUrl = this.getVideoDataUrl(filePayload)
		this.modalVideoName = filePayload.fileName || 'Video'
	}

	getAudioDataUrl(filePayload: any): string {
		if (!filePayload?.fileData || !filePayload?.fileType) return ''
		return `data:${filePayload.fileType};base64,${filePayload.fileData}`
	}

	playAudio(filePayload: any) {
		if (!this.isAudio(filePayload?.fileType)) return

		this.modalAudioUrl = this.getAudioDataUrl(filePayload)
		this.modalAudioName = filePayload.fileName || 'Audio'
	}

	closeModal() {
		this.modalImageUrl = ''
		this.modalImageName = ''
		this.modalVideoUrl = ''
		this.modalVideoName = ''
		this.modalAudioUrl = ''
		this.modalAudioName = ''
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

	toggleStats() {
		this.showStats = !this.showStats
	}
	ngOnDestroy(): void {
		if (this.subMsg) this.subMsg.unsubscribe()
		if (this.subStatus) this.subStatus.unsubscribe()
		if (this.subStats) this.subStats.unsubscribe()
	}
}
