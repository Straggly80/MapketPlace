import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IonButton, ToastController } from '@ionic/angular/standalone';
import {IonButtons,IonContent,IonHeader,IonModal,IonNav,IonTitle,IonToolbar,} from '@ionic/angular/standalone';
import { ViewChild } from '@angular/core';
import { IonNavLink } from '@ionic/angular/standalone';
import { SettingsPage } from './settings/settings.page';
import { MainPage } from '../main.page';
import { orderBy } from 'firebase/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  constructor(private firebaseService: FirebaseService, 
    private utilsService: UtilsService, private toastController: ToastController, private router: Router) {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  toastCtrl = inject(ToastController);

  products: Product[] = [];
  loading: boolean = false;

openModal(){
       const modal = document.querySelector('ion-modal');
        if (modal) {
          modal.present();
        }
}

openModalnotificaciones() {
  const modal = document.querySelector('ion-modal');
  if (modal) {
    modal.present();
  }
}

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.getProducts();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  /* =======================OBTENER PRODUCTOS DEL USUARIO=============================================== */

getProducts() {
    let path = `users/${this.user().uid}/products`;

    this.loading = true;

    let query = [orderBy('soldUnits', 'desc')];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        console.log('complete');
        sub.unsubscribe();
      },
    });
  }
  /* =======================OBTENER PRODUCTOS GENERAL=============================================== */
   getDocumentos() {
    let path = `productGeneral`;

    this.loading = true;

    let query = [orderBy('soldUnits', 'desc')];

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        console.log('complete');
        sub.unsubscribe();
      },
    });
  } 

   ionViewWillEnter() {
    this.getProducts();
  }


/* 
  @ViewChild(IonNav, { static: true }) nav!: IonNav;
  @ViewChild(IonModal, { static: true }) modal!: IonModal; */


/* ==================================================================== */

   async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Hello World!',
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  /* ========== TOMAR/SELECCIONAR UNA FOTO ============ */
/*   async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    let loading: HTMLIonLoadingElement | undefined;

    try {
      const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil'))
        .dataUrl;

      loading = await this.utilsSvc.loading();
      await loading.present();

      let imagePath = `${user.uid}/profile`;

      user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      await this.firebaseSvc.updateDocument(path, { image: user.image });

      this.utilsSvc.saveInLocalStorage('user', user);

      await this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente!',
        duration: 1500,
        color: 'light',
        icon: 'checkmark-circle-outline',
      });
    } catch (error: any) {
      console.error(error);
      await this.utilsSvc.presentToast({
        message: error.message || 'Error al actualizar la imagen.',
        duration: 2500,
        color: 'danger',
        icon: 'alert-circle-outline',
      });
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  } */

/*     GoSettings() {
    this.router.navigate(['main/profile/settings']);
  } */

}
