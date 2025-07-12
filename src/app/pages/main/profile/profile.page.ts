import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  ngOnInit() {}

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  /* ========== TOMAR/SELECCIONAR UNA FOTO ============ */
  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    let loading: HTMLIonLoadingElement | undefined;

    try {
      const dataUrl = (await this.utilSvc.takePicture('Imagen del Perfil'))
        .dataUrl;

      loading = await this.utilSvc.loading();
      await loading.present();

      let imagePath = `${user.uid}/profile`;

      user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      await this.firebaseSvc.updateDocument(path, { image: user.image });

      this.utilSvc.saveInLocalStorage('user', user);

      await this.utilSvc.presentToast({
        message: 'Imagen actualizada exitosamente!',
        duration: 1500,
        color: 'light',
        icon: 'checkmark-circle-outline',
      });
    } catch (error: any) {
      console.error(error);
      await this.utilSvc.presentToast({
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
  }
}
