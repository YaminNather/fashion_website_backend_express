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
const mongo_cart_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository"));
const mongo_products_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/mongo_products_repository"));
const order_1 = __importStar(require("../models/order"));
const bson_1 = require("bson");
class OrderFromCheckoutTokenService {
    constructor() {
        this.toOrder = (checkoutToken, address, paymentId) => __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.cartRepo.getCart(checkoutToken.userId);
            const orderItems = [];
            for (const cartItem of cart.getItems())
                orderItems.push(yield this.toOrderItem(cartItem));
            return new order_1.default({
                id: new bson_1.ObjectID().toString(),
                userId: checkoutToken.userId,
                address: address,
                orderedDate: new Date(),
                arrivalDate: null,
                items: orderItems,
                orderStatus: "ongoing",
                paymentStatus: (paymentId != null) ? "online" : "ongoing",
            });
        });
        this.toOrderItem = (cartItem) => __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productsRepo.getProduct(cartItem.productId);
            return new order_1.OrderItem({
                id: product.id,
                brand: product.brand,
                discount: product.discount,
                images: product.images,
                originalPrice: product.originalPrice,
                productName: product.productName,
                quantity: cartItem.quantity
            });
        });
        this.productsRepo = new mongo_products_repository_1.default();
        this.cartRepo = new mongo_cart_repository_1.default();
    }
}
exports.default = OrderFromCheckoutTokenService;
