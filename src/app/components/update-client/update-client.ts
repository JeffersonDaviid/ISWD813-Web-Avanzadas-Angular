import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoProducto } from '../../models/Producto';
import { TipoProductoSoapService } from '../../service/tipo-producto-soap';

@Component({
  selector: 'app-update-client',
  imports: [ReactiveFormsModule],
  templateUrl: './update-client.html',
})
export class UpdateClient implements OnInit {
  client = input.required<TipoProducto>();
  protected fb = inject(FormBuilder);
  formUpdate!: FormGroup;

  clienteService = inject(TipoProductoSoapService);

  ngOnInit() {
    this.formUpdate = this.fb.group({
      id: [this.client().id],
      tipo: [this.client().tipo],
    });
  }

  updateCliente() {
    const { id, tipo } = this.formUpdate.value;
    console.log('form update enviado: ', id, tipo);
    // Aquí puedes llamar al servicio SOAP para actualizar el cliente
    this.clienteService.actualizarTipoProducto(id, tipo).subscribe({
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
