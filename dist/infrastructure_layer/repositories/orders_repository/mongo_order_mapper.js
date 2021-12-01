"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const order_1 = __importDefault(require("../../../domain/models/order"));
const mongo_order_item_mapper_1 = __importDefault(require("./mongo_order_item_mapper"));
class OrderMapper {
    constructor() {
        this.toDomainModel = (document) => {
            return new order_1.default({
                id: document["_id"].toString(),
                userId: document["user_id"],
                items: document["items"].map((value) => this.orderItemMapper.toDomainModel(value)),
                address: document["address"],
                orderedDate: document["ordered_date"],
                arrivalDate: document["arrival_date"],
                paymentStatus: document["payment_status"],
                orderStatus: document["order_status"]
            });
        };
        this.toDBModel = (order) => {
            return {
                "_id": new bson_1.ObjectID(order.id),
                "user_id": order.userId,
                "items": order.items.map((item) => this.orderItemMapper.toDatabaseModel(item)),
                "address": order.address,
                "ordered_date": order.orderedDate,
                "arrival_date": order.arrivalDate,
                "payment_status": order.paymentStatus,
                "order_status": order.orderStatus
            };
        };
        this.orderItemMapper = new mongo_order_item_mapper_1.default();
    }
}
exports.default = OrderMapper;
