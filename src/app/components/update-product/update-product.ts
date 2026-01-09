import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Producto } from '../../models/Producto';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoProductoSoapService } from '../../service/tipo-producto-soap';
import { ProductoSoapService } from '../../service/producto-soap';

@Component({
  selector: 'app-update-product',
  imports: [ReactiveFormsModule],
  templateUrl: './update-product.html',
})
export class UpdateProduct {
  client = input.required<Producto>();
  protected fb = inject(FormBuilder);
  formUpdate!: FormGroup;

  productoService = inject(ProductoSoapService);

  ngOnInit() {
    this.formUpdate = this.fb.group({
      id: [this.client().id],
      id_tipo: [this.client().id_tipo],
      descripcion: [this.client().descripcion],
      valor: [this.client().valor],
      costo: [this.client().costo],
    });
  }

  updateProducto() {
    const { id, id_tipo, descripcion, valor, costo } = this.formUpdate.value;
    console.log('form update enviado: ', id, id_tipo, descripcion, valor, costo);
    // Aquí puedes llamar al servicio SOAP para actualizar el producto
    this.productoService.actualizarProducto(id, id_tipo, descripcion, valor, costo).subscribe({
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

  cancelUpdate() {
    this.cancel.emit('');
  }
}
