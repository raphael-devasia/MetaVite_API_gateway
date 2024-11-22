"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserInDB = exports.registerUserInDB = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.join(__dirname, "../../../protos/auth.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
const client = new authProto.AuthService("localhost:3001", grpc.credentials.createInsecure());
const registerUserInDB = (email, password, role, name, token, companyRefId) => {
    return new Promise((resolve, reject) => {
        client.Register({ email, password, name, role, companyRefId, token }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.registerUserInDB = registerUserInDB;
const loginUserInDB = (username, password) => {
    return new Promise((resolve, reject) => {
        client.Login({ username, password }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.loginUserInDB = loginUserInDB;
