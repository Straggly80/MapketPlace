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
exports.HomePage = void 0;
var core_1 = require("@angular/core");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var add_update_product_component_1 = require("src/app/shared/components/add-update-product/add-update-product.component");
var firestore_1 = require("firebase/firestore");
var HomePage = /** @class */ (function () {
    function HomePage(firebaseService) {
        this.firebaseService = firebaseService;
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
        this.products = [];
        this.loading = false;
    }
    HomePage.prototype.ngOnInit = function () { };
    HomePage.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.getProducts();
    };
    HomePage.prototype.doRefresh = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.getProducts();
            event.target.complete();
        }, 1000);
    };
    /* =========== CALCULAR PROFIT =========== */
    HomePage.prototype.getProfits = function () {
        return this.products.reduce(function (index, product) { return index + product.price * product.soldUnits; }, 0);
    };
    /* ======================= OBTENER PRODUCTOS ======================== */
    HomePage.prototype.getProducts = function () {
        var _this = this;
        var path = "users/" + this.user().uid + "/products";
        this.loading = true;
        var query = [firestore_1.orderBy('soldUnits', 'desc')];
        var sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
            next: function (res) {
                console.log(res);
                _this.products = res;
                _this.loading = false;
            },
            error: function (err) {
                console.log(err);
                _this.loading = false;
            },
            complete: function () {
                console.log('complete');
                sub.unsubscribe();
            }
        });
    };
    /* =======================OBTENER PRODUCTOS GENERAL=============================================== */
    HomePage.prototype.getDocumentos = function () {
        var _this = this;
        var path = "productGeneral";
        this.loading = true;
        var query = [firestore_1.orderBy('soldUnits', 'desc')];
        var sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
            next: function (res) {
                console.log(res);
                _this.products = res;
                _this.loading = false;
            },
            error: function (err) {
                console.log(err);
                _this.loading = false;
            },
            complete: function () {
                console.log('complete');
                sub.unsubscribe();
            }
        });
    };
    /* ==================== AGREGAR O ACTUALIZAR PRODUCTO ==================== */
    HomePage.prototype.addUpdateProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.utilsSvc.presentModal({
                            component: add_update_product_component_1.AddUpdateProductComponent,
                            cssClass: 'add-update-modal',
                            componentProps: { product: product }
                        })];
                    case 1:
                        success = _a.sent();
                        if (success)
                            this.getProducts();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ==================== CONFIRMAR ARCHIVAR PRODUCTO ==================== */
    HomePage.prototype.confirmArchiveProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.utilsSvc.presentAlert({
                    header: 'Archivar producto',
                    message: '¿Quieres archivar este producto?',
                    mode: 'ios',
                    buttons: [
                        {
                            text: 'Cancelar'
                        },
                        {
                            text: 'Si, archivar',
                            handler: function () {
                                _this.archiveProduct(product);
                            }
                        },
                    ]
                });
                return [2 /*return*/];
            });
        });
    };
    /* ===================== ARCHIVAR PRODUCTO =================== */
    HomePage.prototype.archiveProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var path, paths, loading;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "users/" + this.user().uid + "/products/" + product.id;
                        paths = "productGeneral/" + product.id;
                        return [4 /*yield*/, this.utilsSvc.loading()];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        this.firebaseSvc.archiveDocument(path).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); });
                        this.firebaseSvc.archiveDocument(paths).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); });
                        this.products = this.products.filter(function (p) { return p.id !== product.id; });
                        this.utilsSvc
                            .presentToast({
                            message: 'Producto archivado exitosamente!',
                            duration: 1500,
                            color: 'success',
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
    /* =================== CONFIRMAR ELIMINACION DEL PRODUCTO ==================== */
    HomePage.prototype.confirmDeleteProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.utilsSvc.presentAlert({
                    header: 'Eliminar producto',
                    message: '¿Quieres eliminar este producto?',
                    mode: 'ios',
                    buttons: [
                        {
                            text: 'Cancelar'
                        },
                        {
                            text: 'Si, eliminar',
                            handler: function () {
                                _this.deleteProduct(product);
                            }
                        },
                    ]
                });
                return [2 /*return*/];
            });
        });
    };
    /* ===================== ELIMINAR PRODUCTO =================== */
    HomePage.prototype.deleteProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var path, paths, loading, imagePath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "users/" + this.user().uid + "/products/" + product.id;
                        paths = "productGeneral/" + product.id;
                        return [4 /*yield*/, this.utilsSvc.loading()];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.firebaseSvc.getFilePath(product.image)];
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
                        this.products = this.products.filter(function (p) { return p.id !== product.id; });
                        this.utilsSvc
                            .presentToast({
                            message: 'Producto eliminado exitosamente!',
                            duration: 1500,
                            color: 'success',
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
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.page.html',
            styleUrls: ['./home.page.scss'],
            standalone: false
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
