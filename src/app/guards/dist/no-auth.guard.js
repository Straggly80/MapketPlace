"use strict";
exports.__esModule = true;
exports.noAuthGuard = void 0;
var core_1 = require("@angular/core");
var firebase_service_1 = require("../services/firebase.service");
var utils_service_1 = require("../services/utils.service");
exports.noAuthGuard = function () {
    var firebaseSvc = core_1.inject(firebase_service_1.FirebaseService);
    var utilsSvc = core_1.inject(utils_service_1.UtilsService);
    return new Promise(function (resolve) {
        firebaseSvc.getAuth().onAuthStateChanged(function (auth) {
            if (!auth) {
                resolve(true);
            }
            else {
                utilsSvc.routerLink('/main/menu');
                resolve(false);
            }
        });
    });
};
