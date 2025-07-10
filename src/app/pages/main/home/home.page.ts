import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy, where } from 'firebase/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  constructor(private firebaseService: FirebaseService) {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  /* =========== CALCULAR PROFIT =========== */
  getProfits() {
    return this.products.reduce((index, product) => index + product.price * product.soldUnits, 0);
  }


  /* ======================= OBTENER PRODUCTOS ======================== */
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

  /* ==================== AGREGAR O ACTUALIZAR PRODUCTO ==================== */

  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });

    if (success) this.getProducts();
  }

  /* ====================AGREGAR PRODUCTO GENERAL=============================== */
 /*  async createProductS() {
    const path = `/productGeneral`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    const dataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.uid;

    this.firebaseSvc.addDocument(path, this.form.value)
      .then(() => {
        this.utilSvc.dismissModal({ success: true });
        this.utilSvc.presentToast({
          message: 'Producto creado exitosamente!',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch(error => {
        console.error(error);
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => loading.dismiss());
  } */

  /* =================== CONFIRMAR ELIMINACION DEL PRODUCTO ==================== */

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  /* ===================== ELIMINAR PRODUCTO =================== */
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async (res) => {});

    this.products = this.products.filter((p) => p.id !== product.id);

    this.utilsSvc
      .presentToast({
        message: 'Producto eliminado exitosamente!',
        duration: 1500,
        color: 'success',
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
