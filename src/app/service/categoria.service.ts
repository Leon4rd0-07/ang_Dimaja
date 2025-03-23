import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categorias } from '../modelo/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private urlBase = "http://localhost:8080/dimaja-app/categorias";

  constructor(private clienteHttp: HttpClient) { }

  // Método corregido para obtener la lista de stock
  obtenerCategoriasLista(): Observable<Categorias[]> {
    return this.clienteHttp.get<Categorias[]>(this.urlBase);
  }

  // Método para agregar un nuevo stock
  agregarCategoria(categorias: Categorias): Observable<Categorias> {
    return this.clienteHttp.post<Categorias>(this.urlBase, categorias);
  }   
}

