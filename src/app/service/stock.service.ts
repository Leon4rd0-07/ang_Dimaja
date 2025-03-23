import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../modelo/stock';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  // URL para obtener la lista de stock
  private urlBase = "http://localhost:8080/dimaja-app/stock"; 

  // URL para agregar múltiples productos al stock
  private urlBaseMultiple = "http://localhost:8080/dimaja-app/stock/multiple"; 

  constructor(private clienteHttp: HttpClient) { }

  // Método para obtener la lista de stock
  obtenerStockLista(): Observable<Stock[]> {
    return this.clienteHttp.get<Stock[]>(this.urlBase);
  }

  // Método para agregar un solo producto al stock
  agregarStock(stock: Stock): Observable<Stock> {
    return this.clienteHttp.post<Stock>(this.urlBase, stock);
  }

  // Método para agregar múltiples productos al stock
  agregarStockMultiple(stocks: Stock[]): Observable<Stock[]> {
    return this.clienteHttp.post<Stock[]>(this.urlBaseMultiple, stocks);  
  }
}
