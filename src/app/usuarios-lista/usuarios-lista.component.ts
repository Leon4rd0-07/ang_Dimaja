import { Component } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuarios } from '../modelo/usuarios';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-lista',
  standalone: false,
  templateUrl: './usuarios-lista.component.html',
})
export class UsuariosListaComponent {
  //1. Definir un arreglo de Objetos
  usuarios: Usuarios[] = [];
  roles: any[] = []; // Variable para almacenar los roles
  selectedRole: any; // Variable para el rol seleccionado
  nuevoUsuario: Usuarios = new Usuarios();
  usuarioEditar: Usuarios = new Usuarios();

  //2. Agregar el constructor
  constructor(private usuariosServicios: UsuariosService, private toastr: ToastrService) { }

  //3. Definir el metodo para inicializar
  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerRoles(); // Llamar a la función para obtener roles
  }

  //4. Método que obtiene la lista de usuarios
  private obtenerUsuarios() {
    this.usuariosServicios.obtenerUsuariosLista().subscribe((datos) => {
      this.usuarios = datos;
    });
  }

  //5. Método que obtiene los roles
  private obtenerRoles() {
    this.usuariosServicios.obtenerRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }
  
  // Método para agregar un nuevo usuario
  guardarUsuarios() {
    this.usuariosServicios.guardarUsuarios(this.nuevoUsuario).subscribe({
      next: (data) => {
        console.log('Usuario agregado:', data);
        this.toastr.success('Usuario agregado exitosamente', 'Éxito'); // Mostrar alerta
        this.obtenerUsuarios();
        this.nuevoUsuario = new Usuarios();
      },
      error: (err) => {
        console.error('Error al agregar usuario:', err);
        this.toastr.error('Error al agregar el usuario', 'Error'); // Mostrar error
      },
    });
  }

  eliminarUsuarios(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosServicios.eliminarUsuarios(id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(usuarios => usuarios.id_usuarios !== id);
            this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
          },
          error: (error) => {
            console.error('Error al eliminar el usuario', error);
            this.toastr.error('Error al eliminar el usuario', 'Error');
          }
        });
      }
    });
  }  

  // Método para manejar la selección de rol
  onRoleChange() {
    console.log('Rol seleccionado:', this.selectedRole);  // Verificar que el rol seleccionado es correcto
  }

  // Método para obtener el nombre del rol
  getRoleName(id: number): string {
    const role = this.roles.find(role => role.id_rol === id); // Buscar el rol por id_rol
    return role ? role.nombre_rol : 'Desconocido'; // Si no lo encuentra, devuelve 'Desconocido'
  }

  // Método para seleccionar el usuario a editar
  seleccionarUsuarioEditar(usuario: Usuarios) {
    this.usuarioEditar = { ...usuario }; 
  }

  // Método para actualizar el usuario
  actualizarUsuario() {
    this.usuariosServicios.actualizarUsuario(this.usuarioEditar).subscribe({
      next: () => {
        this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
        this.toastr.error('Error al actualizar el usuario', 'Error');
      }
    });
  }
}
