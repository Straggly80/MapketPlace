import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = () => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  let user = localStorage.getItem('user');

  return new Promise<boolean | UrlTree>((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        if (user) resolve(true);
      } else {
        firebaseSvc.signOut();
        resolve(false);
      }
    });
  });
};
