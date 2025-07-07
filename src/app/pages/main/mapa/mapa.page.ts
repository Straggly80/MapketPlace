import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { v4 as uuidv4 } from 'uuid';

import { AlertController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { FirebaseService } from 'src/app/services/firebase.service';

declare const google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements OnInit {

  productos: Product[] = [];

  nuevoProducto: Partial<Product> = {
    name: '',
    descripcion: '',
    price: 0,
    image: '',
    soldUnits: 0,
  };

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];  // arreglo para guardar marcadores

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
    this.firebaseSvc.getCollectionData('productos').subscribe((productos: Product[]) => {
      this.productos = productos;
      if (this.map) {
        this.clearMarkers();
        this.productos.forEach(p => this.agregarMarcador(p));
      }
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  ngAfterViewInit() {
    this.loadGoogleMaps().then(() => this.initMap());
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
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation failed:', error.message);
            resolve({ lat: 19.4326, lng: -99.1332 }); // fallback a CDMX
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve({ lat: 19.4326, lng: -99.1332 });
      }
    });
  }

  async initMap() {
    const userLocation = await this.getCurrentLocation();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
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
          stylers: [{ visibility: 'off' }],
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

    // Marcador de ubicación del usuario
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: this.map,
      title: 'Tu ubicación',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: 'aqua',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: 'black'
      }
    });

    // Guardar el marcador del usuario también si quieres manejarlo luego
    this.markers.push(userMarker);

    // Agregar marcadores de productos/publicaciones
    this.productos.forEach(p => this.agregarMarcador(p));
  }

  agregarMarcador(product: Product) {
    const marker = new google.maps.Marker({
      position: { lat: product.lat, lng: product.lng },
      map: this.map,
      title: product.name,
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${product.name}</strong><br>${product.descripcion}<br>Precio: $${product.price}`,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
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
      this.productos.push(data);
      this.agregarMarcador(data);
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

    this.productos.push(nuevo);
    this.agregarMarcador(nuevo);
  }
}
