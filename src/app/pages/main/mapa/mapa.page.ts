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

import { MenuController } from '@ionic/angular';

declare const google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements OnInit {

  openModal(){
       const modal = document.querySelector('ion-modal');
        if (modal) {
          modal.present();
        }
  }

  isModalOpen: boolean = false;
  isCarreteOpen: boolean = false;

  products: Product[] = [];
  loading: boolean = false;

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);
  menuCtrl = inject(MenuController);

  currentPath: string = '';
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  activeInfoWindow: google.maps.InfoWindow | null = null;

  // Nuevo: objeto para guardar InfoWindows por producto
  markerInfoWindows: { [productId: string]: google.maps.InfoWindow } = {};

  async ngOnInit() {
    await this.solicitarPermisosUbicacion();
    const ubicacion = await this.getCurrentLocation();
    console.log('📍 Ubicación actual:', ubicacion);

    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });

    this.getAllProducts();
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
      this.getAllProducts();
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
    this.menuCtrl.swipeGesture(false); 
    this.getAllProducts();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeGesture(true);
  }

  getAllProducts() {
    this.loading = true;
    let userProducts: Product[] = [];
    let generalProducts: Product[] = [];
    let userLoaded = false;
    let generalLoaded = false;

    const done = () => {
      const all = [...userProducts, ...generalProducts];
      const unique = all.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
      this.products = unique;
      this.loading = false;
      this.mostrarMarcadores();
    };

    this.firebaseSvc
      .getCollectionData(`users/${this.user().uid}/products`, [orderBy('soldUnits', 'desc')])
      .subscribe({
        next: (res: Product[]) => {
          userProducts = res;
          userLoaded = true;
          if (generalLoaded) done();
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
          generalLoaded = true;
          if (userLoaded) done();
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

  mostrarMarcadores() {
    this.clearMarkers();
    this.markerInfoWindows = {}; // Limpia los infoWindows guardados

    this.products.forEach((product) => {
      if (product.lat && product.lng) {
        const marker = new google.maps.Marker({
          position: { lat: product.lat, lng: product.lng },
          map: this.map,
          title: product.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="width: 210px; font-family:'poppins', sans-serif;">
              <img src="${product.image}" style="width: 100%; border-radius: 8px 8px 0 0; display: block;" />
              <div style="padding: 8px; width: 100%; white-space: normal; overflow: visible; text-overflow: unset;">
                <strong>Usuario: </strong><br>
                <strong>Nombre: </strong>${product.name}<br>
                <strong>Descripcion: </strong>${product.descripcion}<br>
                <strong>Precio: </strong><strong style="color: #228b22;">$${product.price}</strong><br>
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
        this.markerInfoWindows[product.id] = infoWindow;
      }
    });

    this.map.addListener('click', () => {
      if (this.activeInfoWindow) {
        this.activeInfoWindow.close();
        this.activeInfoWindow = null;
      }
    });
  }

  // Nuevo método para abrir InfoWindow al hacer click en la imagen del modal
  abrirInfoWindow(product: Product) {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index === -1) return;

    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
    }

    const marker = this.markers[index];
    const infoWindow = this.markerInfoWindows[product.id];

    if (marker && infoWindow) {
      infoWindow.open(this.map, marker);
      this.activeInfoWindow = infoWindow;

      // Centra el mapa en el marcador
      this.map.panTo(marker.getPosition() as google.maps.LatLng);
    }
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
      this.getAllProducts();
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
