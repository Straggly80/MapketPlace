import { Component, Input, OnInit, AfterViewInit, NgZone, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

declare const google: any;

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: false
})
export class AddUpdateProductComponent implements OnInit, AfterViewInit {
  constructor(private firebaseService: FirebaseService) {}

  products: Product[] = [];
  loading: boolean = false;

  @Input() product: Product;
  @Input() lat: number;
  @Input() lng: number;

  form = new FormGroup({
    uid: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
    descripcion: new FormControl('', [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    lng: new FormControl(null, [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  ngZone = inject(NgZone);

  user = {} as User;

  miDireccion: string = '';
  direccion: string = '';

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  geocoder!: google.maps.Geocoder;
  currentAddress: string = '';

  ngOnInit() {
    this.user = this.utilSvc.getFromLocalStorage('user');

    if (this.product) {
      this.form.patchValue(this.product);
    } else if (this.lat && this.lng) {
      this.form.controls.lat.setValue(this.lat);
      this.form.controls.lng.setValue(this.lng);
    }
  }

  ngAfterViewInit() {
    this.loadGoogleMaps().then(() => this.initMiniMap());
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if ((window as any).google && (window as any).google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          () => {
            resolve({ lat: 31.327409, lng: -113.522065 }); // fallback
          }
        );
      } else {
        resolve({ lat: 31.327409, lng: -113.522065 });
      }
    });
  }

  async initMiniMap() {
    this.geocoder = new google.maps.Geocoder();

    let coords = { lat: this.form.value.lat, lng: this.form.value.lng };
    if (!coords.lat || !coords.lng) {
      coords = await this.getCurrentLocation();
      this.form.controls.lat.setValue(coords.lat);
      this.form.controls.lng.setValue(coords.lng);
    }

    this.map = new google.maps.Map(document.getElementById('mini-map') as HTMLElement, {
      center: coords,
      zoom: 12,
      disableDefaultUI: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        {
          "featureType": "all",
          "elementType": "labels.text",
          "stylers": [{ "color": "#878787" }]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{ "color": "#f9f5ed" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{ "color": "#f5f5f5" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#c9c9c9" }]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{ "color": "#aee0f4" }]
        }
      ]
    });

    this.marker = new google.maps.Marker({
      position: coords,
      map: this.map,
      draggable: true,
      title: 'Selecciona ubicación',
      animation: google.maps.Animation.DROP,
    });

    this.geocodeLatLng(coords.lat, coords.lng);

    this.marker.addListener('dragend', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.ngZone.run(() => {
        this.updateCoordinates(lat, lng);
        this.geocodeLatLng(lat, lng);
      });
    });

    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker.setPosition(event.latLng);
      this.ngZone.run(() => {
        this.updateCoordinates(lat, lng);
        this.geocodeLatLng(lat, lng);
      });
    });
  }

  updateCoordinates(lat: number, lng: number) {
    this.form.patchValue({ lat, lng });
  }

  getStreetName(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const streetName = results[0].formatted_address;
        console.log('Calle:', streetName);
      } else {
        console.error('No se pudo obtener la dirección:', status);
      }
    });
  }

  geocodeLatLng(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.direccion = results[0].formatted_address;
      } else {
        this.direccion = 'No se encontró dirección';
      }
    });
  }


  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }

  // Crear producto en ambas colecciones con el mismo ID
  async createProduct() {
    const userPath = `users/${this.user.uid}/products`;
    const generalPath = `/productGeneral`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      const dataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.uid;

      // Genera un ID único
      const newId = uuidv4();
      const productData = { ...this.form.value, id: newId };

      await Promise.all([
        this.firebaseSvc.setDocument(`${userPath}/${newId}`, productData),
        this.firebaseSvc.setDocument(`${generalPath}/${newId}`, productData)
      ]);

      this.utilSvc.dismissModal({ success: true });
      this.utilSvc.presentToast({
        message: 'Producto creado exitosamente!',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  // Actualizar producto en ambas colecciones (mismo ID)
  async updateProduct() {
    const userPath = `users/${this.user.uid}/products/${this.product.id}`;
    const generalPath = `/productGeneral/${this.product.id}`;
    const loading = await this.utilSvc.loading();
    await loading.present();

    try {
      if (this.form.value.image !== this.product.image) {
        const dataUrl = this.form.value.image;
        const imagePath = await this.firebaseSvc.getFilePath(this.product.image);
        const imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }

      delete this.form.value.uid;

      await Promise.all([
        this.firebaseSvc.updateDocument(userPath, this.form.value),
        this.firebaseSvc.updateDocument(generalPath, this.form.value)
      ]);

      this.utilSvc.dismissModal({ success: true });
      this.utilSvc.presentToast({
        message: 'Producto actualizado exitosamente!',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  

  usarMiUbicacion() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const geocoder = new google.maps.Geocoder();
        const latlng = { lat, lng };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            this.miDireccion = results[0].formatted_address;
          } else {
            this.miDireccion = 'No se pudo obtener la dirección.';
            console.error('Geocoder error:', status);
          }
        });
      },
      (error) => {
        this.miDireccion = 'Error al obtener la ubicación.';
        console.error('Geolocation error:', error);
      }
    );
  }



}