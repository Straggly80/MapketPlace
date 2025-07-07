import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false,
})
export class AuthPage {
   constructor(private router: Router) {}

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
