import Cart, { CartItem } from "./cart";
import { Discount } from "./product";

export class OrderItem {
  public constructor(args: {
    id: string;
    productName: string;
    brand: string;
    originalPrice: number
    discount: Discount | null,
    images: string[],
    quantity: number
  }) {
    this.id = args.id;
    this.productName = args.productName;
    this.brand = args.brand;
    this.originalPrice = args.originalPrice;
    this.discount = args.discount;
    this.images = [...args.images];
    this.quantity = args.quantity;
  }

  public finalPrice = () => {
    if(this.discount == null)
      return this.originalPrice;
    else
      return this.originalPrice - this.discount.applyOn(this.originalPrice);
  };


  public readonly id: string;
  public readonly productName: string;
  public readonly brand: string;
  public readonly originalPrice: number;
  public readonly discount: Discount | null;
  public readonly images: ReadonlyArray<string>;
  public readonly quantity: number;
}

export type PaymentStatusOptions = "ongoing" | "post_delivery" | "online";
export type OrderStatusOptions = "ongoing" | "cancelled" | "completed";

export default class Order {
  public constructor(args: {
    userId: string,
    id: string,
    items: ReadonlyArray<OrderItem>,
    address: string,
    orderedDate: Date,
    arrivalDate: Date | null,
    paymentStatus: PaymentStatusOptions,
    orderStatus: OrderStatusOptions
  }) {
    this.userId = args.userId;
    this.id = args.id;
    this.items = [...args.items];
    this.address = args.address;
    this.orderedDate = args.orderedDate;
    this._arrivalDate = args.arrivalDate;
    this._paymentStatus = args.paymentStatus;
    this._orderStatus = args.orderStatus;
  }

  public markOrderAsComplete(): void {
    if(this.orderStatus != "ongoing")
      throw new Error("Order already confirmed or cancelled");

    if(this.paymentStatus == "ongoing")
      this._paymentStatus = "post_delivery";

    this._orderStatus = "completed";    
  }

  public originalPrice(): number {
    let r: number = 0;

    for(const item of this.items)
      r += item.originalPrice;

    return r;
  }

  public finalPrice(): number {
    let r: number = 0;

    for(const item of this.items)
      r += item.finalPrice();

    return r;
  }  

  public get arrivalDate(): Date | null {
    return this._arrivalDate;
  }

  public get paymentStatus(): PaymentStatusOptions {
    return this._paymentStatus;
  }

  public get orderStatus(): OrderStatusOptions {
    return this._orderStatus;
  }
  

  public readonly userId: string;
  public readonly id: string;
  public readonly items: ReadonlyArray<OrderItem>;
  public readonly address: string;
  public readonly orderedDate: Date;
  private _arrivalDate: Date | null;
  private _paymentStatus: PaymentStatusOptions;
  private _orderStatus: OrderStatusOptions;
}