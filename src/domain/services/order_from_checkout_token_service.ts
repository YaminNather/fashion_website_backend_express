import CartRepository from "../../infrastructure_layer/repositories/cart_repository/cart_repository";
import MongoCartRepository from "../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository";
import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import Cart, { CartItem } from "../models/cart";
import CheckoutToken from "../models/checkout_token";
import Order, { OrderItem, PaymentStatusOptions } from "../models/order";
import Product from "../models/product";
import { ObjectID } from "bson";

export default class OrderFromCheckoutTokenService {
  public toOrder = async (checkoutToken: CheckoutToken, address: string, paymentId: string | null) => {
    const cart: Cart = await this.cartRepo.getCart(checkoutToken.userId);

    const orderItems: OrderItem[] = [];
    for(const cartItem of cart.getItems())
      orderItems.push(await this.toOrderItem(cartItem));
      
    return new Order({
      id: new ObjectID().toString(),
      userId: checkoutToken.userId,
      address: address,
      orderedDate: new Date(),
      arrivalDate: null,
      items: orderItems,
      orderStatus: "ongoing",
      paymentStatus: (paymentId != null) ? "online" : "ongoing",
    });
  };

  private toOrderItem = async (cartItem: CartItem) => {
    const product: Product = await this.productsRepo.getProduct(cartItem.productId) as Product;

    return new OrderItem({
      id: product.id,
      brand: product.brand,
      discount: product.discount,
      images: product.images,
      originalPrice: product.originalPrice,
      productName: product.productName,
      quantity: cartItem.quantity
    });
  };


  private readonly productsRepo: ProductsRepository = new MongoProductsRepository();
  private readonly cartRepo: CartRepository = new MongoCartRepository();
}