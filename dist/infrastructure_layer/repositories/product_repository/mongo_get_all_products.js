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
const mongo_product_from_document_1 = __importDefault(require("./mongo_product_from_document"));
class MongoGetAllProducts {
    constructor(options) {
        this.getAllProducts = () => __awaiter(this, void 0, void 0, function* () {
            var r = [];
            const documents = yield mongodb_1.default.collection("products").find(this.makeMongoQuery()).sort(this.getSort()).toArray();
            for (const document of documents)
                r.push(yield this.productFromDocument.productFromDocument(document));
            return r;
        });
        this.makeMongoQuery = () => {
            let mainQuery = {};
            if (this.query != undefined) {
                if (this.query.price != undefined) {
                    if (this.query.price.min != undefined)
                        mainQuery["original_price"] = { "$gte": this.query.price.min };
                    if (this.query.price.max != undefined)
                        mainQuery["original_price"] = { "$lte": this.query.price.max };
                }
                if (this.query.arrival_time != undefined) {
                    if (this.query.arrival_time.min != undefined)
                        mainQuery["arrival_time"] = { "$gte": this.query.arrival_time.min };
                    if (this.query.arrival_time.max != undefined)
                        mainQuery["arrival_time"] = { "$lte": this.query.arrival_time.max };
                }
                // if(this.query.categories != undefined)
                //   mainQuery["categories"] = this.query.categories;
                if (this.query.categories != undefined) {
                    mainQuery["$and"] = this.query.categories.map((category) => {
                        return {
                            "categories": {
                                "$in": [category]
                            }
                        };
                    });
                }
            }
            return mainQuery;
        };
        this.getSort = () => {
            if (this.sortBy == undefined)
                return undefined;
            return { [`${this.sortBy.field}`]: this.sortBy.direction };
        };
        this.productFromDocument = new mongo_product_from_document_1.default();
        if (options == undefined)
            return;
        this.query = options.query;
        this.sortBy = options.sortBy;
    }
}
exports.default = MongoGetAllProducts;
