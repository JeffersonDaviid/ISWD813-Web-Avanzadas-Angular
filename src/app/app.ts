import { Component } from '@angular/core';
import { ListClients } from './components/list-clients/list-clients';
import { ListProducts } from './components/list-products/list-products';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ListClients, ListProducts],
})
export class App {}
