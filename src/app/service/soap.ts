import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteSoapService {
  private url = 'http://localhost:5281/ClienteService.svc';
  private http = inject(HttpClient);

  listarClientes(): Observable<string> {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:ListarClientes/>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IClienteService/ListarClientes',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  buscarCliente(id: string): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:BuscarCliente>
                <tem:cedula>${id}</tem:cedula>
              </tem:BuscarCliente>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IClienteService/BuscarCliente',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  insertarCliente(
    id: string,
    nombres: string,
    apellidos: string,
    email: string,
    cedula: string
  ): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioClientesSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:InsertarCliente>
                <tem:cliente>
                  <ser:Id>${id}</ser:Id>
                  <ser:Nombres>${nombres}</ser:Nombres>
                  <ser:Apellidos>${apellidos}</ser:Apellidos>
                  <ser:Email>${email}</ser:Email>
                  <ser:Cedula>${cedula}</ser:Cedula>
                </tem:cliente>
              </tem:InsertarCliente>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IClienteService/InsertarCliente',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  actualizarCliente(
    id: string,
    nombres: string,
    apellidos: string,
    email: string,
    cedula: string
  ): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/"
                            xmlns:ser="http://schemas.datacontract.org/2004/07/ServicioClientesSOA.Models">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:ActualizarCliente>
                <tem:cliente>
                  <ser:Id>${id}</ser:Id>
                  <ser:Nombres>${nombres}</ser:Nombres>
                  <ser:Apellidos>${apellidos}</ser:Apellidos>
                  <ser:Email>${email}</ser:Email>
                  <ser:Cedula>${cedula}</ser:Cedula>
                </tem:cliente>
              </tem:ActualizarCliente>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IClienteService/ActualizarCliente',
    });
    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }

  eliminarCliente(cedula: string): Observable<string> {
    const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
              <tem:EliminarCliente>
                <tem:cedula>${cedula}</tem:cedula>
              </tem:EliminarCliente>
            </soapenv:Body>
          </soapenv:Envelope>
  `;
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://tempuri.org/IClienteService/EliminarCliente',
    });

    return this.http.post(this.url, soapBody, {
      headers,
      responseType: 'text',
    });
  }
}
