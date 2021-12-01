"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discount = void 0;
class Discount {
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
    }
    static createIfNotNull(type, amount) {
        if (type == null)
            return null;
        return new Discount(type, amount);
    }
    applyOn(price) {
        if (this.type == "cash")
            return this.amount;
        else if (this.type == "percentage")
            return price * this.amount / 100;
        throw new Error("Discount is not cash or percentage");
    }
}
exports.Discount = Discount;
class Product {
    constructor(args) {
        var _a, _b;
        this.id = args.id;
        this.productName = args.productName;
        this.brand = args.brand;
        this.description = args.description;
        this.arrivalTime = args.arrivalTime;
        this._stock = args.stock;
        this.originalPrice = args.originalPrice;
        this.discount = (_a = args.discount) !== null && _a !== void 0 ? _a : null;
        this.images = args.images;
        this.videos = args.videos;
        this.variantOf = (_b = args.variantOf) !== null && _b !== void 0 ? _b : null;
    }
    reduceStock(amount) {
        if (this._stock - amount < 0)
            throw new Error("Product stock cannot be less than zero");
        this._stock -= amount;
    }
    getDiscountPrice() {
        if (this.discount == null)
            return 0;
        if (this.discount.type == "cash")
            return this.discount.amount;
        else if (this.discount.type == "percentage")
            return this.discount.amount * (this.discount.amount / 100);
        throw new Error(`Invalid discount type '${this.discount.type}'`);
    }
    getFinalPrice() {
        return this.originalPrice - this.getDiscountPrice();
    }
    get stock() {
        return this._stock;
    }
}
exports.default = Product;
