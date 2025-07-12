import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false,
})
export class AuthPage {
   constructor(private router: Router, private authService: AuthService) {}
   user: Observable<firebase.User | null>;


    ngOnInit() {
    this.user = this.authService.getAuthState();
  }

  loginFacebook() {
    this.authService.loginWithFacebook().subscribe({
      next: (user) => {
        // Manejar el usuario autenticado
        console.log('Usuario autenticado:', user);
      },
      error: (error) => {
        // Manejar errores
        console.error('Error al iniciar sesión con Facebook:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }





  goLogin() {
    this.router.navigate(['/sign-up']);
  }

  goRegister() {
    this.router.navigate(['/sign-up']);
  }

    forgotpassword() {
    this.router.navigate(['forgot-password']);
  }


  // 🔵 Funciones para los íconos de redes sociales:
  loginWithFacebook() {
    console.log('Iniciar sesión con Facebook (pendiente)');
  }

  loginWithGoogle() {
    console.log('Iniciar sesión con Google (pendiente)');
  }

  loginWithApple() {
    console.log('Iniciar sesión con Apple (pendiente)');
  }

  loginWithGithub() {
    console.log('Iniciar sesión con GitHub (pendiente)');
  }
}
