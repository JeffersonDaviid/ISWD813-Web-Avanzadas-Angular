import { Component, inject, signal } from '@angular/core';
import { UpdateClient } from '../update-client/update-client';
import { PostClient } from '../post-client/post-client';
import { TipoProductoSoapService } from '../../service/tipo-producto-soap';
import { TipoProducto } from '../../models/Producto';

@Component({
  selector: 'app-list-clients',
  imports: [UpdateClient, PostClient],
  templateUrl: './list-clients.html',
})
export class ListClients {
  protected tipoProductoSoap = inject(TipoProductoSoapService);

  tipoProductosParsed = signal<TipoProducto[]>([]);

  openModal = signal('');

  ngOnInit(): void {
    this.tipoProductoSoap.listarTipoProductos().subscribe((resp: any) => {
      this.parserXML(resp);
    });
  }

  parserXML(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const ns = 'http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models';

    // OJO: el nodo es TipoProducto, no Cliente
    const tipoProductos = xmlDoc.getElementsByTagNameNS(ns, 'TipoProducto');

    const lista: TipoProducto[] = [];

    for (let i = 0; i < tipoProductos.length; i++) {
      const tp = tipoProductos[i];

      const id = Number(tp.getElementsByTagNameNS(ns, 'Id')[0]?.textContent ?? 0);

      const tipo = tp.getElementsByTagNameNS(ns, 'Tipo')[0]?.textContent ?? '';

      lista.push({ id, tipo });
    }

    this.tipoProductosParsed.set(lista);
  }

  deleteCliente(id: number) {
    this.tipoProductoSoap.eliminarTipoProducto(id).subscribe((resp: any) => {
      console.log('Respuesta SOAP: ', resp);
      // Refrescar la lista de clientes después de eliminar
      this.tipoProductoSoap.listarTipoProductos().subscribe((resp: any) => {
        this.parserXML(resp);
      });
    });
  }

  editClient(id: number) {
    this.openModal.set(`update-client-${id}`);
  }

  cancelEdit($event: string) {
    this.openModal.set($event);
  }

  addNewClient() {
    this.openModal.set('post-client');
  }
}
