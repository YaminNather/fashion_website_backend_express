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
const mongo_cart_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository"));
const cart_mapper_1 = __importDefault(require("./cart_mapper"));
class CheckoutTokenMapper {
    constructor() {
        this.toClientCheckoutToken = (checkoutToken) => __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.cartRepo.getCart(checkoutToken.userId);
            const r = {
                id: checkoutToken.id,
                user_id: checkoutToken.userId,
                cart: yield this.cartMapper.toClientCart(cart)
            };
            return r;
        });
        this.cartRepo = new mongo_cart_repository_1.default();
        this.cartMapper = new cart_mapper_1.default();
    }
}
exports.default = CheckoutTokenMapper;
