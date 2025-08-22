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
exports.FirebaseService = void 0;
var core_1 = require("@angular/core");
var auth_1 = require("@angular/fire/compat/auth");
var auth_2 = require("firebase/auth");
var firestore_1 = require("@angular/fire/compat/firestore");
var firestore_2 = require("@angular/fire/firestore");
var utils_service_1 = require("./utils.service");
var storage_1 = require("@angular/fire/compat/storage");
var storage_2 = require("firebase/storage");
var rxjs_1 = require("rxjs");
var FirebaseService = /** @class */ (function () {
    function FirebaseService() {
        this.auth = core_1.inject(auth_1.AngularFireAuth);
        this.firestore = core_1.inject(firestore_1.AngularFirestore);
        this.storage = core_1.inject(storage_1.AngularFireStorage);
        this.utilsSvc = core_1.inject(utils_service_1.UtilsService);
    }
    FirebaseService.prototype.archiveDocument = function (path) {
        var docRef = firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), path);
        return firestore_2.updateDoc(docRef, { archived: true });
    };
    /* ============================== AUTENTICACION ============================== */
    FirebaseService.prototype.getAuth = function () {
        return auth_2.getAuth();
    };
    /* ========== ACCEDER ========== */
    FirebaseService.prototype.signIn = function (user) {
        return auth_2.signInWithEmailAndPassword(auth_2.getAuth(), user.email, user.password);
    };
    /* ========== CREAR USUARIO ========== */
    FirebaseService.prototype.signUp = function (user) {
        return auth_2.createUserWithEmailAndPassword(auth_2.getAuth(), user.email, user.password);
    };
    /* ========= ACTUALIZAR USUARIO ========== */
    FirebaseService.prototype.updateUser = function (displayName) {
        return auth_2.updateProfile(auth_2.getAuth().currentUser, { displayName: displayName });
    };
    /* ========== RECUPERAR CONTRASEÑA ============ */
    FirebaseService.prototype.sendRecoveryEmail = function (email) {
        return auth_2.sendPasswordResetEmail(auth_2.getAuth(), email);
    };
    /* ========= CERRAR SESION ========== */
    FirebaseService.prototype.signOut = function () {
        auth_2.getAuth().signOut();
        localStorage.removeItem('user');
        this.utilsSvc.routerLink('/auth');
    };
    /* ============================== DATABASE ============================== */
    /* =========== OBTENER DOCUMENTOS DE UNA COLECCION ========= */
    FirebaseService.prototype.getCollectionData = function (path, collectionQuery) {
        var ref = firestore_2.collection(firestore_2.getFirestore('geohub-origin77'), path);
        // Verificamos si collectionQuery fue enviado
        if (collectionQuery && Array.isArray(collectionQuery)) {
            return firestore_2.collectionData(firestore_2.query.apply(void 0, __spreadArrays([ref], collectionQuery)), { idField: 'id' });
        }
        else {
            return firestore_2.collectionData(ref, { idField: 'id' });
        }
    };
    /* =========== OBTENER LOS PRODUCTOS PARA LOS MARCADORES =========== */
    FirebaseService.prototype.getAllUserProducts = function () {
        var _this = this;
        return this.firestore.collection('users').snapshotChanges().pipe(rxjs_1.switchMap(function (userDocs) {
            var observables = userDocs.map(function (userDoc) {
                var uid = userDoc.payload.doc.id;
                return _this.firestore
                    .collection("users/" + uid + "/products")
                    .valueChanges();
            });
            return observables.length
                ? rxjs_1.combineLatest(observables).pipe(rxjs_1.map(function (productArrays) { return [].concat.apply([], productArrays); }) // aplanado sin .flat()
                )
                : rxjs_1.of([]);
        }));
    };
    /* ========= SETEAR UN DOCUMENTO */
    FirebaseService.prototype.setDocument = function (path, data) {
        return firestore_2.setDoc(firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), path), data);
    };
    /* ========= ACTUALIZAR UN DOCUMENTO */
    FirebaseService.prototype.updateDocument = function (path, data) {
        return firestore_2.updateDoc(firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), path), data);
    };
    /* ========= ELIMINAR UN DOCUMENTO */
    FirebaseService.prototype.deleteDocument = function (path) {
        return firestore_2.deleteDoc(firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), path));
    };
    /* ========= OBTENER UN DOCUMENTO ======== */
    FirebaseService.prototype.getDocument = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firestore_2.getDoc(firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), path))];
                    case 1: return [2 /*return*/, (_a.sent()).data()];
                }
            });
        });
    };
    /* ========== AGREGAR DOCUMENTO ========== */
    FirebaseService.prototype.addDocument = function (path, data) {
        return firestore_2.addDoc(firestore_2.collection(firestore_2.getFirestore('geohub-origin77'), path), data);
    };
    /* ========== AGREGAR PRODUCTO GENERAL ========== */
    FirebaseService.prototype.agregarProducto = function (data) {
        return firestore_2.addDoc(firestore_2.collection(firestore_2.getFirestore('geohub-origin77'), 'productGeneral'), data);
    };
    /* =================OBTENER PRODUCTO GENERAL================================ */
    /* ========= OBTENER UN DOCUMENTO ======== */
    FirebaseService.prototype.getDocumentos = function (path, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firestore_2.getDoc(firestore_2.doc(firestore_2.getFirestore('geohub-origin77'), 'productGeneral'))];
                    case 1: return [2 /*return*/, (_a.sent()).data()];
                }
            });
        });
    };
    /* =========== OBTENER LOS PRODUCTOS GENERAL=========== */
    FirebaseService.prototype.getAllUserProductGeneral = function () {
        var _this = this;
        return this.firestore.collection('/productGeneral').snapshotChanges().pipe(rxjs_1.switchMap(function (userDocs) {
            var observables = userDocs.map(function (userDoc) {
                var uid = userDoc.payload.doc.id;
                return _this.firestore
                    .collection("")
                    .valueChanges();
            });
            return observables.length
                ? rxjs_1.combineLatest(observables).pipe(rxjs_1.map(function (productArrays) { return [].concat.apply([], productArrays); }) // aplanado sin .flat()
                )
                : rxjs_1.of([]);
        }));
    };
    /* ============================== ALMACENAMIENTO ============================== */
    /* ========== SUBIR IMAGEN =========*/
    FirebaseService.prototype.uploadImage = function (path, data_url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, storage_2.uploadString(storage_2.ref(storage_2.getStorage(), path), data_url, 'data_url').then(function () {
                        return storage_2.getDownloadURL(storage_2.ref(storage_2.getStorage(), path));
                    })];
            });
        });
    };
    /* ========= OBTENER PATH DE IMAGEN ========= */
    FirebaseService.prototype.getFilePath = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, storage_2.ref(storage_2.getStorage(), url).fullPath];
            });
        });
    };
    /* =========== ELIMINAR ARCHIVO ============ */
    FirebaseService.prototype.deleteFile = function (path) {
        return storage_2.deleteObject(storage_2.ref(storage_2.getStorage(), path));
    };
    FirebaseService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
