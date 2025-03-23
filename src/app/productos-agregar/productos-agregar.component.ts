import { Component, OnInit } from '@angular/core';
import { Productos } from '../modelo/productos';
import { ProductosService } from '../service/productos.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from '../service/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-agregar',
  standalone: false,
  templateUrl: './productos-agregar.component.html',
  styleUrls: ['./productos-agregar.component.css']
})
export class ProductosAgregarComponent implements OnInit {
  nuevoProducto: Productos = new Productos();
  categorias: any[] = [];
  mostrarModalCategoria: boolean = false;
  nuevaCategoria: any = { nombre_categoria: '' };

  usarUrl: boolean = true;
  previewImage: string | null = null;

  constructor(
    private productoService: ProductosService,
    private toastr: ToastrService,
    private categoriasService: CategoriasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  // Método para obtener las categorias existentes
  private obtenerCategorias() {
    this.categoriasService.obtenerCategoriasLista().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  // Método para agregar un nuevo rol
  guardarCategoria() {
    if (!this.nuevaCategoria.nombre_categoria.trim()) {
      this.toastr.warning('Ingrese un nombre para la Categoria', 'Advertencia');
      return;
    }

    this.categoriasService.agregarCategoria(this.nuevaCategoria).subscribe({
      next: (categoriaGuardada) => {
        this.categorias.push(categoriaGuardada);  // Agregar el nuevo rol a la lista
        this.nuevoProducto.id_categorias = categoriaGuardada.id_categorias;  // Asignar el nuevo rol al usuario
        this.toastr.success('Categoría agregada exitosamente', '¡Éxito!');
        this.cerrarModalCategoria();
      },
      error: (error) => {
        console.error('Error al agregar rol', error);
        this.toastr.error('No se pudo agregar la categoria', 'Error');
      }
    });
  }

  // Método para guardar el nuevo usuario
  guardarProductos() {
    this.productoService.guardarProductos(this.nuevoProducto).subscribe({
      next: () => {
        this.toastr.success('Producto agregado exitosamente', '¡Éxito!');
        this.cancelar();  // Limpiar el formulario después de agregar el usuario

        this.router.navigate(['/lista-productos']); 
      },
      error: (error) => {
        console.error('Error al agregar usuario', error);
        this.toastr.error('No se pudo agregar el producto', '¡Error!');
      }
    });
  }

  // Método para cancelar el formulario y resetearlo
  cancelar() {
    this.nuevoProducto = new Productos();
  }


  // Abrir modal para agregar nueva categoría
  abrirModalCategoria() {
    this.mostrarModalCategoria = true;
  }

  // Cerrar modal de categoría
  cerrarModalCategoria() {
    this.mostrarModalCategoria = false;
    this.nuevaCategoria = { nombre_categoria: '' };
  }

  toggleInput() {
    this.usarUrl = !this.usarUrl;
    this.previewImage = null;
    this.nuevoProducto.img = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.productoService.subirImagen(formData).subscribe({
        next: (response: any) => {
          this.nuevoProducto.img = response.url;
          this.previewImage = response.url;
          console.log('Imagen subida correctamente:', response.url);
        },
        error: (error) => {
          console.error('Error al subir la imagen', error);
        }
      });
    }
  }
}
