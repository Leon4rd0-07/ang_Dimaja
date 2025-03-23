import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Situacion } from '../modelo/situacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SituacionService {

  private urlBase = "http://localhost:8080/dimaja-app/situacion";

  constructor(private clienteHttp: HttpClient) { }

  // Método corregido para obtener la lista de stock
  obtenerSituacionLista(): Observable<Situacion[]> {
    return this.clienteHttp.get<Situacion[]>(this.urlBase);
  }

  // Método para agregar un nuevo stock
  agregarSituacion(situacion: Situacion): Observable<Situacion> {
    return this.clienteHttp.post<Situacion>(this.urlBase, situacion);
  }   
}