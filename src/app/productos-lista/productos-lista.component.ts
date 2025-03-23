import { Component, OnInit } from '@angular/core';
import { Productos } from '../modelo/productos';
import { ProductosService } from '../service/productos.service';
import { StockService } from '../service/stock.service'; // Importar el servicio de stock
import { Stock } from '../modelo/stock'; // Importar el modelo de stock
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs'; // Importar forkJoin para ejecutar ambas peticiones en paralelo
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-productos-lista',
  standalone: false,
  templateUrl: './productos-lista.component.html',
  styleUrl: './productos-lista.component.css'
})
export class ProductosListaComponent implements OnInit {
  modalVisible: boolean = false;
  modalVisibleEditar: boolean = false;
  productos: Productos[] = [];
  productosFiltrados: Productos[] = [];
  categorias: any[] = [];
  stockLista: Stock[] = []; // Lista de stock
  selectedCategoria: any = '';
  nuevoProducto: Productos = new Productos();
  productoEditar: Productos = new Productos();

  usarUrl: boolean = true;
  previewImage: string | null = null;

  usarUrlEditar: boolean = true;
  previewImageEditar: string | null = null;

  constructor(
    private productoServicio: ProductosService,
    private stockServicio: StockService, // Agregar el servicio de stock
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.cargarDatos(); // Llamar a la función para obtener datos
    this.obtenerCategorias();
  }

  private cargarDatos() {
    forkJoin({
      productos: this.productoServicio.obtenerProductosLista(),
      stock: this.stockServicio.obtenerStockLista()
    }).subscribe(({ productos, stock }) => {
      this.productos = productos;
      this.stockLista = stock;

      // Asignar stock a cada producto si coincide el id_productos
      this.productos.forEach((producto) => {
        const stockItem = this.stockLista.find(s => s.idProductos === producto.id_productos);
        producto.stockDisponible = stockItem ? stockItem.cantidad : 0;
      });

      this.productosFiltrados = this.productos;
    });
  }

  private obtenerCategorias() {
    this.productoServicio.obtenerCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  getCategoriaName(id: number): string {
    const categoria = this.categorias.find((c) => c.id_categorias === id);
    return categoria ? categoria.nombre_categoria : 'Desconocida';
  }

  filtrarProductos(event: any) {
    const filtro = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombres_productos.toLowerCase().includes(filtro) ||
      producto.marca.toLocaleLowerCase().includes(filtro) ||
      this.getCategoriaName(producto.id_categorias).toLowerCase().includes(filtro)
    );
  }



  guardarProductos() {
    if (!this.nuevoProducto.nombres_productos || !this.nuevoProducto.marca || !this.nuevoProducto.valor_compra || !this.nuevoProducto.valor_venta || !this.nuevoProducto.id_categorias) {
      this.toastr.warning('Por favor, complete todos los campos obligatorios', 'Advertencia');
      return;  
    }
  
    this.productoServicio.guardarProductos(this.nuevoProducto).subscribe({
      next: () => {
        this.toastr.success('Producto agregado exitosamente', 'Éxito');
        this.cargarDatos(); 
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar producto', error);
        this.toastr.error('Error al agregar producto', 'Error');
      }
    });
  }
  

  actualizarProducto() {
    this.productoServicio.actualizarProducto(this.productoEditar).subscribe({
      next: () => {
        this.toastr.success('Producto actualizado exitosamente', 'Éxito');
        this.cargarDatos(); 
        this.closeModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar el producto', error);
        this.toastr.error('Error al actualizar el producto', 'Error');
      }
    });
  }

  eliminarProductos(id: number) {
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
        this.productoServicio.eliminarProductos(id).subscribe(() => {
          this.toastr.success('Producto eliminado correctamente', 'Éxito');
          this.cargarDatos(); 
        });
      }
    });
  }


  seleccionarProductoEditar(producto: Productos) {
    this.productoEditar = { ...producto };
    this.usarUrlEditar = !!this.productoEditar.img;
    this.previewImageEditar = this.usarUrlEditar ? this.productoEditar.img : null;
    this.modalVisibleEditar = true;
  }

  closeModalEditar(): void {
    this.modalVisibleEditar = false;
  }

  openModal(): void {
    this.modalVisible = true;
  }


  limpiarFormulario() {
    this.nuevoProducto = {
      id_productos: 0,  
      nombres_productos: '',
      img: '',
      marca: '',
      valor_compra: 0,  
      valor_venta: 0,   
      id_categorias: 0  
    };
  }


  closeModal() {
    this.modalVisible = false;
    this.limpiarFormulario();  
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

      this.productoServicio.subirImagen(formData).subscribe({
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

  toggleInputEditar() {
    this.usarUrlEditar = !this.usarUrlEditar;
    if (!this.usarUrlEditar) {
      this.previewImageEditar = null;
      this.productoEditar.img = '';
    }
  }

  onFileSelectedEditar(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.productoServicio.subirImagen(formData).subscribe({
        next: (response: any) => {
          this.productoEditar.img = response.url;
          this.previewImageEditar = response.url;
          console.log('Imagen subida correctamente (editar):', response.url);
        },
        error: (error) => {
          console.error('Error al subir la imagen', error);
        }
      });
    }
  }
  generarPDF() {
    // Muestra la notificación de que la descarga está comenzando
    this.toastr.info('¡La descarga del archivo PDF está comenzando!', 'Descargando...');

    const doc = new jsPDF();

    doc.text('Lista de Productos', 14, 10);

    autoTable(doc, {
      head: [['ID', 'Nombre', 'Marca', 'Categoría', 'Stock']],
      body: this.productosFiltrados.map(producto => [
        producto.id_productos ?? '',
        producto.nombres_productos ?? '',
        producto.marca ?? '',
        this.getCategoriaName(producto.id_categorias) ?? '',
        producto.stockDisponible ?? 0
      ]),
      startY: 20
    });

    doc.save('Lista_Productos.pdf');
  }


}
