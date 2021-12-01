import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import Order from "../models/order";
import Product from "../models/product";

export default class UpdateInventoryOnOrderService {
  public updateInventory = async (order: Order) => {
    const products: Product[] = [];
    for(const orderItem of order.items) {
      const product: Product = await this.productsRepo.getProduct(orderItem.id) as Product;
      product.reduceStock(orderItem.quantity);

      products.push(product);
    }

    return products;
  }


  private productsRepo: ProductsRepository = new MongoProductsRepository();
}