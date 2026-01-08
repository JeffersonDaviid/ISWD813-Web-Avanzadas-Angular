import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoProductoSoapService } from '../../service/tipo-producto-soap';

@Component({
  selector: 'app-post-client',
  imports: [ReactiveFormsModule],
  templateUrl: './post-client.html',
})
export class PostClient {
  protected clienteSoap = inject(TipoProductoSoapService);

  fb = inject(FormBuilder);
  formCliente: FormGroup;

  constructor() {
    this.formCliente = this.fb.group({
      id: [''],
      tipo: [''],
    });
  }

  insertarCliente() {
    const { id, tipo } = this.formCliente.value;
    this.clienteSoap.insertarTipoProducto(id, tipo).subscribe((resp: any) => {
      console.log('Respuesta SOAP: ', resp);
    });

    console.log('form enviado: ', id, tipo);
  }

  @Output() cancel = new EventEmitter<string>();

  cancelInsert() {
    this.cancel.emit('');
  }
}
