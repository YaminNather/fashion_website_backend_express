import Product from "../../../domain/models/product";
import database from "../../../mongodb";
import { Query } from "./products_repository";
import { Document } from "mongodb";
import MongoProductFromDocument from "./mongo_product_from_document";
import SortBy from "./sort_by";

export default class MongoGetAllProducts {
  public constructor(options?: {query?: Query, sortBy?: SortBy}) {
    if(options == undefined)
      return;
      
    this.query = options.query;
    this.sortBy = options.sortBy;
  }

  public getAllProducts = async (): Promise<Product[]> => {
    var r: Product[] = [];

    const documents: Document[] = await database.collection("products").find(this.makeMongoQuery()).sort(this.getSort()).toArray();     

    for(const document of documents)
      r.push(await this.productFromDocument.productFromDocument(document));

    return r;
  }

  private makeMongoQuery = ():any => {
    let mainQuery: { [key: string]: any } = {};
    if(this.query != undefined) {
      if(this.query.price != undefined) {
        if(this.query.price.min != undefined)
          mainQuery["original_price"] = { "$gte" : this.query.price.min };
        
        if(this.query.price.max != undefined)
          mainQuery["original_price"] = { "$lte" : this.query.price.max };
      }
      
      if(this.query.arrival_time != undefined) {
        if(this.query.arrival_time.min != undefined)
          mainQuery["arrival_time"] = { "$gte" : this.query.arrival_time.min };
        
        if(this.query.arrival_time.max != undefined)
          mainQuery["arrival_time"] = { "$lte" : this.query.arrival_time.max };
      }

      // if(this.query.categories != undefined)
      //   mainQuery["categories"] = this.query.categories;

      if(this.query.categories != undefined) {
        mainQuery["$and"] = this.query.categories.map(
          (category) => {
            return {
              "categories" : {
                "$in" : [category]
              }
            }
          }
        );
      }
    }

    return mainQuery;
  }

  private getSort = ():any | undefined => {
    if(this.sortBy == undefined)
      return undefined;

    return { [`${this.sortBy.field}`] : this.sortBy.direction };
  };

  
  private readonly query?: Query;
  private readonly sortBy?: SortBy;

  private readonly productFromDocument: MongoProductFromDocument = new MongoProductFromDocument();
}