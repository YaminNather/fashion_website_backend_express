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
const mongodb_1 = __importDefault(require("../../../mongodb"));
const cart_1 = require("../../../domain/models/cart");
const cart_repository_1 = __importDefault(require("./cart_repository"));
const bson_1 = require("bson");
const cart_2 = __importDefault(require("../../../domain/models/cart"));
class MongoCartRepository extends cart_repository_1.default {
    constructor() {
        super(...arguments);
        this.storeCart = (cart) => __awaiter(this, void 0, void 0, function* () {
            const databaseItems = [];
            for (const item of cart.getItems()) {
                databaseItems.push({
                    "product_id": item.productId,
                    "quantity": item.quantity
                });
            }
            yield mongodb_1.default.collection("carts").updateOne({ "_id": new bson_1.ObjectID(cart.userId) }, {
                $set: { "items": databaseItems }
            }, { upsert: true });
        });
        this.getCart = (userId) => __awaiter(this, void 0, void 0, function* () {
            const document = yield mongodb_1.default.collection("carts").findOne({ "_id": new bson_1.ObjectID(userId) });
            if (document == null)
                return new cart_2.default(userId, []);
            const cartItems = [];
            for (const item of document["items"])
                cartItems.push(new cart_1.CartItem(item["product_id"], item["quantity"]));
            return new cart_2.default(userId, cartItems);
        });
    }
}
exports.default = MongoCartRepository;
