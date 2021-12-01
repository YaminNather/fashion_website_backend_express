import { ObjectID } from "bson";
import { Document } from "mongodb";
import { OrderItem } from "../../../domain/models/order";
import { Discount } from "../../../domain/models/product";

export default class OrderItemMapper {
  public toDomainModel = (document: Document) => {
    return new OrderItem({
      id: document["id"],
      productName: document["product_name"],
      brand: document["brand"],
      originalPrice: document["original_price"],
      discount: Discount.createIfNotNull(document["discount_type"], document["discount_amount"]),
      images: document["images"],
      quantity: document["quantity"]      
    });
  };

  public toDatabaseModel = (orderItem: OrderItem) => {
    return {
      "id" : orderItem.id,
      "product_name" : orderItem.productName,
      "brand" : orderItem.brand,
      "original_price" : orderItem.originalPrice,
      "discount_type" : (orderItem.discount != null) ? orderItem.discount.type : null,
      "discount_amount" : (orderItem.discount != null) ? orderItem.discount.amount : null,
      "images" : orderItem.images,
      "quantity" : orderItem.quantity
    };
  };
}