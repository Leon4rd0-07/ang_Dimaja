import { Component, OnInit } from '@angular/core';
import { StockService } from '../service/stock.service';
import { Stock } from '../modelo/stock';
import { ProductosService } from '../service/productos.service';
import { Productos } from '../modelo/productos';
import { ToastrService } from 'ngx-toastr'; // ✅ Importar ToastrService

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockLista: Stock[] = [];
  productosLista: Productos[] = [];
  nuevoStock: Stock = { id_stock: 0, cantidad: 0, idProductos: 0 };

  constructor(
    private stockService: StockService,
    private productoService: ProductosService,
    private toastr: ToastrService // ✅ Inyectar ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerStock();
    this.obtenerProductos();
  }

  obtenerStock(): void {
    this.stockService.obtenerStockLista().subscribe(
      data => {
        this.stockLista = data;
      },
      error => {
        console.error("Error al obtener el stock", error);
      }
    );
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductosLista().subscribe(
      data => {
        this.productosLista = data;
      },
      error => {
        console.error("Error al obtener los productos", error);
      }
    );
  }

  obtenerNombreProducto(idProducto: number): string {
    const producto = this.productosLista.find(p => p.id_productos === idProducto);
    return producto ? producto.nombres_productos : 'Desconocido';
  }

  agregarStock(): void {
    console.log("Datos enviados al backend:", this.nuevoStock);
    this.stockService.agregarStock(this.nuevoStock).subscribe(
      (stockAgregado) => {
        console.log("Stock agregado:", stockAgregado);
        this.stockLista.push(stockAgregado);
        this.toastr.success('Stock agregado exitosamente', 'Éxito'); // ✅ Alerta de éxito
        this.nuevoStock = { id_stock: 0, cantidad: 0, idProductos: 0 };
      },
      error => {
        console.error("Error al agregar stock", error);
        this.toastr.error('No se pudo agregar el stock', 'Error'); // ✅ Alerta de error
      }
    );
  }
}
