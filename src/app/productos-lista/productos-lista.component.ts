import { Component, OnInit } from '@angular/core';
import { Productos } from '../modelo/productos';
import { ProductosService } from '../service/productos.service';

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
  nuevoProducto: Productos = new Productos(); // Nuevo producto para agregar

  constructor(private productoServicio: ProductosService) {}

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
        alert('Producto agregado exitosamente');
        this.obtenerProductos(); // Recargar la lista de productos
        this.nuevoProducto = new Productos(); // Resetear el formulario
      },
      error: (err) => {
        console.error('Error al agregar producto:', err);
        alert('Error al agregar el producto');
      },
    });
  }

  getCategoriaName(id: number): string {
    const categoria = this.categorias.find((c) => c.id_categorias === id);
    return categoria ? categoria.nombre_categoria : 'Desconocida';
  }
}
