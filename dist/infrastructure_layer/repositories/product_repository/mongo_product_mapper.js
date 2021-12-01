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
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importStar(require("../../../domain/models/product"));
const bson_1 = require("bson");
class MongoProductMapper {
    constructor() {
        this.toDBProduct = (product) => {
            return {
                "_id": new bson_1.ObjectID(product.id),
                "product_name": product.productName,
                "brand": product.brand,
                "description": product.description,
                "original_price": product.originalPrice,
                "stock": product.stock,
                "discount_type": (product.discount != null) ? product.discount.type : null,
                "discount_amount": (product.discount != null) ? product.discount.amount : null,
                "arrival_time": product.arrivalTime,
                "images": product.images,
                "videos": product.videos
            };
        };
        this.mapProduct = (productDocument) => {
            let discount = undefined;
            if (productDocument["discount_type"] != undefined && productDocument["discount_amount"] != undefined)
                discount = new product_1.Discount(productDocument["discount_type"], productDocument["discount_amount"]);
            const r = new product_1.default({
                id: productDocument["_id"].toString(),
                productName: productDocument["product_name"],
                brand: productDocument["brand"],
                description: productDocument["description"],
                arrivalTime: productDocument["arrival_time"],
                stock: productDocument["stock"],
                originalPrice: productDocument["original_price"],
                discount: discount,
                images: productDocument["images"],
                videos: productDocument["videos"],
                variantOf: productDocument["variant_of"]
            });
            return r;
        };
        this.mapProductVariant = (variantDocument, baseDocument) => {
            var _a, _b;
            let discount = undefined;
            if (baseDocument["discount_type"] != undefined && baseDocument["discount_amount"] != undefined)
                discount = new product_1.Discount(baseDocument["discount_type"], baseDocument["discount_amount"]);
            const r = new product_1.default({
                id: variantDocument["_id"].toString(),
                productName: variantDocument["product_name"],
                brand: baseDocument["brand"],
                description: (_a = variantDocument["description"]) !== null && _a !== void 0 ? _a : baseDocument["description"],
                arrivalTime: variantDocument["arrival_time"],
                stock: parseInt(variantDocument["stock"]),
                originalPrice: parseFloat((_b = variantDocument["original_price"]) !== null && _b !== void 0 ? _b : baseDocument["original_price"]),
                discount: discount,
                images: variantDocument["images"],
                videos: variantDocument["videos"],
                variantOf: variantDocument["variant_of"]
            });
            return r;
        };
    }
}
exports.default = MongoProductMapper;
