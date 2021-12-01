"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
class InternalCartItem {
    constructor(productId, quantity) {
        this.isSameIdentity = (other) => {
            return other.productId == this.productId;
        };
        this.productId = productId;
        this.quantity = quantity;
    }
}
class CartItem {
    constructor(productId, quantity) {
        this.isSameIdentity = (other) => {
            return other.productId == this.productId;
        };
        this.productId = productId;
        this.quantity = quantity;
    }
}
exports.CartItem = CartItem;
class Cart {
    constructor(userId, items) {
        this.isSameIdentity = (other) => {
            return this.userId == other.userId;
        };
        this.modifyCart = (productId, quantity) => {
            if (quantity < 0)
                throw new Error(`Quantity is ${quantity}, but it cannot be < 0`);
            const existingItemIndex = this.items.findIndex((value, index) => value.productId == productId);
            if (quantity == 0 && existingItemIndex != -1) {
                this.items.splice(existingItemIndex, 1);
                return;
            }
            if (existingItemIndex == -1)
                this.items.push(new InternalCartItem(productId, quantity));
            else
                this.items[existingItemIndex].quantity = quantity;
        };
        this.reset = () => {
            this.items = [];
        };
        this.getItems = () => {
            return Cart.mapToCartItems(this.items);
        };
        this.userId = userId;
        this.items = Cart.mapToInternalCartItems(items);
    }
    static mapToInternalCartItems(cartItems) {
        return cartItems.map((item) => new InternalCartItem(item.productId, item.quantity));
    }
    static mapToCartItems(internalCartItems) {
        return internalCartItems.map((item) => new CartItem(item.productId, item.quantity));
    }
}
exports.default = Cart;
