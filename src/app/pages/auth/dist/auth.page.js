"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthPage = void 0;
var core_1 = require("@angular/core");
var AuthPage = /** @class */ (function () {
    function AuthPage(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    AuthPage.prototype.ngOnInit = function () {
        this.user = this.authService.getAuthState();
    };
    AuthPage.prototype.loginFacebook = function () {
        this.authService.loginWithFacebook().subscribe({
            next: function (user) {
                // Manejar el usuario autenticado
                console.log('Usuario autenticado:', user);
            },
            error: function (error) {
                // Manejar errores
                console.error('Error al iniciar sesión con Facebook:', error);
            }
        });
    };
    AuthPage.prototype.logout = function () {
        this.authService.logout().subscribe({
            next: function () {
                console.log('Sesión cerrada');
            },
            error: function (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    };
    AuthPage.prototype.forgotpassword = function () {
        this.router.navigate(['forgot-password']);
    };
    // 🔵 Funciones para los íconos de redes sociales:
    AuthPage.prototype.loginWithFacebook = function () {
        console.log('Iniciar sesión con Facebook (pendiente)');
    };
    AuthPage.prototype.loginWithGoogle = function () {
        console.log('Iniciar sesión con Google (pendiente)');
    };
    AuthPage.prototype.loginWithApple = function () {
        console.log('Iniciar sesión con Apple (pendiente)');
    };
    AuthPage.prototype.loginWithGithub = function () {
        console.log('Iniciar sesión con GitHub (pendiente)');
    };
    AuthPage = __decorate([
        core_1.Component({
            selector: 'app-auth',
            templateUrl: './auth.page.html',
            styleUrls: ['./auth.page.scss'],
            standalone: false
        })
    ], AuthPage);
    return AuthPage;
}());
exports.AuthPage = AuthPage;
