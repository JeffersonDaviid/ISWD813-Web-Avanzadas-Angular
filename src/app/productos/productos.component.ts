import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Producto, ProductoService } from '../services/producto.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  _productService = inject(ProductoService);
  private _builder = inject(FormBuilder);
  protected form_producto: FormGroup;

  protected cargando = false;
  protected isEditing = false;
  protected displayedColumns: string[] = [
    'code',
    'name',
    'cost',
    'price',
    'value',
    'actions',
  ];

  constructor() {
    this.form_producto = this._builder.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Za-z]\d+$/)]], // NOMBRE CON LETRA SEGUIDA DE NÚMEROS
      name: ['', [Validators.required, Validators.minLength(5)]], // NOMBRE MÍNIMO 5 LETRAS
      cost: [0, [Validators.required, Validators.min(0.1)]], // COSTO MAYOR A CERO
      price: [
        0,
        [Validators.required, Validators.min(10), Validators.max(100)],
      ], // PRECIO ENTRE 10 Y 100
      value: [0, [Validators.required]],
    });
  }

  hasErrors(controlName: string, errorType: string) {
    return (
      this.form_producto.get(controlName)?.hasError(errorType) &&
      this.form_producto.get(controlName)?.touched
    );
  }

  guardar() {
    this.form_producto.markAllAsTouched();

    if (!this.form_producto.valid) return;

    const product: Producto = {
      code: this.form_producto.get('code')!.value as string,
      name: this.form_producto.get('name')!.value as string,
      cost: Number(this.form_producto.get('cost')!.value),
      price: Number(this.form_producto.get('price')!.value),
      value: Number(this.form_producto.get('value')!.value),
    };

    this._productService.addProduct(product);
    this.cancelar(); // Usar la función cancelar para limpiar todo
  }

  editar(product: Producto) {
    this.form_producto.patchValue({
      code: product.code,
      name: product.name,
      cost: product.cost,
      price: product.price,
      value: product.value,
    });

    this.isEditing = true;

    this.form_producto.get('code')?.disable();
  }

  cancelar() {
    this.form_producto.reset();

    this.form_producto.markAsUntouched();
    this.form_producto.markAsPristine();

    this.isEditing = false;
    this.form_producto.get('code')?.enable();

    this.form_producto.patchValue({
      code: '',
      name: '',
      cost: 0,
      price: 0,
      value: 0,
    });
  }

  actualizar() {
    this.form_producto.markAllAsTouched();

    if (!this.form_producto.valid) return;

    const product: Producto = {
      code: this.form_producto.get('code')!.value as string,
      name: this.form_producto.get('name')!.value as string,
      cost: Number(this.form_producto.get('cost')!.value),
      price: Number(this.form_producto.get('price')!.value),
      value: Number(this.form_producto.get('value')!.value),
    };

    this._productService.updateProduct(product);
    this.cancelar(); // Usar la función cancelar para limpiar todo y salir del modo edición
  }

  eliminar(code: string) {
    this._productService.deleteProduct(code);
  }
}
