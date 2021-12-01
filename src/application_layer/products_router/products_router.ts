import Express, { Router } from "express";
import Product, { Discount } from "../../domain/models/product";
import ProductsRepository from "../../infrastructure_layer/repositories/product_repository/products_repository";
import ClientProduct from "../models/client_product";
import * as mapper from "./product_mapper";
import MongoProductsRepository from "../../infrastructure_layer/repositories/product_repository/mongo_products_repository";
import { ObjectID } from "bson";
import * as fs from "fs/promises";
import StoreProductHelper from "./store_product_helper";
import CategoriesRepository from "../../infrastructure_layer/repositories/categories_repository/categories_repository";
import MongoCategoriesRepository from "../../infrastructure_layer/repositories/categories_repository/mongo_categories_repository";
import Category from "../../domain/models/category";
import SortBy, { SortDirection, SortField } from "../../infrastructure_layer/repositories/product_repository/sort_by";

const productsRepository: ProductsRepository = new MongoProductsRepository();
const categoriesRepo: CategoriesRepository = new MongoCategoriesRepository();

const productRouter: Express.Router = Router();

productRouter.get(
  "/:id",
  async (req, res) => {
    console.log(`CustomLog: Get Request = /api/products/:id, id=${req.params["id"]}`);

    const product: Product | null = await productsRepository.getProduct(req.params["id"]);
    
    if(product == null) {
      res.status(404).send(`Product with id ${req.params["id"]} not found`);

      return;
    }
    
    res.send(mapper.mapProductToClientProduct(product));
  }
);
  
productRouter.get(
  "/",
  async (req, res) => {
    console.log(`CustomLog: GET request - ${req.url}`);

    const minPrice: number | undefined = (req.query["min_price"] != undefined) ? parseFloat(req.query["min_price"] as string): undefined;
    const maxPrice: number | undefined = (req.query["max_price"] != undefined) ? parseFloat(req.query["max_price"] as string): undefined;    

    const minTime: Date | undefined = (req.query["min_time"] != undefined) ? new Date(`${req.query["min_time"]} 00:00:00`) : undefined;
    const maxTime: Date | undefined = (req.query["max_time"] != undefined) ? new Date(`${req.query["max_time"]} 00:00:00`) : undefined;
    
    let categories: string[] | undefined;

    if(req.query["categories"] != undefined) {
      if(typeof req.query["categories"] == "string")
        categories = [req.query["categories"]];
      else
        categories = req.query["categories"] as string[];

      for(let i: number = categories.length - 1; i >= 0; i--) {
        let category: Category | null = await categoriesRepo.getCategoryByName(categories[i]);
        
        if(category == null)
          categories.pop();
        else
          categories[i] = category.id;
      }
    }
    
    let sortBy: SortBy | undefined;
    if(req.query["sort_field"] != undefined)
      sortBy = new SortBy(req.query["sort_field"] as SortField, {direction: req.query["sort_direction"] as (SortDirection | undefined)});

    const products: Product[] = await productsRepository.getAllProducts(
      {
        query: {
          price: { min: minPrice, max: maxPrice },
          arrival_time: { min: minTime, max: maxTime },
          categories: categories
        },
        sortBy: sortBy
      }
    );

    const responseMessage: ClientProduct[] = [];
    for(const product of products)
      responseMessage.push(mapper.mapProductToClientProduct(product));

    res.send(responseMessage);
  }
);

productRouter.post(
  "/",
  async (req, res) => {
    const storeProductHelper: StoreProductHelper = new StoreProductHelper(new ObjectID().toString(), req.body);
    await storeProductHelper.storeProduct();

    res.send();
  }
);

productRouter.put(
  "/:id",
  async (req, res) => {
    const id: string = req.params["id"];

    const storeProductHelper: StoreProductHelper = new StoreProductHelper(id, req.body);
    await storeProductHelper.storeProduct();
    
    res.send();
  }
);

async function upsertRequestProductToDomainProduct(id: string, upsertRequestProduct: any): Promise<Product> {
  const storedImageURLs: string[] = [];
  for(let i: number = 0; i < upsertRequestProduct.images.length; i++) {
    const dirPath: string = `${__dirname}/../../../public/products/${id}/images`;
    const filePath: string = `${dirPath}/${i}.jpeg`;

    await fs.mkdir(dirPath, {recursive: true});
    await fs.writeFile(filePath, upsertRequestProduct.images[i], "base64");
    
    storedImageURLs.push(`http://localhost:8000/products/${id}/images/${i}.jpeg`);
  }

  let discount: Discount | undefined;
  if(upsertRequestProduct.discount != null)
    discount = new Discount(upsertRequestProduct.discount, upsertRequestProduct.amount);
  else
    discount = undefined;

  return new Product({
    id: id,
    productName: upsertRequestProduct.product_name,
    brand: upsertRequestProduct.brand,
    description: upsertRequestProduct.description,
    arrivalTime: new Date(),
    originalPrice: upsertRequestProduct.original_price,
    discount: discount,
    stock: upsertRequestProduct.stock,
    images: storedImageURLs,
    videos: []
  });
}

export default productRouter;