import { Component } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuarios } from '../modelo/usuarios';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any; 

@Component({
  selector: 'app-usuarios-lista',
  standalone: false,
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css']
})
export class UsuariosListaComponent {
  modalVisible: boolean = false;
  modalVisibleEditar: boolean = false;
  usuarios: Usuarios[] = [];
  usuariosFiltrados: Usuarios[] = []; 
  roles: any[] = [];
  situacion: any[] = [];
  selectedRole: any;
  nuevoUsuario: Usuarios = new Usuarios();
  usuarioEditar: Usuarios = new Usuarios();
  passwordFieldType: string = 'password';

  constructor(private usuariosServicios: UsuariosService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerRoles();
    this.obtenerSituacion();
  }

  validarDni(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  private obtenerUsuarios() {
    this.usuariosServicios.obtenerUsuariosLista().subscribe((datos) => {
      this.usuarios = datos;
      this.usuariosFiltrados = datos;
    });
  }

  private obtenerRoles() {
    this.usuariosServicios.obtenerRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  private obtenerSituacion(){
    this.usuariosServicios.obtenerSituacion().subscribe((situacion) =>{
      this.situacion = situacion;
    });
  }

  filtrarUsuarios(event: any) {
    const filtro = event.target.value.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.nombres.toLowerCase().includes(filtro) ||
      usuario.apellidos.toLowerCase().includes(filtro) ||
      usuario.correo.toLowerCase().includes(filtro) ||
      usuario.usuario.toLowerCase().includes(filtro) ||
      usuario.dni.toString().includes(filtro) ||
      this.getRoleName(usuario.id_rol).toLowerCase().includes(filtro) ||
      this.getSituacionName(usuario.id_situacion).toLowerCase().includes(filtro) 
    );
  }
  
  guardarUsuarios() {
    this.usuariosServicios.guardarUsuarios(this.nuevoUsuario).subscribe({
      next: () => {
        this.toastr.success('Usuario agregado exitosamente', 'Éxito');
        this.obtenerUsuarios();
        this.nuevoUsuario = new Usuarios();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar usuario', error);
        this.toastr.error('Error al agregar usuario', 'Error');
      }
    });
  }
  
  actualizarUsuario() {
    this.usuariosServicios.actualizarUsuario(this.usuarioEditar).subscribe({
      next: () => {
        this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
        this.obtenerUsuarios();
        this.closeModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
        this.toastr.error('Error al actualizar el usuario', 'Error');
      }
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
        this.usuariosServicios.eliminarUsuarios(id).subscribe(() => {
          this.toastr.success('Usuario eliminado correctamente', 'Éxito');
          this.obtenerUsuarios();
        });
      }
    });
  }

  seleccionarUsuarioEditar(usuario: Usuarios) {
    this.usuarioEditar = { ...usuario };
    this.modalVisibleEditar = true;
  }

  closeModalEditar(): void {
    this.modalVisibleEditar = false;
  }

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find((r) => r.id_rol === roleId);
    return role ? role.nombre_rol : 'Desconocido';
  }

  getSituacionName(situacionId: number): string{
    const situacion = this.situacion.find((s) => s.id_situacion === situacionId);
    return situacion ? situacion.nombre_situacion : 'Desconocido';
  }
}