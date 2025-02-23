import { Component, OnInit } from '@angular/core';
import { StockService } from '../service/stock.service';
import { Stock } from '../modelo/stock';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockLista: Stock[] = []; // Lista de stock
  nuevoStock: Stock = { id_stock: 0, cantidad: 0, id_productos: 0 }; // Nuevo stock a agregar

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.obtenerStock(); // Obtener stock al iniciar
  }

  obtenerStock(): void {
    this.stockService.obtenerStockLista().subscribe(
      data => {
        this.stockLista = data;
        console.log("Stock obtenido:", this.stockLista);
      },
      error => {
        console.error("Error al obtener el stock", error);
      }
    );
  }

  agregarStock(): void {
    this.stockService.agregarStock(this.nuevoStock).subscribe(
      (stockAgregado) => {
        console.log("Stock agregado:", stockAgregado);
        this.stockLista.push(stockAgregado); // Agregar el nuevo stock a la lista sin recargar
        this.nuevoStock = { id_stock: 0, cantidad: 0, id_productos: 0 }; // Reiniciar el formulario
      },
      error => {
        console.error("Error al agregar stock", error);
      }
    );
  }
}
