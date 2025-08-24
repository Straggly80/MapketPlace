"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SettingComponent = void 0;
var core_1 = require("@angular/core");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
// import { ProfilePage } from './profile/profile.page';
var core_2 = require("@angular/core");
var SettingComponent = /** @class */ (function () {
    function SettingComponent(firebaseService, utilsService, toastController, authService, router) {
        this.firebaseService = firebaseService;
        this.utilsService = utilsService;
        this.toastController = toastController;
        this.authService = authService;
        this.router = router;
        this.products = [];
        this.loading = false;
        /*   onWillPresent() {
            this.nav.setRoot(ProfilePage);
          }
        
           onWillPresent2() {
            this.nav.setRoot(ProfilePage);
          }
         */
        this.pages = [
            /*  { title: 'Inicio', url: '/main/menu', icon: 'home' }, */
            { title: 'Mapa', url: '/main/mapa', icon: 'map' },
            { title: 'Favoritos', url: '/main/favoritos', icon: 'heart-outline' },
            { title: 'Ventas', url: '/main/home', icon: 'bag-outline' },
            { title: 'Compras', url: '/main/compras', icon: 'cart-outline' },
            { title: 'Chat', url: '/main/chat', icon: 'chatbubbles-outline' },
            { title: 'Perfil', url: '/main/profile', icon: '[src="user()?.image"' },
        ];
        /*   router = inject(Router); */
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
        this.currentPath = '';
    }
    SettingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            if (event === null || event === void 0 ? void 0 : event.url)
                _this.currentPath = event.url;
        });
    };
    SettingComponent.prototype.GoSettings = function () {
        this.closeModal();
    };
    /* ===== CERRAR SESION ===== */
    SettingComponent.prototype.signOut = function () {
        this.firebaseSvc.signOut();
    };
    /* que se cierre el modal al hacer click en el boton de cerrar sesion y redirigir a la pagina de inicio de sesion */
    SettingComponent.prototype.logout = function () {
        this.signOut();
        this.closeModal();
    };
    SettingComponent.prototype.closeModal = function () {
        var modal = document.querySelector('ion-modal');
        if (modal) {
            modal.dismiss();
        }
    };
    /* que elimine la cuenta en la que se esta inciada sesion,
    que se elimine el usuario y todos sus datos */
    SettingComponent.prototype.EliminarCuenta = function () {
        this.deleteUsuario(this.user());
        this.closeModal();
        this.signOut();
        this.router.navigate(['/login']);
    };
    SettingComponent.prototype.CerrarSesion = function () {
        this.logout();
    };
    /* AUN NO BORRA NO ESTA TERMINADO */
    SettingComponent.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    SettingComponent.prototype.EliminarUsuario = function () {
        this.deleteUsuario;
    };
    SettingComponent.prototype.deleteUsuario = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var path, paths, loading, imagePath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "users/" + this.user().uid;
                        paths = "productGeneral/" + user.uid;
                        return [4 /*yield*/, this.utilsSvc.loading()];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.firebaseSvc.getFilePath(user.image)];
                    case 3:
                        imagePath = _a.sent();
                        return [4 /*yield*/, this.firebaseSvc.deleteFile(imagePath)];
                    case 4:
                        _a.sent();
                        this.firebaseSvc.deleteDocument(path).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); });
                        this.firebaseSvc.deleteDocument(paths).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); });
                        this.products = this.products.filter(function (p) { return p.id !== user.uid; });
                        this.utilsSvc
                            .presentToast({
                            message: 'Perfil eliminado exitosamente!',
                            duration: 1500,
                            color: 'warning',
                            position: 'middle',
                            icon: 'checkmark-circle-outline'
                        })["catch"](function (error) {
                            console.log(error);
                            _this.utilsSvc.presentToast({
                                message: error.message,
                                duration: 2500,
                                color: 'primary',
                                position: 'middle',
                                icon: 'alert-circle-outline'
                            });
                        })["finally"](function () {
                            loading.dismiss();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_2.ViewChild('nav')
    ], SettingComponent.prototype, "nav");
    SettingComponent = __decorate([
        core_1.Component({
            selector: 'app-setting',
            templateUrl: './setting.component.html',
            styleUrls: ['./setting.component.scss'],
            standalone: false
        })
    ], SettingComponent);
    return SettingComponent;
}());
exports.SettingComponent = SettingComponent;
