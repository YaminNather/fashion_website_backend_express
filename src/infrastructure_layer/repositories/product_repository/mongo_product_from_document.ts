import { ObjectID } from "bson";
import { Document } from "mongodb";
import database from "../../../mongodb";
import MongoProductMapper from "./mongo_product_mapper";

export default class MongoProductFromDocument {
  public productFromDocument = async (document: Document) => {
    if(document["variant_of"] == undefined) {
      return this.mapper.mapProduct(document);
    }
    else {
      const baseDocument: Document | null = await database.collection("products").findOne(
        { "_id": new ObjectID(document.variant_of) }
      );
      
      if(baseDocument == null)
        throw new Error("Document not found");

      return this.mapper.mapProductVariant(document, baseDocument);
    }
  };


  private mapper: MongoProductMapper = new MongoProductMapper();
}