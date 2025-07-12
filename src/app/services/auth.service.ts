// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  loginWithFacebook(): Observable<any> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())).pipe(
      switchMap(result => {
        // Manejar el resultado aquí si es necesario
        console.log('Usuario autenticado con Facebook:', result.user);
        return [result.user]; // Devuelve el usuario como un Observable
      })
    );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // Ejemplo de observable para el estado de autenticación
  getAuthState(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
}