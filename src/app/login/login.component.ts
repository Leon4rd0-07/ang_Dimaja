import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../service/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(
    private usuarioService: UsuariosService, 
    private router: Router, 
    private toastr: ToastrService 
  ) {}

  onLogin(): void {
    this.error = false;

    this.usuarioService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.toastr.success(`Bienvenido, ${this.username}!`, 'Inicio de sesión exitoso');
        localStorage.setItem('usuario', JSON.stringify(response.usuario)); // Guardar usuario en localStorage
        this.router.navigate(['/inicio']); 
      },
      error: () => {
        this.error = true;
        this.toastr.error('Usuario o contraseña incorrectos', 'Error de autenticación');
      }
    });
  }
}
