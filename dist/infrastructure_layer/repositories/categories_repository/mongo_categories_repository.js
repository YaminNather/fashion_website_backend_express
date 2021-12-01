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
const category_1 = __importDefault(require("../../../domain/models/category"));
const categories_repository_1 = __importDefault(require("./categories_repository"));
const mongodb_1 = __importDefault(require("../../../mongodb"));
const bson_1 = require("bson");
class MongoCategoriesRepository extends categories_repository_1.default {
    constructor() {
        super(...arguments);
        this.getCategoryByName = (name) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.collection().findOne({ "name": name });
            if (document == null)
                return null;
            return this.mapToDomainModel(document);
        });
        this.getCategoryById = (id) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.collection().findOne({ "_id": new bson_1.ObjectID(id) });
            if (document == null)
                return null;
            return this.mapToDomainModel(document);
        });
        this.storeCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            yield this.collection().updateMany({ "_id": new bson_1.ObjectID(category.id) }, {
                $set: { "name": category.categoryName }
            }, { upsert: true });
        });
        this.removeCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            yield this.collection().deleteMany({ "_id": new bson_1.ObjectID(category.id) });
        });
        this.collection = () => {
            return mongodb_1.default.collection("categories");
        };
        this.mapToDomainModel = (document) => {
            return new category_1.default(document["_id"].toString(), document["category_name"]);
        };
    }
}
exports.default = MongoCategoriesRepository;
