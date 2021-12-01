import CheckoutToken from "../../../domain/models/checkout_token";

export default abstract class CheckoutTokenRepository {
  public abstract createCheckoutToken: (userId: string)=>Promise<CheckoutToken>;

  public abstract storeCheckoutToken: (token: CheckoutToken)=>Promise<void>;
  
  public abstract getCheckoutToken: (userId: string, id: string)=>Promise<CheckoutToken | null>;

  public abstract deleteCheckoutToken: (userId: string, id: string)=>Promise<void>;
}