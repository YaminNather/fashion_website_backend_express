import Product from "../../../domain/models/product";
import SortBy from "./sort_by";

export interface Range<T> {
  min?: T;
  max?: T;
};

export interface Query {
  price?: Range<number>;
  arrival_time?: Range<Date>;
  categories?: string[];
}

export default abstract class ProductsRepository {
  public abstract storeProduct: (product: Product)=>Promise<void>;

  public abstract getAllProducts: (options?: {query?: Query, sortBy?: SortBy})=>Promise<Product[]>;

  public abstract getProduct: (id: string)=>Promise<Product | null>;
}