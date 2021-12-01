import { OrderStatusOptions, PaymentStatusOptions } from "../../domain/models/order";
import ClientPrice from "./client_price";

export interface ClientOrderItem {
  id: string;
  product_name: string;
  brand: string;
  original_price: ClientPrice;
  final_price: ClientPrice;
  images: string[];
  quantity: number;
}

export default interface ClientOrder {
  id: string;
  user_id: string;
  items: ClientOrderItem[];
  final_price: ClientPrice;
  original_price: ClientPrice;
  address: string;
  ordered_date: Date;
  arrival_date: Date | null;
  payment_status: PaymentStatusOptions;
  order_status: OrderStatusOptions; 
}