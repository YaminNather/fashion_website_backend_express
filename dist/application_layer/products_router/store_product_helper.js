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
const product_1 = __importStar(require("../../domain/models/product"));
const fs = __importStar(require("fs/promises"));
const bson_1 = require("bson");
const mongo_products_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/mongo_products_repository"));
class StoreProductHelper {
    constructor(id, data) {
        this.storeProduct = () => __awaiter(this, void 0, void 0, function* () {
            const storedImageURLs = yield this.getURLOfImages(this.data.images);
            let discount;
            if (this.data.discount != null)
                discount = new product_1.Discount(this.data.discount.type, this.data.discount.amount);
            else
                discount = undefined;
            const product = new product_1.default({
                id: this.id,
                productName: this.data.product_name,
                brand: this.data.brand,
                description: this.data.description,
                arrivalTime: new Date(),
                originalPrice: this.data.original_price,
                discount: discount,
                stock: this.data.stock,
                images: storedImageURLs,
                videos: []
            });
            yield this.productsRepo.storeProduct(product);
        });
        this.getURLOfImages = (images) => __awaiter(this, void 0, void 0, function* () {
            const r = [];
            for (const image of images) {
                if (image.type == "url")
                    r.push(image.data);
                else if (image.type == "base64") {
                    const storedFileURL = yield this.storeImageInPublicFolder(image.data);
                    r.push(storedFileURL);
                }
            }
            return r;
        });
        this.storeImageInPublicFolder = (imageData) => __awaiter(this, void 0, void 0, function* () {
            const imageId = new bson_1.ObjectID().toString();
            const dirPath = `${__dirname}/../../../public/products/${this.id}/images`;
            const filePath = `${dirPath}/${imageId}.jpeg`;
            yield fs.mkdir(dirPath, { recursive: true });
            yield fs.writeFile(filePath, imageData, "base64");
            return `http://localhost:8000/products/${this.id}/images/${imageId}.jpeg`;
        });
        this.productsRepo = new mongo_products_repository_1.default();
        this.id = id;
        this.data = data;
    }
}
exports.default = StoreProductHelper;
