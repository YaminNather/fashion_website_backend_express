class InternalCartItem {
  public constructor(productId: string, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }

  public isSameIdentity = (other: InternalCartItem) => {
    return other.productId == this.productId;
  }
  

  public readonly productId: string;
  public quantity: number;
}

export class CartItem {
  public constructor(productId: string, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }  
 
  public isSameIdentity = (other: CartItem) => {
    return other.productId == this.productId;
  }
  

  public readonly productId: string;
  public readonly quantity: number;
}


export default class Cart {
  public constructor(userId: string, items: CartItem[]) {
    this.userId = userId;
    this.items = Cart.mapToInternalCartItems(items);
  }

  public isSameIdentity = (other: Cart) => {
    return this.userId == other.userId;
  }

  public modifyCart = (productId: string, quantity: number) => {
    if(quantity < 0)
      throw new Error(`Quantity is ${quantity}, but it cannot be < 0`);    

    const existingItemIndex: number = this.items.findIndex((value, index) => value.productId == productId);

    if(quantity == 0 && existingItemIndex != -1) {      
      this.items.splice(existingItemIndex, 1);
      return;
    }

    if(existingItemIndex == -1)      
      this.items.push(new InternalCartItem(productId, quantity));    
    else
      this.items[existingItemIndex].quantity = quantity;
  };

  public reset = () => {
    this.items = [];
  };

  public getItems = () => {
    return Cart.mapToCartItems(this.items);
  };  

  public static mapToInternalCartItems(cartItems: CartItem[]) {
    return cartItems.map((item) => new InternalCartItem(item.productId, item.quantity));
  }

  public static mapToCartItems(internalCartItems: InternalCartItem[]) {
    return internalCartItems.map( (item) => new CartItem(item.productId, item.quantity) );
  }


  public readonly userId: string;
  private items: InternalCartItem[];
}