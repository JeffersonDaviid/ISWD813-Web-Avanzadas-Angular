import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SocketService } from './socket.service'

// Material modules (the user should `ng add @angular/material` and install)

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<header
			class="bg-indigo-600 text-white shadow-md h-16 flex items-center px-6 justify-between">
			<div class="flex items-center gap-3">
				<div
					class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-indigo-100 font-bold">
					AC
				</div>
				<h1 class="font-bold text-lg tracking-wide">Angular Chat</h1>
			</div>
			<span
				class="text-xs bg-indigo-700 px-3 py-1 rounded-full text-indigo-100 hidden sm:block">
				Roles + Rooms + Private + JWT
			</span>
		</header>

		<main
			class="min-h-[calc(100vh-64px)] bg-gray-100 p-4 lg:p-6 flex flex-col lg:flex-row gap-6 font-sans text-gray-800">
			<section class="w-full lg:w-80 flex flex-col gap-6">
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
					<h3 class="font-bold text-gray-700 mb-4 flex justify-between items-center">
						Login
						<span
							class="text-xs font-normal text-gray-400 border border-gray-200 px-2 rounded"
							>Demo</span
						>
					</h3>

					<div class="space-y-3">
						<div>
							<label class="block text-xs font-medium text-gray-500 mb-1">Usuario</label>
							<input
								type="text"
								class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
								placeholder="alice | bob | carla"
								[(ngModel)]="username" />
						</div>

						<button
							class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm active:transform active:scale-95"
							(click)="login()">
							Ingresar
						</button>

						<div
							*ngIf="me"
							class="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded text-emerald-700 text-xs flex items-center gap-2">
							<span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
							<span
								><strong>{{ me.username }}</strong> ({{ me.role }})</span
							>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1">
					<h4 class="font-semibold text-gray-700 mb-3">Salas</h4>

					<div class="flex gap-2 mb-4">
						<input
							type="text"
							class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Nueva sala..."
							[(ngModel)]="newRoom" />
						<button
							class="bg-gray-800 hover:bg-black text-white px-3 rounded-lg transition-colors"
							(click)="createOrJoin()">
							+
						</button>
					</div>

					<div class="mb-2">
						<h5 class="text-xs uppercase text-gray-400 font-bold tracking-wider mb-2">
							Disponibles
						</h5>
						<ul
							class="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto">
							<li
								*ngFor="let r of rooms"
								class="px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 cursor-pointer transition-colors relative group">
								{{ r }}
								<span
									class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
							</li>
						</ul>
					</div>

					<button
						class="w-full mt-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded transition-colors"
						(click)="deleteRoom()">
						Eliminar sala seleccionada (Admin)
					</button>
				</div>
			</section>

			<section
				class="flex-1 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden h-[75vh] lg:h-auto">
				<div
					class="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center">
					<div>
						<h3 class="font-bold text-gray-800 text-lg">
							Sala: {{ currentRoom || '---' }}
						</h3>
						<p
							class="text-xs text-gray-400"
							*ngIf="currentRoom">
							Sesión activa
						</p>
					</div>
					<button
						class="text-xs text-indigo-600 hover:underline"
						(click)="broadcast()">
						📢 Enviar Broadcast (Admin)
					</button>
				</div>

				<div class="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-3">
					<div
						*ngIf="mensajes.length === 0"
						class="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
						<svg
							class="w-12 h-12 mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
						</svg>
						<p class="text-sm">No hay mensajes aún</p>
					</div>

					<div
						*ngFor="let m of mensajes"
						class="flex flex-col items-start">
						<div
							class="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 text-gray-700 text-sm max-w-[85%]">
							{{ m }}
						</div>
					</div>
				</div>

				<div class="bg-white p-4 border-t border-gray-100">
					<div class="flex gap-3 mb-4">
						<input
							type="text"
							class="flex-1 px-4 py-3 bg-gray-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-xl focus:outline-none transition-all shadow-inner"
							placeholder="Escribe un mensaje..."
							[(ngModel)]="msg"
							(keyup.enter)="sendRoom()" />
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-semibold shadow-md transition-transform active:scale-95 flex items-center gap-2"
							(click)="sendRoom()">
							<span>Enviar</span>
							<svg
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
							</svg>
						</button>
					</div>

					<div
						class="bg-indigo-50 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3 border border-indigo-100">
						<span class="text-xs font-bold text-indigo-800 uppercase tracking-wide"
							>Privado</span
						>
						<input
							class="flex-1 w-full px-3 py-1.5 text-sm border border-indigo-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
							placeholder="Socket ID del destinatario"
							[(ngModel)]="toId" />
						<button
							class="w-full sm:w-auto px-4 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm rounded hover:bg-indigo-100 transition-colors"
							(click)="sendPrivate()">
							Enviar Privado
						</button>
					</div>
				</div>
			</section>

			<section
				class="w-full lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-fit max-h-[500px]">
				<div class="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
					<h4 class="font-bold text-gray-700 text-sm">Usuarios Conectados</h4>
				</div>

				<ul class="overflow-y-auto p-2 space-y-1">
					<li
						*ngFor="let u of users"
						class="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
						<div
							class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
							{{ u.username.charAt(0).toUpperCase() }}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-800 truncate">{{ u.username }}</p>
							<p class="text-[10px] text-gray-400 truncate">ID: {{ u.id }}</p>
						</div>
						<span class="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{{
							u.role
						}}</span>
					</li>
				</ul>

				<div class="p-2 text-center text-xs text-gray-400 border-t border-gray-100">
					Total: {{ users.length }}
				</div>
			</section>
		</main>
	`,
})
export class AppComponent {
	username = ''
	me: any = null
	token = ''
	rooms: string[] = []
	currentRoom = ''
	newRoom = ''
	mensajes: string[] = []
	msg = ''
	users: any[] = []
	toId = ''

	constructor(private sock: SocketService) {
		// listeners will be set after connect
	}

	async login() {
		if (!this.username) return alert('Ingrese username (alice|bob|carla)')
		// call backend login
		try {
			const res = await fetch('http://localhost:3000/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: this.username }),
			})
			const data = await res.json()
			if (!res.ok) return alert(JSON.stringify(data))
			this.token = data.token
			this.me = { username: data.username, role: data.role }
			this.sock.connect(this.token)

			// setup socket listeners
			this.sock.listen('rooms').subscribe((r: any) => (this.rooms = r))
			this.sock
				.listen('system')
				.subscribe((d: any) => this.mensajes.push('[SYS] ' + d.msg))
			this.sock
				.listen('roomMessage')
				.subscribe((d: any) =>
					this.mensajes.push('[' + d.room + '] ' + d.from + ': ' + d.message)
				)
			this.sock
				.listen('broadcast')
				.subscribe((d: any) =>
					this.mensajes.push('[GLOBAL] ' + d.from + ': ' + d.message)
				)
			this.sock
				.listen('privateMessage')
				.subscribe((d: any) => this.mensajes.push('[PRIV] ' + d.from + ': ' + d.message))
			this.sock.listen('presence').subscribe((p: any) => (this.users = p.clients))
			// request rooms list
			this.sock.emit('listRooms')
		} catch (err) {
			alert('Error al llamar login: ' + err)
		}
	}

	createOrJoin() {
		if (!this.newRoom) return
		this.currentRoom = this.newRoom
		this.sock.emit('createOrJoinRoom', this.newRoom)
		this.newRoom = ''
	}

	sendRoom() {
		if (!this.currentRoom) return alert('Selecciona o crea una sala')
		this.sock.emit('roomMessage', { room: this.currentRoom, message: this.msg })
		this.msg = ''
	}

	broadcast() {
		if (!this.me) return
		this.sock.emit('broadcast', this.msg)
		this.msg = ''
	}

	sendPrivate() {
		if (!this.toId) return alert('Ingrese socket id del destinatario')
		this.sock.emit('privateMessage', { toSocketId: this.toId, message: this.msg })
		this.msg = ''
	}

	deleteRoom() {
		if (!this.currentRoom) return alert('Selecciona sala a eliminar')
		this.sock.emit('deleteRoom', this.currentRoom)
		this.currentRoom = ''
	}
}
