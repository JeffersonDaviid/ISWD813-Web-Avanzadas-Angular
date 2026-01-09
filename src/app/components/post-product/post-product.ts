import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ProductoSoapService } from '../../service/producto-soap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-product',
  imports: [ReactiveFormsModule],
  templateUrl: './post-product.html',
})
export class PostProduct {
  protected productoService = inject(ProductoSoapService);

  fb = inject(FormBuilder);
  formProducto: FormGroup;

  constructor() {
    this.formProducto = this.fb.group({
      id: [0],
      id_tipo: [0],
      descripcion: [''],
      valor: [0],
      costo: [0],
    });
  }

  insertarProducto() {
    const { id, id_tipo, descripcion, valor, costo } = this.formProducto.value;
    this.productoService.insertarProducto(id, id_tipo, descripcion, valor, costo).subscribe({
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
