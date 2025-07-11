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

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });

    this.getProducts();
    this.getDocumentos();
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

      // 👇 Si el mapa ya está cargado, muestra los marcadores
      if (this.map) {
        this.mostrarMarcadores();
      }
    };

    this.firebaseSvc.getCollectionData(`users/${this.user().uid}/products`, [orderBy('soldUnits', 'desc')]).subscribe({
      next: (res: Product[]) => {
        userProducts = res;
        if (generalProducts.length !== 0) done();
      },
      error: () => { this.loading = false; }
    });

    this.firebaseSvc.getCollectionData('productGeneral/', [orderBy('soldUnits', 'desc')]).subscribe({
      next: (res: Product[]) => {
        generalProducts = res;
        if (userProducts.length !== 0) done();
      },
      error: () => { this.loading = false; }
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

  /* ======================= OBTENER PRODUCTOS ======================== */
   getProducts() {
    const path = `users/${this.user().uid}/products`;
    this.loading = true;
    const query = [orderBy('soldUnits', 'desc')];

    const sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: Product[]) => {
        console.log('📦 Productos obtenidos:', res);
        this.products = res;
        this.loading = false;
        this.mostrarMarcadores(); // 👈 AQUI
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

  /* =================OBTENER PRODUCTO GENERAL================================ */


    getDocumentos() {
    const path = `productGeneral/`;

    this.loading = true;
    const query = [orderBy('soldUnits', 'desc')];

    const sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: Product[]) => {
        console.log('📦 Productos obtenidos:', res);
        this.products = res;
        this.loading = false;
        this.mostrarMarcadores(); // 👈 AQUI
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

  /* ======================================================================== */
  mostrarMarcadores() {
  this.clearMarkers(); // Limpia anteriores

  this.products.forEach(product => {
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
              <strong>${product.name}</strong><br>
              ${product.descripcion}<br>
              Precio:<strong> $${product.price}</strong>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        // Cierra el InfoWindow anterior si está abierto
        if (this.activeInfoWindow) {
          this.activeInfoWindow.close();
        }

        infoWindow.open(this.map, marker);
        this.activeInfoWindow = infoWindow;
      });

      this.markers.push(marker);
    }
  });

  // Cierra el InfoWindow si el usuario da clic fuera (en el mapa)
  this.map.addListener('click', () => {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
      this.activeInfoWindow = null;
    }
  });
}






  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation failed:', error.message);
            resolve({ lat: 31.327409, lng: -113.522065 }); // fallback CDMX
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve({ lat: 31.327409, lng: -113.522065 });
      }
    });
  }

  async initMap() {
    const userLocation = await this.getCurrentLocation();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#5f5f5f' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ color: '#c0c0c0' }],
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#888888' }],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f2f2f2' }],
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'on' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#d0d0d0' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#b0b0b0' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#606060' }],
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#cbe7f0' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#7f9fae' }],
        }
      ]
    });

  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  async abrirFormulario() {
    const coords = this.map.getCenter().toJSON();

    const modal = await this.modalCtrl.create({
      component: AddUpdateProductComponent,
      componentProps: {
        lat: coords.lat,
        lng: coords.lng
      }
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
      lng: userLatLng.lng
    };
  }
}