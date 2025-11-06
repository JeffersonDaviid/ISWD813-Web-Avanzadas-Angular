import { Component, OnInit, OnDestroy } from '@angular/core'
import { WebsocketService, WSMessage } from '../../services/websocket.service'
import { Subscription } from 'rxjs'

@Component({
	selector: 'app-ws-demo',
	template: `
		<div>
			<h3>WebSocket Demo (Angular 17)</h3>
			<p>
				Estado:
				<strong [style.color]="connected ? 'green' : 'red'">{{
					connected ? 'Conectado' : 'Desconectado'
				}}</strong>
			</p>

			<input
				[(ngModel)]="outMsg"
				placeholder="Mensaje a enviar" />
			<button (click)="send()">Enviar</button>
			<button (click)="disconnect()">Desconectar</button>

			<h4>Mensajes recibidos</h4>
			<ul>
				<li *ngFor="let m of messages">{{ m | json }}</li>
			</ul>
		</div>
	`,
})
export class WsDemoComponent implements OnInit, OnDestroy {
	messages: WSMessage[] = []
	outMsg = ''
	connected = false
	private subMsg?: Subscription
	private subStatus?: Subscription

	constructor(private ws: WebsocketService) {}

	ngOnInit(): void {
		this.subMsg = this.ws.messages$().subscribe((msg) => {
			this.messages.unshift(msg)
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

	ngOnDestroy(): void {
		if (this.subMsg) this.subMsg.unsubscribe()
		if (this.subStatus) this.subStatus.unsubscribe()
	}
}
