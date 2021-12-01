import { ObjectID } from "bson";
import { Document } from "mongodb";
import Order from "../../../domain/models/order";
import OrderItemMapper from "./mongo_order_item_mapper";

export default class OrderMapper {
  public toDomainModel = (document: Document) => {
    return new Order({
      id: document["_id"].toString(),
      userId: document["user_id"],
      items: document["items"].map((value: any) => this.orderItemMapper.toDomainModel(value)),
      address: document["address"],
      orderedDate: document["ordered_date"],
      arrivalDate: document["arrival_date"],
      paymentStatus: document["payment_status"],
      orderStatus: document["order_status"]
    });
  };

  public toDBModel = (order: Order) => {
    return {
      "_id" : new ObjectID(order.id),
      "user_id" : order.userId,
      "items" : order.items.map((item) => this.orderItemMapper.toDatabaseModel(item)),
      "address" : order.address,
      "ordered_date" : order.orderedDate,
      "arrival_date" : order.arrivalDate,
      "payment_status" : order.paymentStatus,
      "order_status" : order.orderStatus
    };
  };

  
  private readonly orderItemMapper = new OrderItemMapper();
}