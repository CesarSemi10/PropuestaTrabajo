import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  compraForm!: FormGroup;
  productos: any[] = [];
  showModal = false;
  mensaje = '';
  nuevoProducto: any = { nombre_Producto: '', nroLote: '', costo: 0 };

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.compraForm = this.fb.group({
      detalles: this.fb.array([])
    });
    this.api.listarProductos().subscribe(res => {
      console.log('Productos:', res);
      this.productos = res;
    });


    this.agregarDetalle();
  }

  get detalles() { return this.compraForm.get('detalles') as FormArray; }

  agregarDetalle() {
    this.detalles.push(this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    }));
  }
  quitarDetalle(i: number) { this.detalles.removeAt(i); }

  registrarCompra() {
    if (this.compraForm.valid) {
      this.api.registrarCompra(this.compraForm.value).subscribe({
        next: () => {
          this.mensaje = '¡Compra registrada con éxito!';
          this.compraForm.reset();
          while (this.detalles.length) { this.detalles.removeAt(0); }
          this.agregarDetalle();
        },
        error: () => this.mensaje = 'Error al registrar compra'
      });
    }
  }
  
  volverMenu() {
    this.router.navigate(['/menu']);
  }

  abrirModal() {
    this.nuevoProducto = { nombre_Producto: '', nroLote: '', costo: 0 };
    this.showModal = true;
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
