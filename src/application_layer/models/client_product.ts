import { ClientDiscount } from "./client_discount";
import ClientPrice from "./client_price";

export default interface ClientProduct {
  id: string;
  variant_of?: undefined;
  product_name: string;
  brand: string;
  description: string;
  
  discount: ClientDiscount | null;
  original_price: ClientPrice;
  discount_price: ClientPrice | null;
  final_price: ClientPrice;

  images: string[];
  videos: string[];
  
  arrival_time: Date;
  stock: number;  
}