import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { v4 as uuidv4 } from 'uuid';
import { AlertController, ModalController } from '@ionic/angular';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { orderBy } from 'firebase/firestore';
import { Geolocation } from '@capacitor/geolocation';

declare const google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements OnInit {
  products: Product[] = [];
  loading: boolean = false;

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);

  currentPath: string = '';
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  activeInfoWindow: google.maps.InfoWindow | null = null;

  async ngOnInit() {
    await this.solicitarPermisosUbicacion();
    const ubicacion = await this.getCurrentLocation();
    console.log('📍 Ubicación actual:', ubicacion);

    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });

    this.getProducts();
    this.getDocumentos();
  }

  async solicitarPermisosUbicacion() {
    try {
      const permiso = await Geolocation.requestPermissions();
      if (permiso.location === 'granted') {
        console.log('✅ Permiso de ubicación concedido');
      } else {
        console.warn('❌ Permiso de ubicación denegado');
      }
    } catch (error) {
      console.error('⚠️ Error al solicitar permiso', error);
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      this.getDocumentos();
      event.target.complete();
    }, 1000);
  }

  ngAfterViewInit() {
    this.loadGoogleMaps().then(() => this.initMap());
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  product(): Product {
    return this.utilsSvc.getFromLocalStorage('productGeneral');
  }

  ionViewWillEnter() {
    this.loading = true;
    let userProducts: Product[] = [];
    let generalProducts: Product[] = [];

    const done = () => {
      this.products = [...userProducts, ...generalProducts];
      this.loading = false;

      if (this.map) {
        this.mostrarMarcadores();
      } else {
        this.loadGoogleMaps().then(() => {
          this.initMap().then(() => {
            this.mostrarMarcadores();
          });
        });
      }
    };

    this.firebaseSvc
      .getCollectionData(`users/${this.user().uid}/products`, [
        orderBy('soldUnits', 'desc'),
      ])
      .subscribe({
        next: (res: Product[]) => {
          userProducts = res;
          if (generalProducts.length !== 0) done();
        },
        error: () => {
          this.loading = false;
        },
      });

    this.firebaseSvc
      .getCollectionData('productGeneral/', [orderBy('soldUnits', 'desc')])
      .subscribe({
        next: (res: Product[]) => {
          generalProducts = res;
          if (userProducts.length !== 0) done();
        },
        error: () => {
          this.loading = false;
        },
      });
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

  getProducts() {
    const path = `users/${this.user().uid}/products`;
    this.loading = true;
    const query = [orderBy('soldUnits', 'desc')];

    const sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: Product[]) => {
        console.log('📦 Productos obtenidos:', res);
        this.products = res;
        this.loading = false;
        this.mostrarMarcadores();
      },
      error: (err: any) => {
        console.error('❌ Error al obtener productos:', err);
        this.loading = false;
      },
      complete: () => {
        console.log('✅ Consulta de productos completada');
        sub.unsubscribe();
      },
    });
  }

  getDocumentos() {
    const path = `productGeneral/`;

    this.loading = true;
    const query = [orderBy('soldUnits', 'desc')];

    const sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: Product[]) => {
        console.log('📦 Productos obtenidos:', res);
        this.products = res;
        this.loading = false;
        this.mostrarMarcadores();
      },
      error: (err: any) => {
        console.error('❌ Error al obtener productos:', err);
        this.loading = false;
      },
      complete: () => {
        console.log('✅ Consulta de productos completada');
        sub.unsubscribe();
      },
    });
  }

  mostrarMarcadores() {
    this.clearMarkers();

    this.products.forEach((product) => {
      if (product.lat && product.lng) {
        const marker = new google.maps.Marker({
          position: { lat: product.lat, lng: product.lng },
          map: this.map,
          title: product.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="width: 220px; font-family: Arial, sans-serif;">
              <img src="${product.image}" style="width: 100%; border-radius: 8px 8px 0 0; display: block;" />
              <div style="padding: 8px;">
                Nombre:<strong>${product.name}</strong><br>
                Descripcion:<strong>${product.descripcion}</strong><br>
                Precio:<strong> $${product.price}</strong><br>
                Usuario:<strong> ${product.lat}</strong>
              </div>
            </div>
          `,
        });

        marker.addListener('click', () => {
          if (this.activeInfoWindow) {
            this.activeInfoWindow.close();
          }
          infoWindow.open(this.map, marker);
          this.activeInfoWindow = infoWindow;
        });

        this.markers.push(marker);
      }
    });

    this.map.addListener('click', () => {
      if (this.activeInfoWindow) {
        this.activeInfoWindow.close();
        this.activeInfoWindow = null;
      }
    });
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return {
        lat: 31.327409,
        lng: -113.522065,
      };
    }
  }

  async initMap() {
    const userLocation = await this.getCurrentLocation();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: false,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text',
          stylers: [{ color: '#878787' }],
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ color: '#f9f5ed' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [{ color: '#f5f5f5' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#c9c9c9' }],
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#aee0f4' }],
        },
      ],
    });

    new google.maps.Marker({
      position: userLocation,
      map: this.map,
      title: 'Tu ubicación',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      },
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  async abrirFormulario() {
    const coords = this.map.getCenter().toJSON();

    const modal = await this.modalCtrl.create({
      component: AddUpdateProductComponent,
      componentProps: {
        lat: coords.lat,
        lng: coords.lng,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.getProducts();
      this.getDocumentos();
    }
  }

  agregarProductoDesdeFormulario(data: any) {
    const userLatLng = this.map.getCenter().toJSON();

    const nuevo: Product = {
      id: new Date().getTime().toString(),
      name: data.name,
      descripcion: data.descripcion,
      price: parseFloat(data.price),
      image: '',
      soldUnits: 0,
      lat: userLatLng.lat,
      lng: userLatLng.lng,
    };
  }
}
