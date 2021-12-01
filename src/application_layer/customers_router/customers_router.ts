import * as express from "express";
import CartRepository from "../../infrastructure_layer/repositories/cart_repository/cart_repository";
import MongoCartRepository from "../../infrastructure_layer/repositories/cart_repository/mongo_cart_repository";
import Cart from "../../domain/models/cart";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import CartMapper from "../mappers/cart_mapper";
import CartPriceService from "../../domain/services/cart_price_service";
import CheckoutToken from "../../domain/models/checkout_token";
import CheckoutTokenRepository from "../../infrastructure_layer/repositories/checkout_token_repository/checkout_token_repository";
import MongoCheckoutTokenRepository from "../../infrastructure_layer/repositories/checkout_token_repository/mongo_checkout_token_repository";
import CheckoutTokenMapper from "../mappers/checkout_token_mapper";
import axios, { AxiosError, AxiosResponse } from "axios";
import Order from "../../domain/models/order";
import OrdersRepository from "../../infrastructure_layer/repositories/orders_repository/orders_repository";
import MongoOrdersRepository from "../../infrastructure_layer/repositories/orders_repository/mongo_orders_repository";
import OrderFromCheckoutTokenService from "../../domain/services/order_from_checkout_token_service";
import Product from "../../domain/models/product";
import UpdateInventoryOnOrderService from "../../domain/services/update_inventory_on_order_service";
import OrderMapper from "../mappers/order_mapper";
import VerifyPaymentService from "../../domain/services/verify_payment_service";


const productsRepo: ProductsRepository = new MongoProductsRepository();
const cartRepo: CartRepository = new MongoCartRepository();
const checkoutTokenRepo: CheckoutTokenRepository = new MongoCheckoutTokenRepository();
const ordersRepo: OrdersRepository = new MongoOrdersRepository();

const cartPriceService: CartPriceService = new CartPriceService();
const orderFromCheckoutTokenService: OrderFromCheckoutTokenService = new OrderFromCheckoutTokenService();
const updateInventoryOnOrderService: UpdateInventoryOnOrderService = new UpdateInventoryOnOrderService();
const verifyPaymentService: VerifyPaymentService = new VerifyPaymentService();

const cartMapper: CartMapper = new CartMapper();
const checkoutTokenMapper: CheckoutTokenMapper = new CheckoutTokenMapper();
const orderMapper: OrderMapper = new OrderMapper();

const customersRouter: express.Router = express.Router();

customersRouter.post(
  "/:user_id/cart/",
  async (req, res) => {
    console.log(`CustomLog:URL = ${req.url}`);

    const userId: string = req.params["user_id"];

    const cart: Cart = await cartRepo.getCart(userId);    
    cart.modifyCart(req.body.id, req.body.quantity);
    await cartRepo.storeCart(cart);

    res.send(await cartMapper.toClientCart(cart));
  }
);

customersRouter.get(
  "/:user_id/cart/",
  async (req, res) => {
    const userId: string = req.params["user_id"];    
    
    const cart: Cart = await cartRepo.getCart(userId);
    res.send(await cartMapper.toClientCart(cart));
  }
);

customersRouter.post(
  '/:user_id/checkout/',
  async (req, res) => {
    const userId: string = req.params["user_id"];

    const checkoutToken: CheckoutToken = await checkoutTokenRepo.createCheckoutToken(userId);
        
    res.send(await checkoutTokenMapper.toClientCheckoutToken(checkoutToken));    
  }
);

customersRouter.get(
  "/:user_id/checkout_tokens/:id",
  async (req, res) => {
    const userId: string = req.params["user_id"];
    const id: string = req.params["id"];
    
    const checkoutToken: CheckoutToken | null = await checkoutTokenRepo.getCheckoutToken(id, userId);
    if(checkoutToken == null) {
      res.status(404).send({"error" : "Not found"});
      return;
    }

    res.send(await checkoutTokenMapper.toClientCheckoutToken(checkoutToken));
  }
);

customersRouter.post(
  "/:user_id/checkout_tokens/:id/payment",
  async (req, res) => {
    const userId: string = req.params["user_id"];
    const id: string = req.params["id"];
    
    const checkoutToken: CheckoutToken | null = await checkoutTokenRepo.getCheckoutToken(id, userId);
    if(checkoutToken == null) {
      res.status(404).send({"error" : "Not found"});
      return;
    }

    const cart: Cart = await cartRepo.getCart(checkoutToken.userId);
    const price: number = await cartPriceService.getPrice(cart);

    const headers: any = {
      "authorization" : getEncodedAuthorizationHeader("rzp_test_1hrXSB3kRQMgLu", "T0oxxSPF9jgiUjT6onmL0Tif"),
    };

    let createOrderResponse: AxiosResponse;

    try {
      createOrderResponse = await axios.post(
        "https://api.razorpay.com/v1/orders/",
        {
          "amount" : price * 100,
          "currency" : "INR",
          "receipt" : "receipt#1",            
        },
        { 
          auth: {
            username: "rzp_test_1hrXSB3kRQMgLu",
            password: "T0oxxSPF9jgiUjT6onmL0Tif"
          }
        }
      );
    }
    catch(e: any) {
      const createOrderError: AxiosError = e;
            
      res.status(createOrderError.response!.status).send(createOrderError.response!.data);
      return;
    }

    res.send(createOrderResponse.data);
  }
);

customersRouter.post(
  "/:user_id/checkout_tokens/:id/capture",
  async (req, res) => {
    const userId: string = req.params["user_id"];
    const id: string = req.params["id"];    

    const orderId: string | null = req.body.order_id;
    const address: string = req.body.address;

    const checkoutToken: CheckoutToken | null = await checkoutTokenRepo.getCheckoutToken(id, userId);
    if(checkoutToken == null) {
      res.status(404).send({"error" : "Not found"});
      return;
    }

    // Verifying payment
    if(orderId != null) {
      const paymentSuccess: boolean = await verifyPaymentService.verifyPayment(orderId);
      
      if(!paymentSuccess) {
        res.status(400).send({error: "Payment wasn't success"});        
        return;
      }      
    }
    
    // Creating an order
    const order: Order = await orderFromCheckoutTokenService.toOrder(checkoutToken, address, orderId);
    
    // Updating Inventory
    const products: Product[] = await updateInventoryOnOrderService.updateInventory(order);
    
    // Resetting the cart
    const cart: Cart = await cartRepo.getCart(checkoutToken.userId);
    cart.reset();

    // Storing the new order in the database
    await ordersRepo.storeOrder(order);

    // Storing updated inventory products
    for(const product of products)
      await productsRepo.storeProduct(product);

    // Storing the resetted cart
    await cartRepo.storeCart(cart);

    // Deleting the checkout token
    await checkoutTokenRepo.deleteCheckoutToken(checkoutToken.userId, checkoutToken.id);
  
    res.send(orderMapper.toClientOrder(order));
  }
);

function getEncodedAuthorizationHeader(username: string, password: string): string {
  const encodedUsername: string = Buffer.from(username).toString("base64");
  const encodedPassword: string = Buffer.from(password).toString("base64");

  const r: string = `Basic ${encodedUsername}:${encodedPassword}`;
  return r;
}

export default customersRouter;