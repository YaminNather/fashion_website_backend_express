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
const express_1 = require("express");
const product_1 = __importStar(require("../../domain/models/product"));
const mapper = __importStar(require("./product_mapper"));
const mongo_products_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/mongo_products_repository"));
const bson_1 = require("bson");
const fs = __importStar(require("fs/promises"));
const store_product_helper_1 = __importDefault(require("./store_product_helper"));
const mongo_categories_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/categories_repository/mongo_categories_repository"));
const sort_by_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/sort_by"));
const productsRepository = new mongo_products_repository_1.default();
const categoriesRepo = new mongo_categories_repository_1.default();
const productRouter = express_1.Router();
productRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`CustomLog: Get Request = /api/products/:id, id=${req.params["id"]}`);
    const product = yield productsRepository.getProduct(req.params["id"]);
    if (product == null) {
        res.status(404).send(`Product with id ${req.params["id"]} not found`);
        return;
    }
    res.send(mapper.mapProductToClientProduct(product));
}));
productRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`CustomLog: GET request - ${req.url}`);
    const minPrice = (req.query["min_price"] != undefined) ? parseFloat(req.query["min_price"]) : undefined;
    const maxPrice = (req.query["max_price"] != undefined) ? parseFloat(req.query["max_price"]) : undefined;
    const minTime = (req.query["min_time"] != undefined) ? new Date(`${req.query["min_time"]} 00:00:00`) : undefined;
    const maxTime = (req.query["max_time"] != undefined) ? new Date(`${req.query["max_time"]} 00:00:00`) : undefined;
    let categories;
    if (req.query["categories"] != undefined) {
        if (typeof req.query["categories"] == "string")
            categories = [req.query["categories"]];
        else
            categories = req.query["categories"];
        for (let i = categories.length - 1; i >= 0; i--) {
            let category = yield categoriesRepo.getCategoryByName(categories[i]);
            if (category == null)
                categories.pop();
            else
                categories[i] = category.id;
        }
    }
    let sortBy;
    if (req.query["sort_field"] != undefined)
        sortBy = new sort_by_1.default(req.query["sort_field"], { direction: req.query["sort_direction"] });
    const products = yield productsRepository.getAllProducts({
        query: {
            price: { min: minPrice, max: maxPrice },
            arrival_time: { min: minTime, max: maxTime },
            categories: categories
        },
        sortBy: sortBy
    });
    const responseMessage = [];
    for (const product of products)
        responseMessage.push(mapper.mapProductToClientProduct(product));
    res.send(responseMessage);
}));
productRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeProductHelper = new store_product_helper_1.default(new bson_1.ObjectID().toString(), req.body);
    yield storeProductHelper.storeProduct();
    res.send();
}));
productRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params["id"];
    const storeProductHelper = new store_product_helper_1.default(id, req.body);
    yield storeProductHelper.storeProduct();
    res.send();
}));
function upsertRequestProductToDomainProduct(id, upsertRequestProduct) {
    return __awaiter(this, void 0, void 0, function* () {
        const storedImageURLs = [];
        for (let i = 0; i < upsertRequestProduct.images.length; i++) {
            const dirPath = `${__dirname}/../../../public/products/${id}/images`;
            const filePath = `${dirPath}/${i}.jpeg`;
            yield fs.mkdir(dirPath, { recursive: true });
            yield fs.writeFile(filePath, upsertRequestProduct.images[i], "base64");
            storedImageURLs.push(`http://localhost:8000/products/${id}/images/${i}.jpeg`);
        }
        let discount;
        if (upsertRequestProduct.discount != null)
            discount = new product_1.Discount(upsertRequestProduct.discount, upsertRequestProduct.amount);
        else
            discount = undefined;
        return new product_1.default({
            id: id,
            productName: upsertRequestProduct.product_name,
            brand: upsertRequestProduct.brand,
            description: upsertRequestProduct.description,
            arrivalTime: new Date(),
            originalPrice: upsertRequestProduct.original_price,
            discount: discount,
            stock: upsertRequestProduct.stock,
            images: storedImageURLs,
            videos: []
        });
    });
}
exports.default = productRouter;
