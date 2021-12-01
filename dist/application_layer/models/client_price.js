"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientPrice = void 0;
function createClientPrice(raw) {
    const r = {
        raw: raw,
        formatted_with_code: `${raw} INR`,
        formatted_with_symbol: `Rs.${raw}`
    };
    return r;
}
exports.createClientPrice = createClientPrice;
