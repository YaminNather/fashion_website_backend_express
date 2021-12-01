import { Document } from "mongodb";
import ProductsRepository, { Query } from "./products_repository";
import MongoProductMapper from "./mongo_product_mapper";
import { ObjectID } from "bson";
import database from "../../../mongodb";
import Product from "../../../domain/models/product";
import MongoProductFromDocument from "./mongo_product_from_document";
import MongoGetAllProducts from "./mongo_get_all_products";
import SortBy from "./sort_by";

export default class MongoProductsRepository implements ProductsRepository {
  public storeProduct = async (product: Product) => {
    await database.collection("products").updateOne(
      { "_id" : new ObjectID(product.id) },
      { $set: this.mapper.toDBProduct(product) },
      { upsert: true }
    );
  };
  
  public getAllProducts = async (options?: {query?: Query, sortBy?: SortBy}) => {    
    const getAllProducts: MongoGetAllProducts = new MongoGetAllProducts(options);

    return await getAllProducts.getAllProducts();
  };
  
  public getProduct = async (id: string) => {
    const document: Document | null = await database.collection("products").findOne(
      { "_id" : new ObjectID(id) }
    );
    if(document == null)
      return null;
                
    return this.productFromDocument.productFromDocument(document);
  };
  
  
  private readonly productFromDocument: MongoProductFromDocument = new MongoProductFromDocument();
  private mapper: MongoProductMapper = new MongoProductMapper();
}