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
const mongo_product_mapper_1 = __importDefault(require("./mongo_product_mapper"));
const bson_1 = require("bson");
const mongodb_1 = __importDefault(require("../../../mongodb"));
const mongo_product_from_document_1 = __importDefault(require("./mongo_product_from_document"));
const mongo_get_all_products_1 = __importDefault(require("./mongo_get_all_products"));
class MongoProductsRepository {
    constructor() {
        this.storeProduct = (product) => __awaiter(this, void 0, void 0, function* () {
            yield mongodb_1.default.collection("products").updateOne({ "_id": new bson_1.ObjectID(product.id) }, { $set: this.mapper.toDBProduct(product) }, { upsert: true });
        });
        this.getAllProducts = (options) => __awaiter(this, void 0, void 0, function* () {
            const getAllProducts = new mongo_get_all_products_1.default(options);
            return yield getAllProducts.getAllProducts();
        });
        this.getProduct = (id) => __awaiter(this, void 0, void 0, function* () {
            const document = yield mongodb_1.default.collection("products").findOne({ "_id": new bson_1.ObjectID(id) });
            if (document == null)
                return null;
            return this.productFromDocument.productFromDocument(document);
        });
        this.productFromDocument = new mongo_product_from_document_1.default();
        this.mapper = new mongo_product_mapper_1.default();
    }
}
exports.default = MongoProductsRepository;
