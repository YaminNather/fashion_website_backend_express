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
const bson_1 = require("bson");
const mongodb_1 = __importDefault(require("../../../mongodb"));
const mongo_product_mapper_1 = __importDefault(require("./mongo_product_mapper"));
class MongoProductFromDocument {
    constructor() {
        this.productFromDocument = (document) => __awaiter(this, void 0, void 0, function* () {
            if (document["variant_of"] == undefined) {
                return this.mapper.mapProduct(document);
            }
            else {
                const baseDocument = yield mongodb_1.default.collection("products").findOne({ "_id": new bson_1.ObjectID(document.variant_of) });
                if (baseDocument == null)
                    throw new Error("Document not found");
                return this.mapper.mapProductVariant(document, baseDocument);
            }
        });
        this.mapper = new mongo_product_mapper_1.default();
    }
}
exports.default = MongoProductFromDocument;
