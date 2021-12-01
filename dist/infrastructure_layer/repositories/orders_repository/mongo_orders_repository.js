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
const orders_repository_1 = __importDefault(require("./orders_repository"));
const mongo_order_mapper_1 = __importDefault(require("./mongo_order_mapper"));
class MongoOrdersRepository extends orders_repository_1.default {
    constructor() {
        super(...arguments);
        this.findOrder = (id) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.ordersCollection().findOne({ _id: new bson_1.ObjectID(id) });
            if (document == null)
                return null;
            return this.orderMapper.toDomainModel(document);
        });
        this.getOrders = () => __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.ordersCollection().find().toArray();
            return documents.map((value, index) => this.orderMapper.toDomainModel(value));
        });
        this.storeOrder = (order) => __awaiter(this, void 0, void 0, function* () {
            this.ordersCollection().updateOne({ "_id": new bson_1.ObjectID(order.id) }, { $set: this.orderMapper.toDBModel(order) }, { upsert: true });
        });
        this.ordersCollection = () => {
            return mongodb_1.default.collection("orders");
        };
        this.orderMapper = new mongo_order_mapper_1.default();
    }
}
exports.default = MongoOrdersRepository;
