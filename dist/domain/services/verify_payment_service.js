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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class VerifyPaymentService {
    constructor() {
        this.verifyPayment = (orderId) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`https://api.razorpay.com/v1/orders/${orderId}`, {
                auth: {
                    username: "rzp_test_1hrXSB3kRQMgLu",
                    password: "T0oxxSPF9jgiUjT6onmL0Tif"
                }
            });
            return response.data.status == "paid";
        });
    }
}
exports.default = VerifyPaymentService;
