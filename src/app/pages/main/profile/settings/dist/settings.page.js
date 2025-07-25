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
    SettingsPage.prototype.takeImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, path, loading, dataUrl, imagePath, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = this.user();
                        path = "users/" + user.uid;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, 10, 13]);
                        return [4 /*yield*/, this.utilsSvc.takePicture('Imagen del Perfil')];
                    case 2:
                        dataUrl = (_b.sent())
                            .dataUrl;
                        return [4 /*yield*/, this.utilsSvc.loading()];
                    case 3:
                        loading = _b.sent();
                        return [4 /*yield*/, loading.present()];
                    case 4:
                        _b.sent();
                        imagePath = user.uid + "/profile";
                        _a = user;
                        return [4 /*yield*/, this.firebaseSvc.uploadImage(imagePath, dataUrl)];
                    case 5:
                        _a.image = _b.sent();
                        return [4 /*yield*/, this.firebaseSvc.updateDocument(path, { image: user.image })];
                    case 6:
                        _b.sent();
                        this.utilsSvc.saveInLocalStorage('user', user);
                        return [4 /*yield*/, this.utilsSvc.presentToast({
                                message: 'Imagen actualizada exitosamente!',
                                duration: 1500,
                                color: 'light',
                                icon: 'checkmark-circle-outline'
                            })];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 8:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [4 /*yield*/, this.utilsSvc.presentToast({
                                message: error_1.message || 'Error al actualizar la imagen.',
                                duration: 2500,
                                color: 'danger',
                                icon: 'alert-circle-outline'
                            })];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 10:
                        if (!loading) return [3 /*break*/, 12];
                        return [4 /*yield*/, loading.dismiss()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
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
