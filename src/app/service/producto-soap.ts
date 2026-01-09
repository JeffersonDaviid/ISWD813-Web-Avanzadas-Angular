import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoSoapService {
  private url = 'http://localhost:5055/ProductoService.svc';
  private http = inject(HttpClient);

  listarProductos(): Observable<string> {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:ListarProductos/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IProductoService/ListarProductos',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  buscarProducto(id: number): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:BuscarProducto>
                <tem:id>${id}</tem:id>
              </tem:BuscarProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IProductoService/BuscarProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  insertarProducto(
    id: number,
    id_tipo: number,
    descripcion: string,
    valor: number,
    costo: number
  ): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:InsertarProducto>
                <tem:producto>
                  <ser:Id>${id}</ser:Id>
                  <ser:Id_tipo>${id_tipo}</ser:Id_tipo>
                  <ser:Descripcion>${descripcion}</ser:Descripcion>
                  <ser:Valor>${valor}</ser:Valor>
                  <ser:Costo>${costo}</ser:Costo>
                </tem:producto>
              </tem:InsertarProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IProductoService/InsertarProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  actualizarProducto(
    id: number,
    id_tipo: number,
    descripcion: string,
    valor: number,
    costo: number
  ): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:ActualizarProducto>
                <tem:producto>
                  <ser:Id>${id}</ser:Id>
                  <ser:Id_tipo>${id_tipo}</ser:Id_tipo>
                  <ser:Descripcion>${descripcion}</ser:Descripcion>
                  <ser:Valor>${valor}</ser:Valor>
                  <ser:Costo>${costo}</ser:Costo>
                </tem:producto>
              </tem:ActualizarProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IProductoService/ActualizarProducto',
    });
    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  eliminarProducto(id: number): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:EliminarProducto>
                <tem:id>${id}</tem:id>
              </tem:EliminarProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IProductoService/EliminarProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }
}
