import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  ventaForm!: FormGroup;
  productos: any[] = [];
  showModal = false;
  mensaje = '';
  nuevoProducto: any = { nombre_Producto: '', nroLote: '', costo: 0 };

  constructor(private fb: FormBuilder, private api: ApiService,  private router: Router) {}

  ngOnInit() {
  this.ventaForm = this.fb.group({
    detalles: this.fb.array([])
  });
  this.api.listarProductos().subscribe(res => this.productos = res);
  this.agregarDetalle();

  this.detalles.valueChanges.subscribe(() => {
    this.detalles.controls.forEach((_, i) => this.calcularTotales(i));
  });
}


  get detalles(): FormArray {
    return this.ventaForm.get('detalles') as FormArray;
  }

  agregarDetalle() {
  this.detalles.push(this.fb.group({
    productoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    sub_Total: [{ value: 0, disabled: true }], // Campo solo lectura
    igv: [{ value: 0, disabled: true }],
    total: [{ value: 0, disabled: true }]
  }));
}

calcularTotales(i: number) {
  const detalle = this.detalles.at(i);
  const cantidad = detalle.get('cantidad')?.value || 0;
  const precio = detalle.get('precio')?.value || 0;
  const subTotal = cantidad * precio;
  const igv = +(subTotal * 0.18).toFixed(2);
  const total = +(subTotal + igv).toFixed(2);

  detalle.get('sub_Total')?.setValue(subTotal);
  detalle.get('igv')?.setValue(igv);
  detalle.get('total')?.setValue(total);
}



  quitarDetalle(i: number) {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(i);
    }
  }

  registrarVenta() {
    if (this.ventaForm.valid) {
      // Convierte los campos de los detalles a números
      const detalles = this.detalles.value.map((d: any) => ({
        productoId: Number(d.productoId),
        cantidad: Number(d.cantidad),
        precio: Number(d.precio)
    }));


      // Calcula totales
      const subTotal = detalles.reduce((acc: number, d: any) => acc + (d.cantidad * d.precio), 0);
      const igv = +(subTotal * 0.18).toFixed(2);
      const total = +(subTotal + igv).toFixed(2);

      // Arma el objeto con la cabecera + detalles
      const venta = {
        FecRegistro: new Date().toISOString(),
        SubTotal: subTotal,
        Igv: igv,
        Total: total,
        Detalles: detalles
    };


      console.log('Payload enviado:', venta);

      this.api.registrarVenta(venta).subscribe({
        next: () => {
          this.mensaje = '¡Venta registrada con éxito!';
          this.ventaForm.reset();
          while (this.detalles.length) { this.detalles.removeAt(0); }
          this.agregarDetalle();
        },
        error: (err) => {
          console.error('Error al registrar venta:', err);
          this.mensaje = 'Error al registrar venta: ' + (err?.error?.message || JSON.stringify(err));
        }
      });
    }
  }

  abrirModal() {
    this.nuevoProducto = { nombre_Producto: '', nroLote: '', costo: 0 };
    this.showModal = true;
  }

  volverMenu() {
    this.router.navigate(['/menu']);
  }
  cerrarModal() { this.showModal = false; }

  registrarProductoNuevo() {
    if (this.nuevoProducto.nombre_Producto && this.nuevoProducto.nroLote && this.nuevoProducto.costo > 0) {
      this.api.registrarProducto(this.nuevoProducto).subscribe({
        next: () => {
          this.api.listarProductos().subscribe(res => this.productos = res);
          this.cerrarModal();
        },
        error: () => alert('Error al registrar producto')
      });
    }
  }
}
