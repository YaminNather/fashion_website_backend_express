"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express = __importStar(require("express"));
const mongo_cart_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository"));
const mongo_products_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/product_repository/mongo_products_repository"));
const cart_mapper_1 = __importDefault(require("../mappers/cart_mapper"));
const cart_price_service_1 = __importDefault(require("../../domain/services/cart_price_service"));
const mongo_checkout_token_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/checkout_token_repository/mongo_checkout_token_repository"));
const checkout_token_mapper_1 = __importDefault(require("../mappers/checkout_token_mapper"));
const axios_1 = __importDefault(require("axios"));
const mongo_orders_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/orders_repository/mongo_orders_repository"));
const order_from_checkout_token_service_1 = __importDefault(require("../../domain/services/order_from_checkout_token_service"));
const update_inventory_on_order_service_1 = __importDefault(require("../../domain/services/update_inventory_on_order_service"));
const order_mapper_1 = __importDefault(require("../mappers/order_mapper"));
const verify_payment_service_1 = __importDefault(require("../../domain/services/verify_payment_service"));
const productsRepo = new mongo_products_repository_1.default();
const cartRepo = new mongo_cart_repository_1.default();
const checkoutTokenRepo = new mongo_checkout_token_repository_1.default();
const ordersRepo = new mongo_orders_repository_1.default();
const cartPriceService = new cart_price_service_1.default();
const orderFromCheckoutTokenService = new order_from_checkout_token_service_1.default();
const updateInventoryOnOrderService = new update_inventory_on_order_service_1.default();
const verifyPaymentService = new verify_payment_service_1.default();
const cartMapper = new cart_mapper_1.default();
const checkoutTokenMapper = new checkout_token_mapper_1.default();
const orderMapper = new order_mapper_1.default();
const customersRouter = express.Router();
customersRouter.post("/:user_id/cart/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`CustomLog:URL = ${req.url}`);
    const userId = req.params["user_id"];
    const cart = yield cartRepo.getCart(userId);
    cart.modifyCart(req.body.id, req.body.quantity);
    yield cartRepo.storeCart(cart);
    res.send(yield cartMapper.toClientCart(cart));
}));
customersRouter.get("/:user_id/cart/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params["user_id"];
    const cart = yield cartRepo.getCart(userId);
    res.send(yield cartMapper.toClientCart(cart));
}));
customersRouter.post('/:user_id/checkout/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params["user_id"];
    const checkoutToken = yield checkoutTokenRepo.createCheckoutToken(userId);
    res.send(yield checkoutTokenMapper.toClientCheckoutToken(checkoutToken));
}));
customersRouter.get("/:user_id/checkout_tokens/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params["user_id"];
    const id = req.params["id"];
    const checkoutToken = yield checkoutTokenRepo.getCheckoutToken(id, userId);
    if (checkoutToken == null) {
        res.status(404).send({ "error": "Not found" });
        return;
    }
    res.send(yield checkoutTokenMapper.toClientCheckoutToken(checkoutToken));
}));
customersRouter.post("/:user_id/checkout_tokens/:id/payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params["user_id"];
    const id = req.params["id"];
    const checkoutToken = yield checkoutTokenRepo.getCheckoutToken(id, userId);
    if (checkoutToken == null) {
        res.status(404).send({ "error": "Not found" });
        return;
    }
    const cart = yield cartRepo.getCart(checkoutToken.userId);
    const price = yield cartPriceService.getPrice(cart);
    const headers = {
        "authorization": getEncodedAuthorizationHeader("rzp_test_1hrXSB3kRQMgLu", "T0oxxSPF9jgiUjT6onmL0Tif"),
    };
    let createOrderResponse;
    try {
        createOrderResponse = yield axios_1.default.post("https://api.razorpay.com/v1/orders/", {
            "amount": price * 100,
            "currency": "INR",
            "receipt": "receipt#1",
        }, {
            auth: {
                username: "rzp_test_1hrXSB3kRQMgLu",
                password: "T0oxxSPF9jgiUjT6onmL0Tif"
            }
        });
    }
    catch (e) {
        const createOrderError = e;
        res.status(createOrderError.response.status).send(createOrderError.response.data);
        return;
    }
    res.send(createOrderResponse.data);
}));
customersRouter.post("/:user_id/checkout_tokens/:id/capture", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params["user_id"];
    const id = req.params["id"];
    const orderId = req.body.order_id;
    const address = req.body.address;
    const checkoutToken = yield checkoutTokenRepo.getCheckoutToken(id, userId);
    if (checkoutToken == null) {
        res.status(404).send({ "error": "Not found" });
        return;
    }
    // Verifying payment
    if (orderId != null) {
        const paymentSuccess = yield verifyPaymentService.verifyPayment(orderId);
        if (!paymentSuccess) {
            res.status(400).send({ error: "Payment wasn't success" });
            return;
        }
    }
    // Creating an order
    const order = yield orderFromCheckoutTokenService.toOrder(checkoutToken, address, orderId);
    // Updating Inventory
    const products = yield updateInventoryOnOrderService.updateInventory(order);
    // Resetting the cart
    const cart = yield cartRepo.getCart(checkoutToken.userId);
    cart.reset();
    // Storing the new order in the database
    yield ordersRepo.storeOrder(order);
    // Storing updated inventory products
    for (const product of products)
        yield productsRepo.storeProduct(product);
    // Storing the resetted cart
    yield cartRepo.storeCart(cart);
    // Deleting the checkout token
    yield checkoutTokenRepo.deleteCheckoutToken(checkoutToken.userId, checkoutToken.id);
    res.send(orderMapper.toClientOrder(order));
}));
function getEncodedAuthorizationHeader(username, password) {
    const encodedUsername = Buffer.from(username).toString("base64");
    const encodedPassword = Buffer.from(password).toString("base64");
    const r = `Basic ${encodedUsername}:${encodedPassword}`;
    return r;
}
exports.default = customersRouter;
