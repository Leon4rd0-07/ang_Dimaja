import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuariosListaComponent } from './usuarios-lista/usuarios-lista.component';
import { InicioComponent } from './inicio/inicio.component';
import { StockComponent } from './stock/stock.component';
import { UsuariosAgregarComponent } from './usuarios-agregar/usuarios-agregar.component';
import { ProductosListaComponent } from './productos-lista/productos-lista.component';
import { ProductosAgregarComponent } from './productos-agregar/productos-agregar.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: InicioComponent},
  { path: 'lista-productos', component: ProductosListaComponent},
  { path: 'agregar-productos', component: ProductosAgregarComponent},
  { path: 'lista-usuarios', component: UsuariosListaComponent},
  { path: 'agregar-usuarios', component: UsuariosAgregarComponent},
  { path: 'stock', component: StockComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
