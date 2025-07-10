import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DatePipe, NgIf, NgFor, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kardex',
  standalone: true,
  templateUrl: './kardex.component.html',
  imports: [NgIf, NgFor, DatePipe, DecimalPipe],
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {
  productos: any[] = [];
  movimientos: any[] = [];
  productoSeleccionado: any = null;
  showModal = false;
  mensaje = '';

constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
  this.api.listarKardex().subscribe(res => {
    this.productos = res;
    console.log('Kardex:', this.productos);
  });
}

  verMovimientos(prod: any) {
    this.productoSeleccionado = prod;
    this.api.listarMovimientosProducto(prod.id_Producto).subscribe({
      next: res => {
        this.movimientos = res;
        this.showModal = true;
      },
      error: () => {
        this.mensaje = 'No se pudo cargar movimientos.';
        this.movimientos = [];
      }
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.productoSeleccionado = null;
    this.movimientos = [];
    this.mensaje = '';
  }

  tipoMovimiento(tipo: number) {
    return tipo === 1 ? 'Compra (Entrada)' : 'Venta (Salida)';
}
    volverMenu() {
    this.router.navigate(['/menu']);
  }

}
