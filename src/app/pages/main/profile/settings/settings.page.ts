import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastController } from '@ionic/angular/standalone';
import { User } from 'src/app/models/user.model';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private firebaseService: FirebaseService, private utilsService: UtilsService, private toastController: ToastController) { }

  ngOnInit() {
  }

  user(): User {
      return this.utilsSvc.getFromLocalStorage('user');
    }

  ActualizarNombre(){
    
  }
}
