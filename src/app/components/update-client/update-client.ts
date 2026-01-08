import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { Cliente } from '../../models/Cliente';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClienteSoapService } from '../../service/soap';

@Component({
  selector: 'app-update-client',
  imports: [ReactiveFormsModule],
  templateUrl: './update-client.html',
})
export class UpdateClient implements OnInit {
  client = input.required<Cliente>();
  protected fb = inject(FormBuilder);
  formUpdate!: FormGroup;

  clientService = inject(ClienteSoapService);

  ngOnInit() {
    this.formUpdate = this.fb.group({
      id: [this.client().id],
      nombres: [this.client().nombres],
      apellidos: [this.client().apellidos],
      email: [this.client().email],
      cedula: [this.client().cedula],
    });
  }

  updateCliente() {
    const { id, nombres, apellidos, email, cedula } = this.formUpdate.value;
    console.log('form update enviado: ', id, nombres, apellidos, email, cedula);
    // Aquí puedes llamar al servicio SOAP para actualizar el cliente
    this.clientService
      .actualizarCliente(id, nombres, apellidos, email, cedula)
      .subscribe((resp: any) => {
        console.log('Respuesta SOAP de actualización: ', resp);
      });
  }
  @Output() cancel = new EventEmitter<string>();

  cancelUpdate() {
    this.cancel.emit('');
  }
}
