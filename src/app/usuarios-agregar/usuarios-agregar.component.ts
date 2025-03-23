import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuarios } from '../modelo/usuarios';
import { ToastrService } from 'ngx-toastr';
import { RolService } from '../service/rol.service';  // Importa el servicio de roles
import { SituacionService } from '../service/situacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-agregar',
  standalone: false,
  templateUrl: './usuarios-agregar.component.html',
  styleUrls: ['./usuarios-agregar.component.css']
})
export class UsuariosAgregarComponent implements OnInit {
  nuevoUsuario: Usuarios = new Usuarios();
  roles: any[] = [];
  situaciones: any[] = [];
  passwordFieldType: string = 'password';
  mostrarModalRol: boolean = false; // Variable para mostrar u ocultar el modal
  mostrarModalSituacion: boolean = false;
  nuevoRol: any = { nombre_rol: '' }; // Objeto para almacenar el nuevo rol
  nuevaSituacion: any = { nombre_situacion:''};

  constructor(
    private usuariosServicios: UsuariosService,
    private toastr: ToastrService,
    private rolService: RolService,  // Inyectar el servicio de roles
    private situacionService : SituacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerRoles();
    this.obtenerSituacion();
  }

  validarDni(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');  // Elimina cualquier carácter que no sea un número
  }

  // Método para obtener los roles existentes
  private obtenerRoles() {
    this.usuariosServicios.obtenerRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  // Método para agregar un nuevo rol
  guardarRol() {
    if (!this.nuevoRol.nombre_rol.trim()) {
      this.toastr.warning('Ingrese un nombre para el rol', 'Advertencia');
      return;
    }

    this.rolService.agregarRol(this.nuevoRol).subscribe({
      next: (rolGuardado) => {
        this.roles.push(rolGuardado);  // Agregar el nuevo rol a la lista
        this.nuevoUsuario.id_rol = rolGuardado.id_rol;  // Asignar el nuevo rol al usuario
        this.toastr.success('Rol agregado exitosamente', '¡Éxito!');
        this.cerrarModalRol();  // Cerrar el modal
      },
      error: (error) => {
        console.error('Error al agregar rol', error);
        this.toastr.error('No se pudo agregar el rol', 'Error');
      }
    });
  }

  private obtenerSituacion() {
    this.usuariosServicios.obtenerSituacion().subscribe((situaciones) => {
      this.situaciones = situaciones;
    });
  }

  guardarSituacion() {
    if (!this.nuevaSituacion.nombre_situacion.trim()) {
      this.toastr.warning('Ingrese un nombre para la situacion', 'Advertencia');
      return;
    }

    this.situacionService.agregarSituacion(this.nuevaSituacion).subscribe({
      next: (situacionGuardada) => {
        this.situaciones.push(situacionGuardada);  // Agregar el nuevo rol a la lista
        this.nuevoUsuario.id_situacion = situacionGuardada.id_situacion;  // Asignar el nuevo rol al usuario
        this.toastr.success('Situacion agregado exitosamente', '¡Éxito!');
        this.cerrarModalSituacion();  // Cerrar el modal
      },
      error: (error) => {
        console.error('Error al agregar situacion', error);
        this.toastr.error('No se pudo agregar la situacion', 'Error');
      }
    });
  }

  abrirModalSituacion() {
    this.mostrarModalSituacion = true;
  }

  cerrarModalSituacion() {
    this.mostrarModalSituacion = false;
    this.nuevaSituacion = { nombre_situacion: '' }; 
  }

  

  // Abrir el modal para agregar un nuevo rol
  abrirModalRol() {
    this.mostrarModalRol = true;
  }

  // Cerrar el modal
  cerrarModalRol() {
    this.mostrarModalRol = false;
    this.nuevoRol = { nombre_rol: '' }; // Reiniciar el campo del modal
  }

  // Método para guardar el nuevo usuario
  guardarUsuarios() {
    this.usuariosServicios.guardarUsuarios(this.nuevoUsuario).subscribe({
      next: () => {
        this.toastr.success('Usuario agregado exitosamente', '¡Éxito!');
        this.cancelar();
        
        this.router.navigate(['/lista-usuarios']); 
      },
      error: (error) => {
        console.error('Error al agregar usuario', error);
        this.toastr.error('No se pudo agregar el usuario', '¡Error!');
      }
    });
  }

  // Método para cancelar el formulario y resetearlo
  cancelar() {
    this.nuevoUsuario = new Usuarios();
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
