import { Injectable, signal } from '@angular/core';

export interface Producto {
  code: string;
  name: string;
  cost: number;
  price: number;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos = signal<Producto[]>([
    { code: 'A2710', name: 'Producto 1', cost: 34, price: 40, value: 2 },
  ]);

  constructor() {}

  public addProduct(product: Producto) {
    this.productos.update((prod) => [...prod, product]);
  }

  public getProducts() {
    return this.productos();
  }

  public deleteProduct(code: string) {
    this.productos.update((prod) => prod.filter((p) => p.code !== code));
  }

  public updateProduct(product: Producto) {
    this.productos.update((prod) =>
      prod.map((p) => {
        if (p.code === product.code)
          return {
            ...p,
            name: product.name,
            cost: product.cost,
            price: product.price,
            value: product.value,
          };
        else return p;
      })
    );
  }
}
