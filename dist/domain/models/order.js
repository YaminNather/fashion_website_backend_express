"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
class OrderItem {
    constructor(args) {
        this.finalPrice = () => {
            if (this.discount == null)
                return this.originalPrice;
            else
                return this.originalPrice - this.discount.applyOn(this.originalPrice);
        };
        this.id = args.id;
        this.productName = args.productName;
        this.brand = args.brand;
        this.originalPrice = args.originalPrice;
        this.discount = args.discount;
        this.images = [...args.images];
        this.quantity = args.quantity;
    }
}
exports.OrderItem = OrderItem;
class Order {
    constructor(args) {
        this.userId = args.userId;
        this.id = args.id;
        this.items = [...args.items];
        this.address = args.address;
        this.orderedDate = args.orderedDate;
        this._arrivalDate = args.arrivalDate;
        this._paymentStatus = args.paymentStatus;
        this._orderStatus = args.orderStatus;
    }
    markOrderAsComplete() {
        if (this.orderStatus != "ongoing")
            throw new Error("Order already confirmed or cancelled");
        if (this.paymentStatus == "ongoing")
            this._paymentStatus = "post_delivery";
        this._orderStatus = "completed";
    }
    originalPrice() {
        let r = 0;
        for (const item of this.items)
            r += item.originalPrice;
        return r;
    }
    finalPrice() {
        let r = 0;
        for (const item of this.items)
            r += item.finalPrice();
        return r;
    }
    get arrivalDate() {
        return this._arrivalDate;
    }
    get paymentStatus() {
        return this._paymentStatus;
    }
    get orderStatus() {
        return this._orderStatus;
    }
}
exports.default = Order;
