import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../modelo/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlBase = "http://localhost:8080/dimaja-app/rol";

  constructor(private clienteHttp: HttpClient) { }

  // Método corregido para obtener la lista de stock
  obtenerRolLista(): Observable<Rol[]> {
    return this.clienteHttp.get<Rol[]>(this.urlBase);
  }

  // Método para agregar un nuevo stock
  agregarRol(rol: Rol): Observable<Rol> {
    return this.clienteHttp.post<Rol>(this.urlBase, rol);
  }   
}

