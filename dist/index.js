"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const mongodb_1 = require("./mongodb");
const products_router_1 = __importDefault(require("./application_layer/products_router/products_router"));
const authentication_router_1 = __importDefault(require("./application_layer/authentication_router/authentication_router"));
const cors_1 = __importDefault(require("cors"));
const customers_router_1 = __importDefault(require("./application_layer/customers_router/customers_router"));
const orders_router_1 = __importDefault(require("./application_layer/orders_router/orders_router"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongodb_1.connectToMongo();
        const app = express.default();
        app.use(express.json({ limit: "10mb" }));
        app.use(express.static("public"));
        app.use(cors_1.default());
        app.use("/api/products", products_router_1.default);
        app.use("/api/auth", authentication_router_1.default);
        app.use("/api/customers/", customers_router_1.default);
        app.use("/api/orders/", orders_router_1.default);
        const port = process.env.PORT || "8000";
        app.listen(port, () => console.log(`Server listening to PORT ${port}`));
    });
}
main();
