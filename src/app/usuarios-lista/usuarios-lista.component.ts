import { Component } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuarios } from '../modelo/usuarios';

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

  //2. Agregar el constructor
  constructor(private usuariosServicios: UsuariosService) {}

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

  // Método para manejar la selección de rol
  onRoleChange() {
    console.log('Rol seleccionado:', this.selectedRole);  // Verificar que el rol seleccionado es correcto
  }

  // Método para obtener el nombre del rol
  getRoleName(id: number): string {
  const role = this.roles.find(role => role.id_rol === id); // Buscar el rol por id_rol
  return role ? role.nombre_rol : 'Desconocido'; // Si no lo encuentra, devuelve 'Desconocido'
}  
}
