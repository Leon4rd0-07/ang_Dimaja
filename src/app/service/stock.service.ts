import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from '../modelo/stock';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private urlBase = "http://localhost:8080/dimaja-app/stock";

  constructor(private clienteHttp: HttpClient) { }

  // Método corregido para obtener la lista de stock
  obtenerStockLista(): Observable<Stock[]> {
    return this.clienteHttp.get<Stock[]>(this.urlBase);
  }

  // Método para agregar un nuevo stock
  agregarStock(stock: Stock): Observable<Stock> {
    return this.clienteHttp.post<Stock>(this.urlBase, stock);
  }   
}
