import { Component, OnInit } from '@angular/core';
import { Productos } from '../modelo/productos';
import { ProductosService } from '../service/productos.service';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

@Component({
  selector: 'app-productos-lista',
  standalone: false,
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css'],
})
export class ProductosListaComponent implements OnInit {
  productos: Productos[] = [];
  categorias: any[] = [];
  selectedCategoria: any = '';
  nuevoProducto: Productos = new Productos();

  constructor(private productoServicio: ProductosService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  private obtenerProductos() {
    this.productoServicio.obtenerProductosLista().subscribe((datos) => {
      this.productos = datos;
    });
  }

  private obtenerCategorias() {
    this.productoServicio.obtenerCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  agregarProducto() {
    this.productoServicio.agregarProducto(this.nuevoProducto).subscribe({
      next: (data) => {
        console.log('Producto agregado:', data);
        this.toastr.success('Producto agregado exitosamente', 'Éxito'); // Mostrar alerta
        this.obtenerProductos();
        this.nuevoProducto = new Productos();
      },
      error: (err) => {
        console.error('Error al agregar producto:', err);
        this.toastr.error('Error al agregar el producto', 'Error'); // Mostrar error
      },
    });
  }

  getCategoriaName(id: number): string {
    const categoria = this.categorias.find((c) => c.id_categorias === id);
    return categoria ? categoria.nombre_categoria : 'Desconocida';
  }

  eliminarProducto(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      this.productoServicio.eliminarProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(producto => producto.id_productos !== id);
        },
        error: (error) => {
          console.error("Error al eliminar el producto", error);
        }
      });
    }
  }

}
