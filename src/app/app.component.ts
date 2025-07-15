import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    this.showSplash(); //llamamos la funciones para que se ejecute al iniciar la app
  }
  

  async showSplash(){
    await SplashScreen.show({
    autoHide: true,  //cuando pasen los 3 segundos se quita por eso es true
    showDuration: 2000  //dura 3 segundos
});  
  }
}
