import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClienteSoapService } from '../../service/soap';

@Component({
  selector: 'app-post-client',
  imports: [ReactiveFormsModule],
  templateUrl: './post-client.html',
})
export class PostClient {
  protected clienteSoap = inject(ClienteSoapService);

  fb = inject(FormBuilder);
  formCliente: FormGroup;

  constructor() {
    this.formCliente = this.fb.group({
      id: [''],
      nombres: [''],
      apellidos: [''],
      email: [''],
      cedula: [''],
    });
  }

  insertarCliente() {
    const { id, nombres, apellidos, email, cedula } = this.formCliente.value;
    this.clienteSoap
      .insertarCliente(id, nombres, apellidos, email, cedula)
      .subscribe((resp: any) => {
        console.log('Respuesta SOAP: ', resp);
      });

    console.log('form enviado: ', id, nombres, apellidos, email, cedula);
  }

  @Output() cancel = new EventEmitter<string>();

  cancelInsert() {
    this.cancel.emit('');
  }
}
