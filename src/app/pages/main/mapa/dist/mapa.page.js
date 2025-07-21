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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.MapaPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var add_update_product_component_1 = require("src/app/shared/components/add-update-product/add-update-product.component");
var router_1 = require("@angular/router");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var firestore_1 = require("firebase/firestore");
var geolocation_1 = require("@capacitor/geolocation");
var angular_2 = require("@ionic/angular");
var angular_3 = require("@ionic/angular");
var core_2 = require("@angular/core");
var MapaPage = /** @class */ (function () {
    function MapaPage() {
        this.isModalOpen = false;
        this.isCarreteOpen = false;
        this.products = [];
        this.users = [];
        this.loading = false;
        this.router = core_1.inject(router_1.Router);
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
        this.modalCtrl = core_1.inject(angular_1.ModalController);
        this.menuCtrl = core_1.inject(angular_2.MenuController);
        this.currentPath = '';
        this.markers = [];
        this.activeInfoWindow = null;
        // Nuevo: objeto para guardar InfoWindows por producto
        this.markerInfoWindows = {};
    }
    MapaPage.prototype.openModal = function () {
        var modal = document.querySelector('ion-modal');
        if (modal) {
            modal.present();
        }
    };
    MapaPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ubicacion;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.solicitarPermisosUbicacion()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCurrentLocation()];
                    case 2:
                        ubicacion = _a.sent();
                        console.log('📍 Ubicación actual:', ubicacion);
                        this.router.events.subscribe(function (event) {
                            if (event === null || event === void 0 ? void 0 : event.url)
                                _this.currentPath = event.url;
                        });
                        this.getAllProducts();
                        return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.solicitarPermisosUbicacion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permiso, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, geolocation_1.Geolocation.requestPermissions()];
                    case 1:
                        permiso = _a.sent();
                        if (permiso.location === 'granted') {
                            console.log('✅ Permiso de ubicación concedido');
                        }
                        else {
                            console.warn('❌ Permiso de ubicación denegado');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('⚠️ Error al solicitar permiso', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.doRefresh = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.getAllProducts();
            event.target.complete();
        }, 1000);
    };
    MapaPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loadGoogleMaps().then(function () { return _this.initMap(); });
        this.modal.present();
    };
    MapaPage.prototype.user = function () {
        return this.utilsSvc.getFromLocalStorage('user');
    };
    MapaPage.prototype.product = function () {
        return this.utilsSvc.getFromLocalStorage('productGeneral');
    };
    MapaPage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.swipeGesture(false);
        this.getAllProducts();
    };
    MapaPage.prototype.ionViewWillLeave = function () {
        this.menuCtrl.swipeGesture(true);
    };
    MapaPage.prototype.getAllProducts = function () {
        var _this = this;
        this.loading = true;
        var userProducts = [];
        var generalProducts = [];
        var userLoaded = false;
        var generalLoaded = false;
        var done = function () {
            var all = __spreadArrays(userProducts, generalProducts);
            var unique = all.filter(function (item, index, self) { return index === self.findIndex(function (t) { return t.id === item.id; }); });
            _this.products = unique;
            _this.loading = false;
            _this.mostrarMarcadores();
        };
        this.firebaseSvc
            .getCollectionData("users/" + this.user().uid + "/products", [
            firestore_1.orderBy('soldUnits', 'desc'),
        ])
            .subscribe({
            next: function (res) {
                userProducts = res;
                userLoaded = true;
                if (generalLoaded)
                    done();
            },
            error: function () {
                _this.loading = false;
            }
        });
        this.firebaseSvc
            .getCollectionData('productGeneral/', [firestore_1.orderBy('soldUnits', 'desc')])
            .subscribe({
            next: function (res) {
                generalProducts = res;
                generalLoaded = true;
                if (userLoaded)
                    done();
            },
            error: function () {
                _this.loading = false;
            }
        });
    };
    MapaPage.prototype.loadGoogleMaps = function () {
        return new Promise(function (resolve) {
            if (window.google && window.google.maps) {
                resolve();
            }
            else {
                var interval_1 = setInterval(function () {
                    if (window.google && window.google.maps) {
                        clearInterval(interval_1);
                        resolve();
                    }
                }, 100);
            }
        });
    };
    MapaPage.prototype.mostrarMarcadores = function () {
        var _this = this;
        this.clearMarkers();
        this.markerInfoWindows = {}; // Limpia los infoWindows guardados
        this.products.forEach(function (product) {
            if (product.lat && product.lng) {
                var marker_1 = new google.maps.Marker({
                    position: { lat: product.lat, lng: product.lng },
                    map: _this.map,
                    title: product.name
                });
                var infoWindow_1 = new google.maps.InfoWindow({
                    content: "\n          <div style=\"width: 180px; font-family:'poppins', sans-serif;\">\n            <img src=\"" + product.image + "\" style=\"width: 100%; border-radius: 8px 8px 0 0; display: block;\" />\n            <div style=\"padding: 8px; width: 100%; white-space: normal; overflow: visible;\">\n              <strong>Nombre: </strong>" + product.name + "<br>\n              <strong>Descripcion: </strong>" + product.descripcion + "<br>\n              <strong>Precio: </strong><strong style=\"color: #00cb00ff;\">$" + product.price + "</strong><br>\n              " + (product.telefono ? "<a href=\"https://wa.me/" + product.telefono + "\" target=\"_blank\" \n              style=\"margin-top: 8px; display: inline-block; padding: 6px 10px; background: #3aa93aff; \n              color: white; text-decoration: none; border-radius: 4px; font-family: 'poppins';\">\n                  \u00A1Contactame! <ion-icon name=\"logo-whatsapp\" color=\"light\" size=\"medium\"></ion-icon>\n                    </a>"
                        : '') + "\n            </div>\n          </div>\n        "
                });
                marker_1.addListener('click', function () {
                    if (_this.activeInfoWindow) {
                        _this.activeInfoWindow.close();
                    }
                    infoWindow_1.open(_this.map, marker_1);
                    _this.activeInfoWindow = infoWindow_1;
                });
                _this.markers.push(marker_1);
                _this.markerInfoWindows[product.id] = infoWindow_1;
            }
        });
        this.map.addListener('click', function () {
            if (_this.activeInfoWindow) {
                _this.activeInfoWindow.close();
                _this.activeInfoWindow = null;
            }
        });
    };
    // Nuevo método para abrir InfoWindow al hacer click en la imagen del modal
    MapaPage.prototype.abrirInfoWindow = function (product) {
        var index = this.products.findIndex(function (p) { return p.id === product.id; });
        if (index === -1)
            return;
        if (this.activeInfoWindow) {
            this.activeInfoWindow.close();
        }
        var marker = this.markers[index];
        var infoWindow = this.markerInfoWindows[product.id];
        if (marker && infoWindow) {
            infoWindow.open(this.map, marker);
            this.activeInfoWindow = infoWindow;
            // Centra el mapa en el marcador
            this.map.panTo(marker.getPosition());
        }
    };
    MapaPage.prototype.getCurrentLocation = function () {
        return __awaiter(this, void 0, Promise, function () {
            var position, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, geolocation_1.Geolocation.getCurrentPosition({
                                enableHighAccuracy: true
                            })];
                    case 1:
                        position = _a.sent();
                        return [2 /*return*/, {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }];
                    case 2:
                        error_2 = _a.sent();
                        alert('No se pudo obtener la ubicación. Verifica que el GPS esté activado y los permisos concedidos.');
                        console.error('Error al obtener la ubicación:', error_2);
                        return [2 /*return*/, {
                                lat: 31.327409,
                                lng: -113.522065
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.initMap = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userLocation, mapDiv;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCurrentLocation()];
                    case 1:
                        userLocation = _b.sent();
                        mapDiv = document.getElementById('map');
                        if (!mapDiv)
                            return [2 /*return*/];
                        this.map = new google.maps.Map(mapDiv, {
                            center: userLocation,
                            zoom: 13,
                            disableDefaultUI: true,
                            zoomControl: false,
                            clickableIcons: false,
                            mapTypeId: 'roadmap',
                            styles: [
                                {
                                    featureType: 'all',
                                    elementType: 'labels.text',
                                    stylers: [{ color: '#878787' }]
                                },
                                {
                                    featureType: 'all',
                                    elementType: 'labels.text.stroke',
                                    stylers: [{ visibility: 'off' }]
                                },
                                {
                                    featureType: 'landscape',
                                    elementType: 'all',
                                    stylers: [{ color: '#f9f5ed' }]
                                },
                                {
                                    featureType: 'road.highway',
                                    elementType: 'all',
                                    stylers: [{ color: '#f5f5f5' }]
                                },
                                {
                                    featureType: 'road.highway',
                                    elementType: 'geometry.stroke',
                                    stylers: [{ color: '#c9c9c9' }]
                                },
                                {
                                    featureType: 'water',
                                    elementType: 'all',
                                    stylers: [{ color: '#aee0f4' }]
                                },
                            ]
                        });
                        new google.maps.Marker({
                            position: userLocation,
                            map: this.map,
                            title: 'Tu ubicación',
                            icon: {
                                url: ((_a = this.user()) === null || _a === void 0 ? void 0 : _a.image) || 'assets/usuario-no-picture.png',
                                scaledSize: new google.maps.Size(30, 30),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(20, 20)
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.clearMarkers = function () {
        this.markers.forEach(function (marker) { return marker.setMap(null); });
        this.markers = [];
    };
    MapaPage.prototype.abrirFormulario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var coords, modal, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coords = this.map.getCenter().toJSON();
                        return [4 /*yield*/, this.modalCtrl.create({
                                component: add_update_product_component_1.AddUpdateProductComponent,
                                componentProps: {
                                    lat: coords.lat,
                                    lng: coords.lng
                                }
                            })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, modal.onDidDismiss()];
                    case 3:
                        data = (_a.sent()).data;
                        if (data) {
                            this.getAllProducts();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MapaPage.prototype.agregarProductoDesdeFormulario = function (data) {
        var userLatLng = this.map.getCenter().toJSON();
        var nuevo = {
            id: new Date().getTime().toString(),
            name: data.name,
            descripcion: data.descripcion,
            price: parseFloat(data.price),
            image: '',
            soldUnits: 0,
            lat: userLatLng.lat,
            lng: userLatLng.lng,
            telefono: data.telefono
        };
    };
    __decorate([
        core_2.ViewChild(angular_3.IonModal)
    ], MapaPage.prototype, "modal");
    MapaPage = __decorate([
        core_1.Component({
            selector: 'app-mapa',
            templateUrl: './mapa.page.html',
            styleUrls: ['./mapa.page.scss'],
            standalone: false
        })
    ], MapaPage);
    return MapaPage;
}());
exports.MapaPage = MapaPage;
