import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import Cart from "../models/cart";
import Product from "../models/product";

export default class CartPriceService {
  public getPrice = async (cart: Cart) => {
    let r: number = 0;
    for(const cartItem of cart.getItems()) {
      const product: Product = await this.productsRepo.getProduct(cartItem.productId) as Product;
      
      r += product.getFinalPrice();
    }

    return r;
  }


  private productsRepo: ProductsRepository = new MongoProductsRepository();
}