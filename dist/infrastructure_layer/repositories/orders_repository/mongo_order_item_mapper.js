"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../../domain/models/order");
const product_1 = require("../../../domain/models/product");
class OrderItemMapper {
    constructor() {
        this.toDomainModel = (document) => {
            return new order_1.OrderItem({
                id: document["id"],
                productName: document["product_name"],
                brand: document["brand"],
                originalPrice: document["original_price"],
                discount: product_1.Discount.createIfNotNull(document["discount_type"], document["discount_amount"]),
                images: document["images"],
                quantity: document["quantity"]
            });
        };
        this.toDatabaseModel = (orderItem) => {
            return {
                "id": orderItem.id,
                "product_name": orderItem.productName,
                "brand": orderItem.brand,
                "original_price": orderItem.originalPrice,
                "discount_type": (orderItem.discount != null) ? orderItem.discount.type : null,
                "discount_amount": (orderItem.discount != null) ? orderItem.discount.amount : null,
                "images": orderItem.images,
                "quantity": orderItem.quantity
            };
        };
    }
}
exports.default = OrderItemMapper;
