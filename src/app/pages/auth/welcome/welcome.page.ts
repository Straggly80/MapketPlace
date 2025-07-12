import { Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {
 constructor(private router: Router) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          console.log(error);

          this.utilSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          this.utilSvc.saveInLocalStorage('user', user);
          this.utilSvc.routerLink('/main/mapa');
          this.form.reset();

          this.utilSvc.presentToast({
            message: `Bienvenid@ a MapketPlace ${user.name}`,
            duration: 1500,
            color: 'secondary',
            position: 'bottom',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);

          this.utilSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'bottom',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

    forgotpassword() {
    this.router.navigate(['auth/forgot-password']);
  }

    signup() {
    this.router.navigate(['auth/sign-up']);
  }

}
