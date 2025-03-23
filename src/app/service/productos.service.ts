import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Productos } from '../modelo/productos';
import { Stock } from '../modelo/stock';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  //1. Crear la url Base para productos
  private urlBase = "http://localhost:8080/dimaja-app/productos";

  //2. Crear la url Base para categorías
  private urlCategorias = "http://localhost:8080/dimaja-app/categorias";
  private urlStock = "http://localhost:8080/dimaja-app/stock";

  //3. Creando el constructor
  constructor(private clienteHttp: HttpClient) { }

  //4. Definir método para obtener Lista de productos
  obtenerProductosLista(): Observable<Productos[]> {
    return forkJoin({
      productos: this.clienteHttp.get<Productos[]>(this.urlBase),
      stock: this.clienteHttp.get<Stock[]>(this.urlStock)
    }).pipe(
      map(({ productos, stock }) => {
        return productos.map(producto => {
          // Buscar el stock del producto por su ID correcto
          const stockProducto = stock.find(s => s.idProductos === producto.id_productos);
          return { 
            ...producto, 
            stock: stockProducto ? stockProducto.cantidad : 0 
          };
        });
      })
    );
  }

  //5. Definir método para obtener Lista de categorías
  obtenerCategorias(): Observable<any[]> {
    return this.clienteHttp.get<any[]>(this.urlCategorias);
  }

  //6. Método para agregar un nuevo producto
  guardarProductos(producto: Productos): Observable<Productos> {
    return this.clienteHttp.post<Productos>(this.urlBase, producto);
  }

  //7. Método para eliminar un producto por ID
  eliminarProductos(id: number): Observable<void> {
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }

  //8. Método para actualizar un producto existente
  actualizarProducto(producto: Productos): Observable<string> {
    return this.clienteHttp.put<string>(this.urlBase, producto);
  }

  //9. Método para subir una imagen
  subirImagen(file: FormData): Observable<any> {
    return this.clienteHttp.post<any>(`${this.urlBase}/upload`, file);
  }
}
