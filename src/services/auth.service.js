"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const uuid_1 = require("uuid");
const messaging_service_1 = require("./messaging.service");
const registerUser = (
// email: string,
// password: string,
// role: string,
// name: { firstName: string; lastName: string },
// companyRefId:string,
// token:string
user) => __awaiter(void 0, void 0, void 0, function* () {
    let data = user;
    if (user.role === "shipperAdmin" || user.role === "carrierAdmin") {
        user.companyRefId = generateCompanyRefId(user.role);
    }
    const userRegister = yield (0, auth_repository_1.registerUserInDB)(user.email, user.password, user.role, user.name, user.token, user.companyRefId);
    const userId = userRegister.user.id;
    data = Object.assign(Object.assign({}, data), { userId });
    if (userRegister.user.role == 'carrierAdmin') {
        try {
            yield (0, messaging_service_1.publishToQueue)("carrierServiceQueue", JSON.stringify(data));
            console.log("Message published to carrierServiceQueue");
        }
        catch (messageError) {
            console.error("Error publishing to queue:", messageError);
        }
    }
    else if (userRegister.user.role == "shipperAdmin") {
        try {
            yield (0, messaging_service_1.publishToQueue)("shipperServiceQueue", JSON.stringify(data));
            console.log("Message published to shipperServiceQueue");
        }
        catch (messageError) {
            console.error("Error publishing to queue:", messageError);
        }
    }
    return userRegister;
});
exports.registerUser = registerUser;
const loginUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, auth_repository_1.loginUserInDB)(username, password);
});
exports.loginUser = loginUser;
// Helper function to generate a unique companyRefId
const generateCompanyRefId = (role) => {
    const prefix = role === "shipperAdmin" ? "SH" : "CA"; // Prefix for shipper or carrier
    const uniqueId = (0, uuid_1.v4)().split("-")[0].toUpperCase();
    return `${prefix}${uniqueId}`;
};
