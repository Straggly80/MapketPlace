import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false,
})

export class MainPage implements OnInit {
  pages = [
    
    { title: 'Inicio', url: '/main/mapa', icon: 'map' },
    { title: 'Favoritos', url: '/main/ventas', icon: 'heart-outline' },
    { title: 'Ventas', url: '/main/home', icon: 'cart' }, /* o este: <i class="bi bi-cart3"></i>, o este: <i class="bi bi-cart2"></i> */
    { title: 'Compras', url: '/main/compras', icon: 'bag-outline' }, /* o este: bi bi-handbag */
    { title: 'Chat', url: '/main/chat', icon: 'chatbubbles-outline' },
    { title: 'Perfil', url: '/main/profile', icon:'[src="user()?.image"'},

  ];

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  currentPath: string = '';
  

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  /* ===== CERRAR SESION ===== */
  signOut() {
    this.firebaseSvc.signOut();
  }
}
