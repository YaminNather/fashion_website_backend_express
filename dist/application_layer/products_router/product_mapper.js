"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProductToClientProduct = void 0;
function mapProductToClientProduct(product) {
    var discount;
    if (product.discount != null) {
        discount = {
            type: product.discount.type,
            amount: product.discount.amount,
            formatted: (product.discount.type == "cash") ? `$${product.discount.amount}` : `${product.discount.amount}%`
        };
    }
    else
        discount = null;
    return {
        id: product.id,
        product_name: product.productName,
        brand: product.brand,
        description: product.description,
        discount: discount,
        original_price: {
            raw: product.originalPrice,
            formatted_with_code: `${product.originalPrice} INR`,
            formatted_with_symbol: `$${product.originalPrice}`
        },
        discount_price: {
            raw: product.getDiscountPrice(),
            formatted_with_code: `${product.getDiscountPrice()} INR`,
            formatted_with_symbol: `$${product.getDiscountPrice()}`
        },
        final_price: {
            raw: product.getFinalPrice(),
            formatted_with_code: `${product.getFinalPrice()} INR`,
            formatted_with_symbol: `$${product.getFinalPrice()}`
        },
        arrival_time: product.arrivalTime,
        images: product.images,
        videos: product.videos,
        stock: product.stock
    };
}
exports.mapProductToClientProduct = mapProductToClientProduct;
