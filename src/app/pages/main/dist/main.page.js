"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainPage = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var profile_page_1 = require("./profile/profile.page");
var core_2 = require("@angular/core");
var MainPage = /** @class */ (function () {
    function MainPage() {
        this.pages = [
            /* { title: 'Inicio', url: '/main/menu', icon: 'planet-outline' }, */
            { title: 'Mapa', url: '/main/mapa', icon: 'map' },
            { title: 'Favoritos', url: '/main/favoritos', icon: 'heart-outline' },
            { title: 'Ventas', url: '/main/home', icon: 'cart' },
            { title: 'Compras', url: '/main/compras', icon: 'bag-outline' },
            { title: 'Chat', url: '/main/chat', icon: 'chatbubbles-outline' },
            { title: 'Perfil', url: '/main/profile', icon: '[src="user()?.image"' },
        ];
        this.router = core_1.inject(router_1.Router);
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
        this.currentPath = '';
    }
    MainPage.prototype.onWillPresent = function () {
        this.nav.setRoot(profile_page_1.ProfilePage);
    };
    MainPage.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            if (event === null || event === void 0 ? void 0 : event.url)
                _this.currentPath = event.url;
        });
    };
    MainPage.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    /* ===== CERRAR SESION ===== */
    MainPage.prototype.signOut = function () {
        this.firebaseSvc.signOut();
    };
    __decorate([
        core_2.ViewChild('nav')
    ], MainPage.prototype, "nav");
    MainPage = __decorate([
        core_1.Component({
            selector: 'app-main',
            templateUrl: './main.page.html',
            styleUrls: ['./main.page.scss'],
            standalone: false
        })
    ], MainPage);
    return MainPage;
}());
exports.MainPage = MainPage;
