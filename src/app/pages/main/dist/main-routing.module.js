"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainPageRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var main_page_1 = require("./main.page");
var routes = [
    {
        path: '',
        component: main_page_1.MainPage,
        children: [
            {
                path: 'home',
                loadChildren: function () {
                    return Promise.resolve().then(function () { return require('./home/home.module'); }).then(function (m) { return m.HomePageModule; });
                }
            },
            {
                path: 'profile',
                loadChildren: function () {
                    return Promise.resolve().then(function () { return require('./profile/profile.module'); }).then(function (m) { return m.ProfilePageModule; });
                }
            },
            {
                path: 'ventas',
                loadChildren: function () {
                    return Promise.resolve().then(function () { return require('./ventas/ventas.module'); }).then(function (m) { return m.VentasPageModule; });
                }
            },
            {
                path: 'mapa',
                loadChildren: function () {
                    return Promise.resolve().then(function () { return require('./mapa/mapa.module'); }).then(function (m) { return m.MapaPageModule; });
                }
            },
            {
                path: 'menu',
                loadChildren: function () {
                    return Promise.resolve().then(function () { return require('./menu/menu.module'); }).then(function (m) { return m.MenuPageModule; });
                }
            },
            {
                path: 'settings',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./profile/settings/settings.module'); }).then(function (m) { return m.SettingsPageModule; }); }
            }
        ]
    },
];
var MainPageRoutingModule = /** @class */ (function () {
    function MainPageRoutingModule() {
    }
    MainPageRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], MainPageRoutingModule);
    return MainPageRoutingModule;
}());
exports.MainPageRoutingModule = MainPageRoutingModule;
