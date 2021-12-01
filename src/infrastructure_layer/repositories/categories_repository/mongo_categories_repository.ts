import Category from "../../../domain/models/category";
import CategoriesRepository from "./categories_repository";
import { Collection, Document } from "mongodb";
import database from "../../../mongodb";
import { ObjectID } from "bson";

export default class MongoCategoriesRepository extends CategoriesRepository {
  public getCategoryByName = async (name: string): Promise<Category | null> => {
    const document: Document | null = await this.collection().findOne({"name" : name});
    if(document == null)
      return null;

    return this.mapToDomainModel(document);
  };

  public getCategoryById = async (id: string): Promise<Category | null> => {
    const document: Document | null = await this.collection().findOne({"_id" : new ObjectID(id)});
    if(document == null)
      return null;

    return this.mapToDomainModel(document);
  };

  public storeCategory = async (category: Category): Promise<void> => {
    await this.collection().updateMany(
      {"_id" : new ObjectID(category.id)},
      {
        $set: { "name" : category.categoryName }
      },
      {upsert: true}
    );
  };

  public removeCategory = async (category: Category): Promise<void> => {
    await this.collection().deleteMany({"_id" : new ObjectID(category.id)});
  };

  private collection = (): Collection => {
    return database.collection("categories");
  };

  private mapToDomainModel = (document: Document): Category => {
    return new Category(document["_id"].toString(), document["category_name"]);
  };
}