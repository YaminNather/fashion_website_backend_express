import Product, { Discount } from "../../domain/models/product";
import * as fs from "fs/promises";
import { ObjectID } from "bson";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";

export default class StoreProductHelper {
  public constructor(id: string, data: any) {
    this.id = id;
    this.data = data;
  }

  public storeProduct = async (): Promise<void> => {
    const storedImageURLs: string[] = await this.getURLOfImages(this.data.images);
  
    let discount: Discount | undefined;
    if(this.data.discount != null)
      discount = new Discount(this.data.discount.type, this.data.discount.amount);
    else
      discount = undefined;
  
    const product: Product = new Product({
      id: this.id,
      productName: this.data.product_name,
      brand: this.data.brand,
      description: this.data.description,
      arrivalTime: new Date(),
      originalPrice: this.data.original_price,
      discount: discount,
      stock: this.data.stock,
      images: storedImageURLs,
      videos: []
    });

    await this.productsRepo.storeProduct(product);
  };

  private getURLOfImages = async (images: any[]): Promise<string[]> => {
    const r: string[] = [];
    for(const image of images) {
      if(image.type == "url")
        r.push(image.data);
      else if(image.type == "base64") {
        const storedFileURL: string = await this.storeImageInPublicFolder(image.data);

        r.push(storedFileURL);
      }
    }

    return r;
  };

  private storeImageInPublicFolder = async (imageData: any): Promise<string> => {
    const imageId: string = new ObjectID().toString();

    const dirPath: string = `${__dirname}/../../../public/products/${this.id}/images`;
    const filePath: string = `${dirPath}/${imageId}.jpeg`;

    await fs.mkdir(dirPath, {recursive: true});
    await fs.writeFile(filePath, imageData, "base64"); 

    return `http://localhost:8000/products/${this.id}/images/${imageId}.jpeg`;
  };



  private id: string;
  private data: any;

  private productsRepo: ProductsRepository = new MongoProductsRepository();
}