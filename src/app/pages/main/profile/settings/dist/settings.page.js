"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SettingsPage = void 0;
var core_1 = require("@angular/core");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var SettingsPage = /** @class */ (function () {
    function SettingsPage(firebaseService, utilsService, toastController) {
        this.firebaseService = firebaseService;
        this.utilsService = utilsService;
        this.toastController = toastController;
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
    }
    SettingsPage.prototype.ngOnInit = function () {
    };
    SettingsPage.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    SettingsPage.prototype.ActualizarNombre = function () {
    };
    SettingsPage = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.page.html',
            styleUrls: ['./settings.page.scss'],
            standalone: false
        })
    ], SettingsPage);
    return SettingsPage;
}());
exports.SettingsPage = SettingsPage;
