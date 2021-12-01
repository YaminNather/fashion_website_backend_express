import ClientCart from "./client_cart";

export default interface ClientCheckoutToken {   
  id: string;
  user_id: string;
  cart: ClientCart;
}