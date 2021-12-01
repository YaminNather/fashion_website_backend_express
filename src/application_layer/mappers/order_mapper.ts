import Order, { OrderItem } from "../../domain/models/order";
import ClientOrder, { ClientOrderItem } from "../models/client_order";
import { createClientPrice } from "../models/client_price";

export default class OrderMapper {
  public toClientOrder = (order: Order) => {
    const r: ClientOrder = {
      id: order.id,
      user_id: order.userId,
      items: order.items.map((item, index) => this.toClientOrderItem(item)),
      address: order.address,
      ordered_date: order.orderedDate,
      arrival_date: order.arrivalDate,
      original_price: createClientPrice(order.originalPrice()),
      final_price: createClientPrice(order.finalPrice()),
      order_status: order.orderStatus,
      payment_status: order.paymentStatus
    };

    return r;
  };

  private toClientOrderItem = (orderItem: OrderItem) => {
    const r: ClientOrderItem = {
      id: orderItem.id,
      product_name: orderItem.productName,
      brand: orderItem.brand,
      original_price: createClientPrice(orderItem.originalPrice),
      final_price: createClientPrice(orderItem.finalPrice()),
      images: [...orderItem.images],
      quantity: orderItem.quantity
    };

    return r;
  };
}