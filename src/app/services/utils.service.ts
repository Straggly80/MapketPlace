import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una foto',
      promptLabelPicture: 'Toma una foto',
      promptLabelCancel: 'Cancelar',
    });
  }

  /* ============ ALERT ============ */
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  /* ============ loading ============ */
  loading() {
    return this.loadingCtrl.create({ spinner: 'dots' });
  }

  /* ============ toast ============ */
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  /* ============ enruta a cualquier ruta disponible ============ */
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  /* =========== guardar un elemento en localStorage ============ */
  saveInLocalStorage(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage`, error);
    }
  }

  /* =========== obtiene un elemento de localStorage ============ */
  getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);

    if (data === null || data === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al obtener ${key} de localStorage`, error);
      return null;
    }
  }

  /* =========== MODAL ============ */
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
