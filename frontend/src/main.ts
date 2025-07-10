import { provideRouter, Routes } from '@angular/router';
import { ComprasComponent } from './app/features/compras/compras.component';
import { MenuComponent } from './app/features/menu/menu.component';
import { authGuard } from './app/core/auth.guard';
import { LoginComponent } from './app/features/login/login.component';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptorService } from './app/core/token-interceptor.service';
import { VentasComponent } from './app/features/ventas/ventas.component';
import { ProductosComponent } from './app/features/productos/productos.component';
import { KardexComponent } from './app/features/kardex/kardex.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'compras', component: ComprasComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard]},
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'kardex', component: KardexComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        TokenInterceptorService 
      ])
    )
  ]
});