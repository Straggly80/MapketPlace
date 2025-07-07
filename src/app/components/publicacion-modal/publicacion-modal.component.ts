import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';

declare const google: any;

@Component({
  selector: 'app-publicacion-modal',
  templateUrl: './publicacion-modal.component.html',
  standalone: false
})
export class PublicacionModalComponent {
  producto: Partial<Product> = {};
  direccion: string = '';
  imagenBase64: string = '';
  ubicacion = { lat: 19.4326, lng: -99.1332 }; // CDMX por defecto
  miniMapa!: any;

  constructor(private modalCtrl: ModalController, private firebaseSvc: FirebaseService) {}


  ngOnInit() {
    this.obtenerUbicacionActual();
  }

  // Obtiene la ubicación real del dispositivo
  async obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.ubicacion = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.cargarMiniMapa(); // Carga el mapa cuando ya tienes la ubicación
          this.obtenerDireccion(this.ubicacion.lat, this.ubicacion.lng);
        },
        (err) => {
          console.warn('Error geolocalización:', err.message);
          this.cargarMiniMapa();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      this.cargarMiniMapa();
    }
  }

  cargarMiniMapa() {
    const mapDiv = document.getElementById('mini-map');
    if (!mapDiv) return;

    this.miniMapa = new google.maps.Map(mapDiv, {
      center: this.ubicacion,
      zoom: 16,
      disableDefaultUI: true
    });

    const marcador = new google.maps.Marker({
      position: this.ubicacion,
      map: this.miniMapa,
      draggable: true
    });

    marcador.addListener('dragend', (event: any) => {
      this.ubicacion = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.obtenerDireccion(this.ubicacion.lat, this.ubicacion.lng);
    });

    this.miniMapa.addListener('click', (event: any) => {
      marcador.setPosition(event.latLng);
      this.ubicacion = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.obtenerDireccion(this.ubicacion.lat, this.ubicacion.lng);
    });
  }

  obtenerDireccion(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.direccion = results[0].formatted_address;
      } else {
        this.direccion = 'Dirección no disponible';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // Validamos que venga con el encabezado correcto
      if (result.startsWith('data:image')) {
        this.imagenBase64 = result;
      } else {
        // Si solo es base64 sin encabezado, lo construimos manualmente
        this.imagenBase64 = `data:${file.type};base64,${btoa(result)}`;
      }
    };

    reader.readAsDataURL(file); // 👈 esto genera un Data URL válido automáticamente
  }


  async enviar() {
    // 1. Sube la imagen a Firebase Storage
    const nombreImagen = `productos/${new Date().getTime()}.jpg`;
    const urlImagen = await this.firebaseSvc.uploadImage(nombreImagen, this.imagenBase64);

    // 2. Crea el objeto producto
    const nuevo: Product = {
      id: new Date().getTime().toString(),
      name: this.producto.name || '',
      descripcion: this.producto.descripcion || '',
      price: this.producto.price || 0,
      image: urlImagen,
      soldUnits: 0,
      lat: this.ubicacion.lat,
      lng: this.ubicacion.lng
    };

    // 3. Guarda en Firestore
    await this.firebaseSvc.addDocument('productos', nuevo);

    // 4. Cierra el modal devolviendo el producto para mostrarlo en el mapa
    this.modalCtrl.dismiss(nuevo);
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}
