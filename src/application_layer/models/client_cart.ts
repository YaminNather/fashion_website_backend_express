import ClientProduct from "./client_product";
import ClientPrice from "./client_price";

export interface ClientCartItem {
  product: ClientProduct;
  quantity: number;

  original_price: ClientPrice;  
  final_price: ClientPrice;
}

export default interface ClientCart {
  user_id: string;
  items: ClientCartItem[];

  original_price: ClientPrice;
  final_price: ClientPrice;
}
