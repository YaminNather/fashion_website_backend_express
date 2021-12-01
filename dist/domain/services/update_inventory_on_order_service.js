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
class UpdateInventoryOnOrderService {
    constructor() {
        this.updateInventory = (order) => __awaiter(this, void 0, void 0, function* () {
            const products = [];
            for (const orderItem of order.items) {
                const product = yield this.productsRepo.getProduct(orderItem.id);
                product.reduceStock(orderItem.quantity);
                products.push(product);
            }
            return products;
        });
        this.productsRepo = new mongo_products_repository_1.default();
    }
}
exports.default = UpdateInventoryOnOrderService;
