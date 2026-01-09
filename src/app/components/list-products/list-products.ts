import { Component, inject, signal } from '@angular/core';
import { PostProduct } from '../post-product/post-product';
import { ProductoSoapService } from '../../service/producto-soap';
import { Producto } from '../../models/Producto';
import { UpdateProduct } from '../update-product/update-product';

@Component({
  selector: 'app-list-products',
  imports: [PostProduct, UpdateProduct],
  templateUrl: './list-products.html',
})
export class ListProducts {
  protected productoSoap = inject(ProductoSoapService);

  productosParsed = signal<Producto[]>([]);

  openModal = signal('');

  ngOnInit(): void {
    this.productoSoap.listarProductos().subscribe((resp: any) => {
      this.parserXML(resp);
    });
  }

  parserXML(xml: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const ns = 'http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models';

    // OJO: el nodo es Producto, no Cliente
    const productos = xmlDoc.getElementsByTagNameNS(ns, 'Producto');

    const lista: Producto[] = [];

    for (let i = 0; i < productos.length; i++) {
      const tp = productos[i];

      const id = Number(tp.getElementsByTagNameNS(ns, 'Id')[0]?.textContent ?? 0);
      const id_tipo = Number(tp.getElementsByTagNameNS(ns, 'Id_tipo')[0]?.textContent ?? '');
      const descripcion = tp.getElementsByTagNameNS(ns, 'Descripcion')[0]?.textContent ?? '';
      const valor = Number(tp.getElementsByTagNameNS(ns, 'Valor')[0]?.textContent ?? 0);
      const costo = Number(tp.getElementsByTagNameNS(ns, 'Costo')[0]?.textContent ?? 0);

      lista.push({ id, id_tipo, descripcion, valor, costo });
    }

    this.productosParsed.set(lista);
  }

  deleteCliente(id: number) {
    this.productoSoap.eliminarProducto(id).subscribe((resp: any) => {
      console.log('Respuesta SOAP: ', resp);
      // Refrescar la lista de clientes después de eliminar
      this.productoSoap.listarProductos().subscribe((resp: any) => {
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
    this.openModal.set('post-product');
  }
}
