import * as express from "express";
import Order from "../../domain/models/order";
import MongoOrdersRepository from "../../infrastructure_layer/repositories/orders_repository/mongo_orders_repository";
import OrdersRepository from "../../infrastructure_layer/repositories/orders_repository/orders_repository";
import OrderMapper from "../mappers/order_mapper";
import ClientOrder from "../models/client_order";

const ordersRouter: express.Router = express.Router();

const ordersRepo: OrdersRepository = new MongoOrdersRepository();
const orderMapper: OrderMapper = new OrderMapper();

ordersRouter.get(
  "/",
  async (req, res) => {
    const orders: Order[] = await ordersRepo.getOrders();
    
    const clientOrders: ClientOrder[] = orders.map<ClientOrder>((order) => orderMapper.toClientOrder(order));

    res.send(clientOrders);
  }
);

ordersRouter.get(
  "/:id",
  async (req, res) => {
    const id: string = req.params["id"];

    const order: Order | null = await ordersRepo.findOrder(id);
    if(order == null) {
      res.status(400).send({"error" : "Cannot find order"});
      return;
    }
    
    const clientOrder: ClientOrder = orderMapper.toClientOrder(order);

    res.send(clientOrder);
  }
);

ordersRouter.post(
  "/:id/confirm",
  async (req, res) => {
    const id: string = req.params["id"];

    const order: Order | null = await ordersRepo.findOrder(id);
    if(order == null) {
      res.status(400).send({error: `Couldn't find order with id ${id}`});
      return;
    }

    order.markOrderAsComplete();

    await ordersRepo.storeOrder(order);

    res.send(orderMapper.toClientOrder(order));
  }
);

export default ordersRouter;