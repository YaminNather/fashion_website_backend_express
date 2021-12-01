import Cart from "../../domain/models/cart";
import CheckoutToken from "../../domain/models/checkout_token";
import CartRepository from "../../infrastructure_layer/repositories/cart_repository/cart_repository";
import MongoCartRepository from "../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository";
import ClientCheckoutToken from "../models/client_checkout_token";
import CartMapper from "./cart_mapper";

export default class CheckoutTokenMapper {
  public toClientCheckoutToken = async (checkoutToken: CheckoutToken) => {
    const cart: Cart = await this.cartRepo.getCart(checkoutToken.userId);

    const r: ClientCheckoutToken = {
      id: checkoutToken.id,
      user_id: checkoutToken.userId,
      cart: await this.cartMapper.toClientCart(cart)
    };

    return r;
  };


  
  private cartRepo: CartRepository = new MongoCartRepository();
  private cartMapper: CartMapper = new CartMapper();
}