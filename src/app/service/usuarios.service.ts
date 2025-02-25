import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios } from '../modelo/usuarios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //1. Crear la url Base
  private urlBase = "http://localhost:8080/dimaja-app/usuarios"; // URL para obtener los usuarios
  private urlRoles = "http://localhost:8080/dimaja-app/rol"; // URL para obtener los roles

  //2. Creando el constructor
  constructor(private clienteHttp: HttpClient) { }

  //3. Definir metodo para obtener Lista de usuarios
  obtenerUsuariosLista(): Observable<Usuarios[]> {
    return this.clienteHttp.get<Usuarios[]>(this.urlBase);
  }

  //4. Método para obtener los roles
  obtenerRoles(): Observable<any[]> {
    return this.clienteHttp.get<any[]>(this.urlRoles);
  }

  guardarUsuarios(usuarios: Usuarios): Observable<Usuarios>{
    return this.clienteHttp.post<Usuarios>(this.urlBase, usuarios);

  }

  eliminarUsuarios(id: number): Observable<void>{
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }




}