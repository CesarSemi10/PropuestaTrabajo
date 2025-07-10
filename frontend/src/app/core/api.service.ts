import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:7152/api';

  constructor(private http: HttpClient) {}

  listarProductos() {
    return this.http.get<any[]>(`${this.baseUrl}/productos`);
  }

  registrarProducto(producto: any) {
    return this.http.post(`${this.baseUrl}/productos`, producto);
  }

  registrarCompra(compra: any) {
    return this.http.post(`${this.baseUrl}/compra`, compra);
  }

  registrarVenta(venta: any) {
    return this.http.post(`${this.baseUrl}/venta`, venta);
  }

  listarKardex() {
  return this.http.get<any[]>(`${this.baseUrl}/productos`);
}

  listarMovimientosProducto(id: number) {
    return this.http.get<any[]>(`${this.baseUrl}/productos/${id}/movimientos`);
  }

}
