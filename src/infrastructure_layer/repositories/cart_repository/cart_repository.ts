import Cart from "../../../domain/models/cart";

export default abstract class CartRepository {
  public abstract storeCart: (cart: Cart)=>Promise<void>;

  public abstract getCart: (userId: string)=>Promise<Cart>;
}