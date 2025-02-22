import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuariosListaComponent } from './usuarios-lista/usuarios-lista.component';
import { InicioComponent } from './inicio/inicio.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosListaComponent } from './productos-lista/productos-lista.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosListaComponent,
    ProductosListaComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    timeOut: 3000,
    preventDuplicates: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
