import database from "../../../mongodb";
import cart, { CartItem } from "../../../domain/models/cart";
import CartRepository from "./cart_repository";
import { Document } from "mongodb";
import { ObjectID } from "bson";
import Cart from "../../../domain/models/cart";
import MongoProductsRepository from "../product_repository/mongo_products_repository";

export default class MongoCartRepository extends CartRepository {
  public storeCart = async (cart: Cart) => {
    const databaseItems = [];

    for(const item of cart.getItems()) {
      databaseItems.push(
        {
          "product_id" : item.productId,
          "quantity" : item.quantity
        }        
      );
    }

    await database.collection("carts").updateOne(
      { "_id" : new ObjectID(cart.userId) },
      { 
        $set: { "items" : databaseItems }
      },
      { upsert: true }
    );
  };

  public getCart = async (userId: string) => {
    const document: Document | null = await database.collection("carts").findOne({"_id" : new ObjectID(userId)});
    
    if(document == null)
      return new Cart(userId, []);            

    const cartItems: CartItem[] = [];
    for(const item of document["items"])
      cartItems.push(new CartItem(item["product_id"], item["quantity"]));
      
    return new Cart(userId, cartItems);
  };
}