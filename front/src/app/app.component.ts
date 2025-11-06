import { Component } from '@angular/core'

@Component({
	selector: 'app-root',
	template: `
		<div>
			<h1>Angular WebSocket Demo</h1>
			<app-ws-demo></app-ws-demo>
		</div>
	`,
	styles: [
		`
			h1 {
				color: #333;
				margin: 20px;
			}
			div {
				padding: 20px;
			}
		`,
	],
})
export class AppComponent {
	title = 'WebSocket Demo'
}
