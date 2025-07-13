import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone:false,
})
export class MenuPage implements OnInit {

  menuItems = [
    { title: 'Mapa', icon: 'home', route: '/main/mapa' },
    { title: 'Favoritos', icon: 'person-outline', route: '/main/favoritos' },
    { title: 'Ventas', icon: 'settings-outline', route: '/main/home' },
    { title: 'Compras', icon: 'person-outline', route: '/main/compras' },
    { title: 'Chat', icon: 'person-outline', route: '/main/chat' },
    { title: 'Perfil', icon: 'person-outline', route: '/main/profile' },

  ];

  constructor(private router: Router) {}


  navigateTo(route: string) {
    this.router.navigate([route]);
  }

    ngOnInit() {
  }
}