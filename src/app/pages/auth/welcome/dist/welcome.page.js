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
exports.WelcomePage = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var forms_2 = require("@angular/forms");
var firebase_service_1 = require("src/app/services/firebase.service");
var utils_service_1 = require("src/app/services/utils.service");
var WelcomePage = /** @class */ (function () {
    function WelcomePage(router) {
        this.router = router;
        this.form = new forms_1.FormGroup({
            email: new forms_2.FormControl('', [forms_2.Validators.required, forms_2.Validators.email]),
            password: new forms_2.FormControl('', [forms_2.Validators.required])
        });
        this.firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
        this.utilSvc = core_1.inject(utils_service_1.UtilsService);
    }
    WelcomePage.prototype.ngOnInit = function () { };
    WelcomePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loading_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.form.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.utilSvc.loading()];
                    case 1:
                        loading_1 = _a.sent();
                        return [4 /*yield*/, loading_1.present()];
                    case 2:
                        _a.sent();
                        this.firebaseSvc
                            .signIn(this.form.value)
                            .then(function (res) {
                            _this.getUserInfo(res.user.uid);
                        })["catch"](function (error) {
                            console.log(error);
                            _this.utilSvc.presentToast({
                                message: error.message,
                                duration: 2500,
                                color: 'primary',
                                position: 'middle',
                                icon: 'alert-circle-outline'
                            });
                        })["finally"](function () {
                            loading_1.dismiss();
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WelcomePage.prototype.getUserInfo = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var loading_2, path;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.form.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.utilSvc.loading()];
                    case 1:
                        loading_2 = _a.sent();
                        return [4 /*yield*/, loading_2.present()];
                    case 2:
                        _a.sent();
                        path = "users/" + uid;
                        this.firebaseSvc
                            .getDocument(path)
                            .then(function (user) {
                            _this.utilSvc.saveInLocalStorage('user', user);
                            _this.utilSvc.routerLink('/main/home');
                            _this.form.reset();
                            _this.utilSvc.presentToast({
                                message: "Bienvenid@ a MapketPlace " + user.name,
                                duration: 1500,
                                color: 'success',
                                position: 'bottom',
                                icon: 'person-circle-outline'
                            });
                        })["catch"](function (error) {
                            console.log(error);
                            _this.utilSvc.presentToast({
                                message: error.message,
                                duration: 2500,
                                color: 'warning',
                                position: 'bottom',
                                icon: 'alert-circle-outline'
                            });
                        })["finally"](function () {
                            loading_2.dismiss();
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WelcomePage.prototype.forgotpassword = function () {
        this.router.navigate(['auth/forgot-password']);
    };
    WelcomePage.prototype.signup = function () {
        this.router.navigate(['auth/sign-up']);
    };
    WelcomePage = __decorate([
        core_1.Component({
            selector: 'app-welcome',
            templateUrl: './welcome.page.html',
            styleUrls: ['./welcome.page.scss'],
            standalone: false
        })
    ], WelcomePage);
    return WelcomePage;
}());
exports.WelcomePage = WelcomePage;
