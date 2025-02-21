import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // ✅ Importamos ngx-toastr
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    private authService: AuthService, 
    private router: Router, 
    private toastr: ToastrService // ✅ Inyectamos ngx-toastr
  ) {}

  onLogin(): void {
    this.error = false;

    if (this.authService.login(this.username, this.password)) {
      this.toastr.success(`Bienvenido, ${this.username}!`, 'Inicio de sesión exitoso');
      this.router.navigate(['/inicio']); 
    } else {
      this.error = true;
      this.toastr.error('Usuario o contraseña incorrectos', 'Error de autenticación');
    }
  }
}
