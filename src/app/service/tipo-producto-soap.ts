import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoProductoSoapService {
  private url = 'http://localhost:5055/TipoProductoService.svc';
  private http = inject(HttpClient);

  listarTipoProductos(): Observable<string> {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:ListarTipoProductos/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/ITipoProductoService/ListarTipoProductos',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  buscarTipoProducto(id: number): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:BuscarTipoProducto>
                <tem:id>${id}</tem:id>
              </tem:BuscarTipoProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/ITipoProductoService/BuscarTipoProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  insertarTipoProducto(id: number, tipo: string): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:InsertarTipoProducto>
                <tem:tipoProducto>
                  <ser:Id>${id}</ser:Id>
                  <ser:Tipo>${tipo}</ser:Tipo>
                </tem:tipoProducto>
              </tem:InsertarTipoProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/ITipoProductoService/InsertarTipoProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  actualizarTipoProducto(id: number, tipo: string): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioProductoSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:ActualizarProducto>
                <tem:tipoProducto>
                  <ser:Id>${id}</ser:Id>
                  <ser:Tipo>${tipo}</ser:Tipo>
                </tem:tipoProducto>
              </tem:ActualizarProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/ITipoProductoService/ActualizarProducto',
    });
    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  eliminarTipoProducto(id: number): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:EliminarTipoProducto>
                <tem:id>${id}</tem:id>
              </tem:EliminarTipoProducto>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/ITipoProductoService/EliminarTipoProducto',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }
}
