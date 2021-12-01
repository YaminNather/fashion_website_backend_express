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
const mongo_products_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/mongo_products_repository"));
const client_price_1 = require("../models/client_price");
const product_mapper_1 = require("../products_router/product_mapper");
class CartMapper {
    constructor() {
        this.toClientCart = (cart) => __awaiter(this, void 0, void 0, function* () {
            let originalPrice = 0;
            let finalPrice = 0;
            const clientCartItems = [];
            for (const cartItem of cart.getItems()) {
                const product = yield this.productsRepo.getProduct(cartItem.productId);
                clientCartItems.push(this.toClientCartItem(cartItem, product));
                originalPrice += product.originalPrice;
                finalPrice += product.getFinalPrice();
            }
            const r = {
                user_id: cart.userId,
                items: clientCartItems,
                original_price: client_price_1.createClientPrice(originalPrice),
                final_price: client_price_1.createClientPrice(finalPrice)
            };
            return r;
        });
        this.toClientCartItem = (cartItem, product) => {
            const clientProduct = product_mapper_1.mapProductToClientProduct(product);
            const rawCartItemOriginalPrice = product.originalPrice * cartItem.quantity;
            const rawCartItemFinalPrice = product.getFinalPrice() * cartItem.quantity;
            const r = {
                product: clientProduct,
                quantity: cartItem.quantity,
                original_price: {
                    raw: rawCartItemOriginalPrice,
                    formatted_with_code: `${rawCartItemOriginalPrice}`,
                    formatted_with_symbol: `$${rawCartItemOriginalPrice}`
                },
                final_price: {
                    raw: rawCartItemFinalPrice,
                    formatted_with_code: `${rawCartItemFinalPrice}`,
                    formatted_with_symbol: `$${rawCartItemFinalPrice}`
                }
            };
            return r;
        };
        this.productsRepo = new mongo_products_repository_1.default();
    }
}
exports.default = CartMapper;
