import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios } from '../modelo/usuarios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // 1. Crear la URL base
  private urlBase = "http://localhost:8080/dimaja-app/usuarios"; // URL para obtener los usuarios
  private urlRoles = "http://localhost:8080/dimaja-app/rol"; // URL para obtener los roles
  private urlSituacion = "http://localhost:8080/dimaja-app/situacion";
  private urlLogin = "http://localhost:8080/dimaja-app/login"; // URL para el login

  // 2. Creando el constructor
  constructor(private clienteHttp: HttpClient) { }

  // 3. Método para obtener lista de usuarios
  obtenerUsuariosLista(): Observable<Usuarios[]> {
    return this.clienteHttp.get<Usuarios[]>(this.urlBase);
  }

  // 4. Método para obtener los roles
  obtenerRoles(): Observable<any[]> {
    return this.clienteHttp.get<any[]>(this.urlRoles);
  }

  obtenerSituacion():Observable<any[]>{
    return this.clienteHttp.get<any[]>(this.urlSituacion);
  }

  // 5. Método para guardar usuario
  guardarUsuarios(usuarios: Usuarios): Observable<Usuarios> {
    return this.clienteHttp.post<Usuarios>(this.urlBase, usuarios);
  }

  // 6. Método para eliminar usuario
  eliminarUsuarios(id: number): Observable<void> {
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }

  // 7. Método para actualizar usuario
  actualizarUsuario(usuario: Usuarios): Observable<string> {
    return this.clienteHttp.put<string>(this.urlBase, usuario);
  }

  // 8. Método para login
  login(usuario: string, password: string): Observable<any> {
    return this.clienteHttp.post<any>(this.urlLogin, { usuario, password });
  }
}
