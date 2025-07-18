import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ProfilePage } from './profile/profile.page';
import { ViewChild } from '@angular/core';
import { IonNavLink } from '@ionic/angular/standalone';
import { IonButton, ToastController } from '@ionic/angular/standalone';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonNav,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { RouterModule } from '@angular/router';
import { Product } from 'src/app/models/product.model';





@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false,
})

export class MainPage implements OnInit {
  constructor(private firebaseService: FirebaseService, private utilsService: UtilsService, private toastController: ToastController, private authService: AuthService) {}
  @ViewChild('nav') private nav!: IonNav;

  products: Product[] = [];
  loading: boolean = false;

  onWillPresent() {
    this.nav.setRoot(ProfilePage);
  }

   onWillPresent2() {
    this.nav.setRoot(ProfilePage);
  }
  pages = [

    /* { title: 'Inicio', url: '/main/menu', icon: 'planet-outline' }, */
    { title: 'Mapa', url: '/main/mapa', icon: 'map' },
    { title: 'Favoritos', url: '/main/favoritos', icon: 'heart-outline' },
    { title: 'Ventas', url: '/main/home', icon: 'bag-outline' }, /* o este: <i class="bi bi-cart3"></i>, o este: <i class="bi bi-cart2"></i> */
    { title: 'Compras', url: '/main/compras', icon: 'cart-outline' }, /* o este: bi bi-handbag */
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

  /* ===== CERRAR SESION ===== */
  signOut() {
    this.firebaseSvc.signOut();
  }

  /* que se cierre el modal al hacer click en el boton de cerrar sesion y redirigir a la pagina de inicio de sesion */
  logout() {
    this.signOut();
    this.closeModal();
  }

  closeModal() {
    const modal = document.querySelector('ion-modal');
    if (modal) {
      modal.dismiss();
    }
  }
/* que elimine la cuenta en la que se esta inciada sesion,
que se elimine el usuario y todos sus datos */



/* AUN NO BORRA NO ESTA TERMINADO */
    user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

   EliminarUsuario() {
    this.deleteUsuario;
  }

 async deleteUsuario(user: User) {
    let path = `users/${this.user().uid}`;
    let paths = `productGeneral/${user.uid}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(user.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async (res) => {
    });
    this.firebaseSvc.deleteDocument(paths).then(async (res) => {
    });

    this.products = this.products.filter((p) => p.id !== user.uid);

    this.utilsSvc
      .presentToast({
        message: 'Perfil eliminado exitosamente!',
        duration: 1500,
        color: 'warning',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })

      .catch((error) => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }



}
