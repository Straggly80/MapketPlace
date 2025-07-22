import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { LocationService } from './services/location.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private locationService: LocationService) {
    this.showSplash(); //llamamos la funciones para que se ejecute al iniciar la app
    this.getCurrentLocation();
  }
  

  async showSplash(){
    await SplashScreen.show({
    autoHide: true,  //cuando pasen los 3 segundos se quita por eso es true
    showDuration: 2000  //dura 3 segundos
    });  
  }

  async getCurrentLocation() {
    try {
      const coords = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coords.coords;
      this.locationService.setLocation(latitude, longitude);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  }
}
