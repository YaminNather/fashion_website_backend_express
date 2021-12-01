"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
function getStripe() {
    const apiKey = "sk_test_51JkTmBSHRuYM7AUm8T5AUtBN5nFLi6NVFF5L36YddGt1t93kS8t3TML7wz36vIeg5R7XToPNuYeOWiLDZVvVbr7S0063rpf0z1";
    const config = {
        apiVersion: "2020-08-27"
    };
    return new stripe_1.default(apiKey, config);
}
exports.default = getStripe;
