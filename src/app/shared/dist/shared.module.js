"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var header_component_1 = require("./components/header/header.component");
var custom_input_component_1 = require("./components/custom-input/custom-input.component");
var logo_component_1 = require("./components/logo/logo.component");
var angular_1 = require("@ionic/angular");
var forms_1 = require("@angular/forms");
var add_update_product_component_1 = require("./components/add-update-product/add-update-product.component");
var setting_component_1 = require("./components/setting/setting.component");
var actperfil_component_1 = require("./components/actperfil/actperfil.component");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [
                header_component_1.HeaderComponent,
                custom_input_component_1.CustomInputComponent,
                logo_component_1.LogoComponent,
                add_update_product_component_1.AddUpdateProductComponent,
                setting_component_1.SettingComponent,
                actperfil_component_1.ActperfilComponent
            ],
            exports: [
                header_component_1.HeaderComponent,
                custom_input_component_1.CustomInputComponent,
                logo_component_1.LogoComponent,
                forms_1.ReactiveFormsModule,
                add_update_product_component_1.AddUpdateProductComponent,
                actperfil_component_1.ActperfilComponent,
                setting_component_1.SettingComponent
            ],
            imports: [
                common_1.CommonModule,
                angular_1.IonicModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
/* import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';


import { SettingsPComponent } from './components/settings-p/settings-p.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateProductComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateProductComponent,


    SettingsPComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
 */ 
