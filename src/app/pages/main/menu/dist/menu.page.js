"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MenuPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var MenuPage = /** @class */ (function () {
    function MenuPage(firebaseService, utilsService, toastController, authService, router) {
        this.firebaseService = firebaseService;
        this.utilsService = utilsService;
        this.toastController = toastController;
        this.authService = authService;
        this.router = router;
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
        this.toastCtrl = core_1.inject(angular_1.ToastController);
        this.currentPath = '';
        this.menuItems = [
            { title: 'Mapa', icon: 'home', route: '/main/mapa' },
            { title: 'Favoritos', icon: 'person-outline', route: '/main/favoritos' },
            { title: 'Ventas', icon: 'settings-outline', route: '/main/home' },
            { title: 'Compras', icon: 'person-outline', route: '/main/compras' },
            { title: 'Chat', icon: 'person-outline', route: '/main/chat' },
            { title: 'Perfil', icon: 'person-outline', route: '/main/profile' },
        ];
        this.menu = [
            { title: 'Perfil', icon: '[src=main/"user()?.image"', route: '/main/profile' },
        ];
    }
    MenuPage.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    MenuPage.prototype.navigateTo = function (route) {
        this.router.navigate([route]);
    };
    MenuPage.prototype.ngOnInit = function () {
    };
    MenuPage = __decorate([
        core_1.Component({
            selector: 'app-menu',
            templateUrl: './menu.page.html',
            styleUrls: ['./menu.page.scss'],
            standalone: false
        })
    ], MenuPage);
    return MenuPage;
}());
exports.MenuPage = MenuPage;
