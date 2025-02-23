import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductosListaComponent } from './productos-lista/productos-lista.component';
import { UsuariosListaComponent } from './usuarios-lista/usuarios-lista.component';
import { InicioComponent } from './inicio/inicio.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: 'productos', component: ProductosListaComponent },
  { path: 'usuarios', component: UsuariosListaComponent},
  { path: 'stock', component: StockComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
