import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone:false,
})
export class MenuPage implements OnInit {

  constructor(
    private firebaseService: FirebaseService, 
    private utilsService: UtilsService, 
    private toastController: ToastController, 
    private authService: AuthService,
    private router: Router) {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  toastCtrl = inject(ToastController);
  currentPath: string = '';


  menuItems = [
    { title: 'Mapa', icon: 'home', route: '/main/mapa' },
    { title: 'Favoritos', icon: 'person-outline', route: '/main/favoritos' },
    { title: 'Ventas', icon: 'settings-outline', route: '/main/home' },
    { title: 'Compras', icon: 'person-outline', route: '/main/compras' },
    { title: 'Chat', icon: 'person-outline', route: '/main/chat' },
    { title: 'Perfil', icon: 'person-outline', route: '/main/profile' },

  ];

    menu = [
     { title: 'Perfil', icon:'[src=main/"user()?.image"', route: '/main/profile' },

  ];

  user(): User {
      return this.utilsSvc.getFromLocalStorage('user');
    }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

    ngOnInit() {
  }
}