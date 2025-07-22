import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastController } from '@ionic/angular/standalone';
import { User } from 'src/app/models/user.model';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private firebaseService: FirebaseService, 
    private utilsService: UtilsService, private toastController: ToastController) { }

  ngOnInit() {
  }

  user(): User {
      return this.utilsSvc.getFromLocalStorage('user');
    }

  ActualizarNombre(){
    
  }

  async takeImage() {
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
  }
}
