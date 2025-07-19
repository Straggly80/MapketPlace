import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = () => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  return new Promise<boolean | UrlTree>((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true);
      } else {
        utilsSvc.routerLink('/main/menu');
        resolve(false);
      }
    });
  });
};
