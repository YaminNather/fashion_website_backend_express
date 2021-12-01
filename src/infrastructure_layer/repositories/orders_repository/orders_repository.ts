import Order, { OrderItem, OrderStatusOptions, PaymentStatusOptions } from "../../../domain/models/order";
import { Discount } from "../../../domain/models/product";

export interface CreateOrderItemArgs {
  productName: string;
  brand: string;
  originalPrice: string;
  discount: Discount | null;
  images: string[],
  quantity: number
}

export interface CreateOrderArgs {
  userId: string;
  items: OrderItem[];
  address: string;
  orderedDate: Date;
  arrivalDate: Date;
  paymentStatus: PaymentStatusOptions;
  orderStatus: OrderStatusOptions;
}

export default abstract class OrdersRepository {
  public abstract findOrder: (id: string)=>Promise<Order | null>;
  
  public abstract getOrders: () => Promise<Order[]>;

  public abstract storeOrder: (order: Order)=>Promise<void>;

}