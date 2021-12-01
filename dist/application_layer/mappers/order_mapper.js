"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_price_1 = require("../models/client_price");
class OrderMapper {
    constructor() {
        this.toClientOrder = (order) => {
            const r = {
                id: order.id,
                user_id: order.userId,
                items: order.items.map((item, index) => this.toClientOrderItem(item)),
                address: order.address,
                ordered_date: order.orderedDate,
                arrival_date: order.arrivalDate,
                original_price: client_price_1.createClientPrice(order.originalPrice()),
                final_price: client_price_1.createClientPrice(order.finalPrice()),
                order_status: order.orderStatus,
                payment_status: order.paymentStatus
            };
            return r;
        };
        this.toClientOrderItem = (orderItem) => {
            const r = {
                id: orderItem.id,
                product_name: orderItem.productName,
                brand: orderItem.brand,
                original_price: client_price_1.createClientPrice(orderItem.originalPrice),
                final_price: client_price_1.createClientPrice(orderItem.finalPrice()),
                images: [...orderItem.images],
                quantity: orderItem.quantity
            };
            return r;
        };
    }
}
exports.default = OrderMapper;
