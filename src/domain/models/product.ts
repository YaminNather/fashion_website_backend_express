export type DiscountTypeOptions = "percentage" | "cash";

export class Discount {
  public constructor(type: DiscountTypeOptions, amount: number) {
    this.type = type;
    this.amount = amount;
  }

  public static createIfNotNull(type: DiscountTypeOptions | null, amount: number | null): Discount | null {
    if(type == null)
      return null;

    return new Discount(type as DiscountTypeOptions, amount as number);
  }

  public applyOn(price: number): number {
    if(this.type == "cash")
      return this.amount;
    else if(this.type == "percentage")
      return price * this.amount/100;

    throw new Error("Discount is not cash or percentage");
  }
  
  
  type: DiscountTypeOptions;
  amount: number;
}

export default class Product {
  public constructor(args: {
      id: string,
      productName: string,
      brand: string,
      description: string,
      arrivalTime: Date,
      stock: number,
      originalPrice: number,
      discount?: Discount,
      images: string[],
      videos: string[],
      variantOf?: string
    }
  ) {
    this.id = args.id;
    this.productName = args.productName;
    this.brand = args.brand;
    this.description = args.description;
    this.arrivalTime = args.arrivalTime;
    this._stock = args.stock;
    this.originalPrice = args.originalPrice;    
    this.discount = args.discount ?? null;
    this.images = args.images;
    this.videos = args.videos;
    this.variantOf = args.variantOf ?? null;
  }

  public reduceStock(amount: number): void {
    if(this._stock - amount < 0)
      throw new Error("Product stock cannot be less than zero");

    this._stock -= amount;
  }

  public getDiscountPrice(): number {
    if(this.discount == null)
      return 0;
    
    if(this.discount.type == "cash")
      return this.discount.amount;
    else if(this.discount.type == "percentage")
      return this.discount.amount * (this.discount.amount/100);

    throw new Error(`Invalid discount type '${this.discount.type}'`);
  }

  public getFinalPrice(): number {
    return this.originalPrice - this.getDiscountPrice();
  }
  
  public get stock(): number {
    return this._stock;
  }
 

  
  public id: string;
  
  public productName: string;
  public brand: string;
  public description: string;

  public arrivalTime: Date;
  private _stock: number;

  public originalPrice: number;
  public discount: Discount | null;

  public images: string[];
  public videos: string[];
  public variantOf: string | null;
}