import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ventas',
  templateUrl:'./ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
  standalone:false,
})
export class VentasPage {
 
}
