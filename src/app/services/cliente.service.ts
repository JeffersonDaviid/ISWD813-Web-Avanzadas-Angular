import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [];

  constructor() {
    const raw = localStorage.getItem('clientes');
    this.clientes = raw ? JSON.parse(raw) : [
      { id: 1, nombre: 'Juan Perez', correo: 'juan@example.com' },
      { id: 2, nombre: 'María López', correo: 'maria@example.com' }
    ];
  }

  private guardar() {
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  listar() {
    return of(this.clientes).pipe(delay(500));
  }

  agregar(cliente: Cliente) {
    cliente.id = Date.now();
    this.clientes.push(cliente);
    this.guardar();
    return of(cliente).pipe(delay(400));
  }

  actualizar(cliente: Cliente) {
    const idx = this.clientes.findIndex(c => c.id === cliente.id);
    if (idx >= 0) this.clientes[idx] = cliente;
    this.guardar();
    return of(cliente).pipe(delay(400));
  }

  eliminar(id: number) {
    this.clientes = this.clientes.filter(c => c.id !== id);
    this.guardar();
    return of(true).pipe(delay(300));
  }
}
