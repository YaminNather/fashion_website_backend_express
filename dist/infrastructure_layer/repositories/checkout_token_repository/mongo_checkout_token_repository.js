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
const checkout_token_1 = __importDefault(require("../../../domain/models/checkout_token"));
const checkout_token_repository_1 = __importDefault(require("./checkout_token_repository"));
const mongodb_1 = __importDefault(require("../../../mongodb"));
const bson_1 = require("bson");
class MongoCheckoutTokenRepository extends checkout_token_repository_1.default {
    constructor() {
        super(...arguments);
        this.createCheckoutToken = (userId) => __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongodb_1.default.collection("checkout_tokens").insertOne({ user_id: userId });
            return new checkout_token_1.default(insertResult.insertedId.toString(), userId);
        });
        this.storeCheckoutToken = (token) => __awaiter(this, void 0, void 0, function* () {
            yield mongodb_1.default.collection("checkout_tokens").updateOne({ "_id": new bson_1.ObjectID(token.id) }, {
                $set: {
                    "user_id": token.userId,
                }
            }, { upsert: true });
        });
        this.getCheckoutToken = (id, userId) => __awaiter(this, void 0, void 0, function* () {
            const document = yield mongodb_1.default.collection("checkout_tokens").findOne({ "_id": new bson_1.ObjectID(id), "user_id": userId });
            if (document == null)
                return null;
            return new checkout_token_1.default(document["_id"].toString(), document["user_id"]);
        });
        this.deleteCheckoutToken = (userId, id) => __awaiter(this, void 0, void 0, function* () {
            yield mongodb_1.default.collection("checkout_tokens").deleteOne({ "_id": new bson_1.ObjectID(id) });
        });
    }
}
exports.default = MongoCheckoutTokenRepository;
