import { Component, inject, OnInit, signal } from '@angular/core';
import { ClienteSoapService } from './service/soap';
import { PostClient } from './components/post-client/post-client';
import { ListClients } from './components/list-clients/list-clients';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [PostClient, ListClients],
})
export class App {}
