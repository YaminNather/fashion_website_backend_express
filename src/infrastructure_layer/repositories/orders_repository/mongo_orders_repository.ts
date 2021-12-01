import { ObjectID } from "bson";
import { Document, InsertOneResult } from "mongodb";
import Order from "../../../domain/models/order";
import database from "../../../mongodb";
import OrdersRepository, { CreateOrderArgs } from "./orders_repository";
import OrderMapper from "./mongo_order_mapper";

export default class MongoOrdersRepository extends OrdersRepository {
  public findOrder = async (id: string) => {
    const document: Document | null = await this.ordersCollection().findOne({_id: new ObjectID(id)});
    if(document == null)
      return null;
      
    return this.orderMapper.toDomainModel(document);
  };

  public getOrders = async (): Promise<Order[]> => {
    const documents: Document[] = await this.ordersCollection().find().toArray();

    return documents.map<Order>((value, index) => this.orderMapper.toDomainModel(value));
  };

  public storeOrder = async (order: Order) => {
    this.ordersCollection().updateOne(
      { "_id" : new ObjectID(order.id) },
      { $set: this.orderMapper.toDBModel(order) },
      { upsert: true }
    );
  };

  private ordersCollection = () => {
    return database.collection("orders");
  }



  private readonly orderMapper = new OrderMapper();
}