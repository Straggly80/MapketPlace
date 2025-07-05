import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: false,
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    uid: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');
    if (this.product) this.form.patchValue(this.product);
  }

  /* ========== TOMAR/SELECCIONAR UNA FOTO ============ */
  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  /* ========= CONVIERTE VALORES DE TIPO STRING A NUMBER */
  setNumberInputs() {


    let { soldUnits, price } = this.form.controls;
    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price.value) price.setValue(parseFloat(price.value));
  }

  /* ========= CREAR UN PRODUCO ============ */
  async createProduct() {
    let path = `users/${this.user.uid}/products`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    /* =========== SUBIR LA IMAGEN Y OBTENER LA URL =========== */
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.uid;

    this.firebaseSvc.addDocument(path, this.form.value).then(async (res) => {});

    this.utilSvc.dismissModal({ success: true });

    this.utilSvc
      .presentToast({
        message: 'Producto creado exitosamente!',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })

      .catch((error) => {
        console.log(error);

        this.utilSvc.presentToast({
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

  /* ===================== ACTUALIZAR PRODUCTO =================== */
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.utilSvc.loading();
    await loading.present();

    /* =========== SI CAMBIO LA IMAGEN, SUBIR LA NUEVA Y OBTENER LA URL =========== */
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.uid;

    this.firebaseSvc
      .updateDocument(path, this.form.value)
      .then(async (res) => {});

    this.utilSvc.dismissModal({ success: true });

    this.utilSvc
      .presentToast({
        message: 'Producto actualizado exitosamente!',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })

      .catch((error) => {
        console.log(error);

        this.utilSvc.presentToast({
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
