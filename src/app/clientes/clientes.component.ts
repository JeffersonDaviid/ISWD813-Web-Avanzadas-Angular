import { Component, OnInit } from '@angular/core';
import { ClienteService, Cliente } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  nuevo: Cliente = { id: 0, nombre: '', correo: '' };
  editando = false;
  cargando = false;

  constructor(private clienteSrv: ClienteService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clienteSrv.listar().subscribe(data => {
      this.clientes = data;
      this.cargando = false;
    });
  }

  guardar() {
    if (!this.nuevo.nombre || !this.nuevo.correo) return alert('Complete los campos');
    if (this.editando) {
      this.clienteSrv.actualizar(this.nuevo).subscribe(() => {
        this.cargarClientes();
        this.cancelar();
      });
    } else {
      this.clienteSrv.agregar(this.nuevo).subscribe(() => {
        this.cargarClientes();
        this.nuevo = { id: 0, nombre: '', correo: '' };
      });
    }
  }

  editar(cliente: Cliente) {
    this.nuevo = { ...cliente };
    this.editando = true;
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar cliente?')) return;
    this.clienteSrv.eliminar(id).subscribe(() => this.cargarClientes());
  }

  cancelar() {
    this.editando = false;
    this.nuevo = { id: 0, nombre: '', correo: '' };
  }
}
