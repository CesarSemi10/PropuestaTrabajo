import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {
  productoForm: FormGroup;
  mensaje = '';
  
  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.productoForm = this.fb.group({
      Nombre_Producto: ['', Validators.required],
      NroLote: ['', Validators.required],
      Costo: [0, [Validators.required, Validators.min(0.01)]],
      PrecioVenta: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  calcularPrecioVenta() {
    const costo = this.productoForm.get('Costo')?.value || 0;
    this.productoForm.get('PrecioVenta')?.setValue(+(costo * 1.35).toFixed(2));
  }
  volverMenu() {
    this.router.navigate(['/menu']);
  }

  registrarProducto() {
    if (this.productoForm.valid) {
      const producto = {
        Nombre_Producto: this.productoForm.value.Nombre_Producto,
        NroLote: this.productoForm.value.NroLote,
        Costo: +this.productoForm.value.Costo,
        PrecioVenta: +this.productoForm.get('PrecioVenta')?.value
      };
      this.api.registrarProducto(producto).subscribe({
        next: () => {
          this.mensaje = '¡Producto registrado con éxito!';
          this.productoForm.reset();
          this.productoForm.get('PrecioVenta')?.setValue(0);
        },
        error: (err) => {
          this.mensaje = 'Error al registrar producto: ' + (err?.error?.message || JSON.stringify(err));
        }
      });
    }
  }
}
