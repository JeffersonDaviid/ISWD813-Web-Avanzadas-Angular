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
      id: [0],
      tipo: [''],
    });
  }

  insertarCliente() {
    const { id, tipo } = this.formCliente.value;
    this.clienteSoap.insertarTipoProducto(id, tipo).subscribe({
      next: (resp: any) => {
        console.log('Respuesta SOAP: ', resp);
        this.cancel.emit('');
      },
      error: (err: any) => {
        console.error('Error SOAP: ', err);
      },
    });
  }

  @Output() cancel = new EventEmitter<string>();

  cancelInsert() {
    this.cancel.emit('');
  }
}
