import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validUser = 'admin';
  private validPassword = '123';

  login(username: string, password: string): boolean {
    if (username === this.validUser && password === this.validPassword) {
      localStorage.setItem('user', username); // Guardar usuario en localStorage
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('user'); // Eliminar usuario en logout
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
