import { Component } from '@angular/core';
import { ListClients } from './components/list-clients/list-clients';
import { PostClient } from './components/post-client/post-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [PostClient, ListClients],
})
export class App {}
