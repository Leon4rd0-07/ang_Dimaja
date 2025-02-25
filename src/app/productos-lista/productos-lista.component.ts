import { Component, OnInit } from '@angular/core';
import { Productos } from '../modelo/productos';
import { ProductosService } from '../service/productos.service';
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';


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
  productoEditar: Productos = new Productos(); // Para almacenar el producto a editar

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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServicio.eliminarProducto(id).subscribe({
          next: () => {
            this.productos = this.productos.filter(producto => producto.id_productos !== id);
            this.toastr.success('Producto eliminado exitosamente', 'Éxito');
          },
          error: (error) => {
            console.error('Error al eliminar el producto', error);
            this.toastr.error('Error al eliminar el producto', 'Error');
          }
        });
      }
    });
  }  

  // Método para seleccionar el producto a editar
  seleccionarProductoEditar(producto: Productos) {
    this.productoEditar = { ...producto }; // Copia el producto seleccionado
  }

  // Método para actualizar el producto
  actualizarProducto() {
    this.productoServicio.actualizarProducto(this.productoEditar).subscribe({
      next: () => {
        this.toastr.success('Producto actualizado exitosamente', 'Éxito');
        this.obtenerProductos();
      },
      error: (error) => {
        console.error('Error al actualizar el producto', error);
        this.toastr.error('Error al actualizar el producto', 'Error');
      }
    });
  }
}
