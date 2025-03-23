import { Component, OnInit } from '@angular/core';
import { StockService } from '../service/stock.service';
import { Stock } from '../modelo/stock';
import { ProductosService } from '../service/productos.service';
import { Productos } from '../modelo/productos';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockLista: Stock[] = [];
  productosLista: Productos[] = [];
  productosFiltrados: Productos[] = [];
  stocksAAgregar: Stock[] = [];
  searchTerm: string = '';
  ambosMinimizados: boolean = false; // Para la minimización de ambos paneles

  constructor(
    private stockService: StockService,
    private productoService: ProductosService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerStock();
    this.obtenerProductos();
    this.checkStockBajo();
  }

  checkStockBajo(): void {
    this.stockLista.forEach(stock => {
      if (stock.cantidad < 5) {
        this.toastr.warning(
          `El producto ${this.obtenerNombreProducto(stock.idProductos)} tiene un stock bajo.`,
          'Advertencia de stock bajo'
        );
      }
    });
  }

  minimizarAmbosPaneles(): void {
    this.ambosMinimizados = !this.ambosMinimizados;
  }

  obtenerStock(): void {
    this.stockService.obtenerStockLista().subscribe(
      data => {
        this.stockLista = data;
      },
      error => {
        console.error('Error al obtener el stock', error);
        this.toastr.error('No se pudo obtener el stock', 'Error');
      }
    );
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductosLista().subscribe(
      data => {
        this.productosLista = data;
        this.productosFiltrados = data;
      },
      error => {
        console.error('Error al obtener los productos', error);
        this.toastr.error('No se pudieron obtener los productos', 'Error');
      }
    );
  }

  obtenerNombreProducto(idProducto: number): string {
    const producto = this.productosLista.find(p => p.id_productos === idProducto);
    return producto ? producto.nombres_productos : 'Desconocido';
  }

  obtenerMarcaProducto(idProducto: number): string {
    const producto = this.productosLista.find(p => p.id_productos === idProducto);
    return producto ? producto.marca : 'Desconocido';
  }


  filtrarProductos(): void {
    if (this.searchTerm.trim() === '') {
      this.productosFiltrados = this.productosLista;
      return;
    }
  
    this.productosFiltrados = this.productosLista.filter(producto =>
      producto.nombres_productos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.marca.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  

  seleccionarProducto(producto: Productos): void {
    const stockExistente = this.stocksAAgregar.find(stock => stock.idProductos === producto.id_productos);

    if (stockExistente) {
      stockExistente.cantidad += 1;
    } else {
      const nuevoStock: Stock = {
        id_stock: 0,
        cantidad: 1,
        idProductos: producto.id_productos
      };
      this.stocksAAgregar.push(nuevoStock);
    }

    this.searchTerm = '';
  }

  eliminarProducto(idProducto: number): void {
    this.stocksAAgregar = this.stocksAAgregar.filter(stock => stock.idProductos !== idProducto);
  }

  agregarStock(): void {
    if (this.stocksAAgregar.length === 0) {
      this.toastr.warning('Debe seleccionar al menos un producto para agregar stock', 'Advertencia');
      return;
    }

    this.stockService.agregarStockMultiple(this.stocksAAgregar).subscribe(
      stocksAgregados => {
        if (Array.isArray(stocksAgregados)) {
          stocksAgregados.forEach(nuevoStock => {
            const stockExistente = this.stockLista.find(stock => stock.idProductos === nuevoStock.idProductos);
            if (stockExistente) {
              stockExistente.cantidad = nuevoStock.cantidad;
            } else {
              this.stockLista.push(nuevoStock);
            }
          });
          this.toastr.success('Stocks agregados exitosamente', 'Éxito');
        } else {
          this.toastr.error('No se pudieron agregar los stocks', 'Error');
        }
        this.stocksAAgregar = [];
      },
      error => {
        this.toastr.error('No se pudieron agregar los stocks', 'Error');
      }
    );
  }

  limpiarProductos(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'No, cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.stocksAAgregar = [];
        this.toastr.success('Productos limpiados con éxito', 'Éxito');
      } else {
        this.toastr.info('No se han limpiado los productos.', 'Operación cancelada');
      }
    });
  }
}
