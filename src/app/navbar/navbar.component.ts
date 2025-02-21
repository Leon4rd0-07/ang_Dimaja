import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Importa Router correctamente desde @angular/router

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // ✅ Corrige "styleUrl" a "styleUrls"
})
export class NavbarComponent {
  submenuProductos: boolean = false;
  submenuUsuarios: boolean = false; 
  
  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef) { }

  toggleSubmenu(event: Event, menu: string): void {
    event.preventDefault();
    if (menu === 'productos') {
      this.submenuProductos = !this.submenuProductos;
      this.submenuUsuarios = false; 
    } else if (menu === 'usuarios') {
      this.submenuUsuarios = !this.submenuUsuarios;
      this.submenuProductos = false; 
    }
  }

  @HostListener('document:click', ['$event'])
  closeSubmenu(event: Event): void {
    const submenuProductos = this.eRef.nativeElement.querySelector('.submenu-productos');
    const toggleProductos = this.eRef.nativeElement.querySelector('.submenu-toggle-productos');

    const submenuUsuarios = this.eRef.nativeElement.querySelector('.submenu-usuarios');
    const toggleUsuarios = this.eRef.nativeElement.querySelector('.submenu-toggle-usuarios');

    if (
      submenuProductos &&
      toggleProductos &&
      !submenuProductos.contains(event.target as Node) &&
      !toggleProductos.contains(event.target as Node)
    ) {
      this.submenuProductos = false;
    }

    if (
      submenuUsuarios &&
      toggleUsuarios &&
      !submenuUsuarios.contains(event.target as Node) &&
      !toggleUsuarios.contains(event.target as Node)
    ) {
      this.submenuUsuarios = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // ✅ Corrige el error de Router
  }
}
