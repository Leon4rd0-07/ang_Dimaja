import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../modelo/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  //1. Crear la url Base para productos
  private urlBase = "http://localhost:8080/dimaja-app/productos";

  //2. Crear la url Base para categorías
  private urlCategorias = "http://localhost:8080/dimaja-app/categorias";

  //3. Creando el constructor
  constructor(private clienteHttp: HttpClient) { }

  //4. Definir método para obtener Lista de productos
  obtenerProductosLista(): Observable<Productos[]> {
    return this.clienteHttp.get<Productos[]>(this.urlBase);
  }

  //5. Definir método para obtener Lista de categorías
  obtenerCategorias(): Observable<any[]> {
    return this.clienteHttp.get<any[]>(this.urlCategorias);
  }

  //6. Método para agregar un nuevo producto
  agregarProducto(producto: Productos): Observable<Productos> {
    return this.clienteHttp.post<Productos>(this.urlBase, producto);
  }

  //7. Método para eliminar un producto por ID
  eliminarProducto(id: number): Observable<void> {
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }
}
