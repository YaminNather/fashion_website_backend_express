import Cart, { CartItem } from "../../domain/models/cart";
import Product from "../../domain/models/product";
import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import ClientCart, { ClientCartItem } from "../models/client_cart";
import { createClientPrice } from "../models/client_price";
import ClientProduct from "../models/client_product";
import { mapProductToClientProduct } from "../products_router/product_mapper";

export default class CartMapper {
  public toClientCart = async (cart: Cart) => {
    let originalPrice: number = 0;
    let finalPrice: number = 0;
    
    const clientCartItems: ClientCartItem[] = [];
    for(const cartItem of cart.getItems()) {
      const product: Product = await this.productsRepo.getProduct(cartItem.productId) as Product;
      clientCartItems.push(this.toClientCartItem(cartItem, product));
      
      originalPrice += product.originalPrice;
      finalPrice += product.getFinalPrice();
    }
      
    const r: ClientCart = {
      user_id: cart.userId,
      items: clientCartItems,
      original_price: createClientPrice(originalPrice),
      final_price: createClientPrice(finalPrice)
    };
    return r;
  }

  private toClientCartItem = (cartItem: CartItem, product: Product) => {
    const clientProduct: ClientProduct = mapProductToClientProduct(product);

    const rawCartItemOriginalPrice: number = product.originalPrice * cartItem.quantity;
    const rawCartItemFinalPrice: number = product.getFinalPrice() * cartItem.quantity;            

    const r: ClientCartItem = {
      product: clientProduct,
      quantity: cartItem.quantity,
      original_price: {
        raw: rawCartItemOriginalPrice,
        formatted_with_code: `${rawCartItemOriginalPrice}`,
        formatted_with_symbol: `$${rawCartItemOriginalPrice}`
      },                
      final_price: {
        raw: rawCartItemFinalPrice,
        formatted_with_code: `${rawCartItemFinalPrice}`,
        formatted_with_symbol: `$${rawCartItemFinalPrice}`
        
      }
    };

    return r;
  }

  private productsRepo: ProductsRepository = new MongoProductsRepository();
}