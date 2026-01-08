export interface Producto {
  id: number;
  id_tipo: number;
  descripcion: string;
  valor: number;
  costo: number;
}

export interface TipoProducto {
  id: number;
  tipo: string;
}
