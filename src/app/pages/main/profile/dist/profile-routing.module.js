"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfilePageRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var profile_page_1 = require("./profile.page");
var routes = [
    {
        path: '',
        component: profile_page_1.ProfilePage
    },
    {
        path: 'settings',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./settings/settings.module'); }).then(function (m) { return m.SettingsPageModule; }); }
    }
];
var ProfilePageRoutingModule = /** @class */ (function () {
    function ProfilePageRoutingModule() {
    }
    ProfilePageRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], ProfilePageRoutingModule);
    return ProfilePageRoutingModule;
}());
exports.ProfilePageRoutingModule = ProfilePageRoutingModule;
