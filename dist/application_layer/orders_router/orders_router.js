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
const mongo_orders_repository_1 = __importDefault(require("../../infrastructure_layer/repositories/orders_repository/mongo_orders_repository"));
const order_mapper_1 = __importDefault(require("../mappers/order_mapper"));
const ordersRouter = express.Router();
const ordersRepo = new mongo_orders_repository_1.default();
const orderMapper = new order_mapper_1.default();
ordersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield ordersRepo.getOrders();
    const clientOrders = orders.map((order) => orderMapper.toClientOrder(order));
    res.send(clientOrders);
}));
ordersRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params["id"];
    const order = yield ordersRepo.findOrder(id);
    if (order == null) {
        res.status(400).send({ "error": "Cannot find order" });
        return;
    }
    const clientOrder = orderMapper.toClientOrder(order);
    res.send(clientOrder);
}));
ordersRouter.post("/:id/confirm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params["id"];
    const order = yield ordersRepo.findOrder(id);
    if (order == null) {
        res.status(400).send({ error: `Couldn't find order with id ${id}` });
        return;
    }
    order.markOrderAsComplete();
    yield ordersRepo.storeOrder(order);
    res.send(orderMapper.toClientOrder(order));
}));
exports.default = ordersRouter;
