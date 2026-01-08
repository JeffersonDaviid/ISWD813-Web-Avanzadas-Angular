import { Component, inject, signal } from '@angular/core';
import { Cliente } from '../../models/Cliente';
import { ClienteSoapService } from '../../service/soap';
import { UpdateClient } from '../update-client/update-client';
import { PostClient } from '../post-client/post-client';

@Component({
  selector: 'app-list-clients',
  imports: [UpdateClient, PostClient],
  templateUrl: './list-clients.html',
})
export class ListClients {
  protected clienteSoap = inject(ClienteSoapService);

  clientesParsed = signal<Cliente[]>([]);

  openModal = signal('');

  ngOnInit(): void {
    this.clienteSoap.listarClientes().subscribe((resp: any) => {
      this.parserXML(resp);
    });
  }

  parserXML(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    // Namespace del modelo
    const ns = 'http://schemas.datacontract.org/2004/07/ServicioClientesSOA.Models';

    const clientes = xmlDoc.getElementsByTagNameNS(ns, 'Cliente');

    const lista: Cliente[] = [];

    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];

      const id = cliente.getElementsByTagNameNS(ns, 'Id')[0]?.textContent;
      const nombres = cliente.getElementsByTagNameNS(ns, 'Nombres')[0]?.textContent;
      const apellidos = cliente.getElementsByTagNameNS(ns, 'Apellidos')[0]?.textContent;
      const email = cliente.getElementsByTagNameNS(ns, 'Email')[0]?.textContent;
      const cedula = cliente.getElementsByTagNameNS(ns, 'Cedula')[0]?.textContent;

      lista.push({
        id,
        nombres,
        apellidos,
        email,
        cedula,
      });
    }

    this.clientesParsed.set(lista);
  }

  deleteCliente(cedula: string) {
    this.clienteSoap.eliminarCliente(cedula).subscribe((resp: any) => {
      console.log('Respuesta SOAP: ', resp);
      // Refrescar la lista de clientes después de eliminar
      this.clienteSoap.listarClientes().subscribe((resp: any) => {
        this.parserXML(resp);
      });
    });
  }

  editClient(id: string) {
    this.openModal.set(`update-client-${id}`);
  }

  cancelEdit($event: string) {
    this.openModal.set($event);
  }

  addNewClient() {
    this.openModal.set('post-client');
  }
}
