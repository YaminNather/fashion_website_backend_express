import CheckoutToken from "../../../domain/models/checkout_token";
import CheckoutTokenRepository from "./checkout_token_repository";
import database from "../../../mongodb";
import { ObjectID } from "bson";
import { Document, InsertOneResult } from "mongodb";

export default class MongoCheckoutTokenRepository extends CheckoutTokenRepository {
  public createCheckoutToken = async (userId: string) => {
    const insertResult: InsertOneResult = await database.collection("checkout_tokens").insertOne({ user_id: userId });

    return new CheckoutToken(insertResult.insertedId.toString(), userId);
  }

  public storeCheckoutToken = async (token: CheckoutToken) => {
    await database.collection("checkout_tokens").updateOne(
      { "_id": new ObjectID(token.id)},
      {
        $set: {
          "user_id" : token.userId,
        }
      },
      { upsert: true }
    );
  };

  public getCheckoutToken = async (id: string, userId: string) => {
    const document: Document | null = await database.collection("checkout_tokens").findOne(
      { "_id" : new ObjectID(id), "user_id" : userId }
    );

    if(document == null)
      return null;

    return new CheckoutToken(document["_id"].toString(), document["user_id"]);
  };

  public deleteCheckoutToken = async (userId: string, id: string) => {
    await database.collection("checkout_tokens").deleteOne({"_id" : new ObjectID(id)});
  };
}