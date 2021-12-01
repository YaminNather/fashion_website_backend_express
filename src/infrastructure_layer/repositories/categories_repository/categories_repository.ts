import Category from "../../../domain/models/category";

export default abstract class CategoriesRepository {
  public abstract getCategoryByName(name: string): Promise<Category | null>;

  public abstract getCategoryById(id: string): Promise<Category | null>;

  public abstract storeCategory(category: Category): Promise<void>;

  public abstract removeCategory(category: Category): Promise<void>;
}