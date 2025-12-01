 export interface Product {
  id: string;
  nombre: string;
  marca?: string;
  proveedor?: string;
  precioCompra?: number;
  precioVenta?: number;
  fechaCompra?: string; // ISO yyyy-mm-dd
  fechaCaducidad?: string; // ISO yyyy-mm-dd
  codigoBarras?: string;
  cantidad?: number;
}
