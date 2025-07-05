import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements OnInit {

  constructor(){ }

  ngOnInit(){}

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
            resolve({ lat: 19.4326, lng: -99.1332 }); // CDMX por defecto
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve({ lat: 20.4326, lng: -59.1332 });
      }
    });
  }

  async initMap() {
    const userLocation = await this.getCurrentLocation();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;


    // Inicializar el mapa  

    const map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 14,
      disableDefaultUI: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'on' }] },
        { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'on' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
        { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'on'}] },
        { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'on' }] },
        { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'on' }] }
      ]
    });

    // Marca tu ubicación actual
    new google.maps.Marker({
      position: userLocation,
      map,
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

    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(userLocation);
    }, 500);
  }
}

