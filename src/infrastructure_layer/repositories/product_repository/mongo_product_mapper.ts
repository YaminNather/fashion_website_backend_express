import { Document } from "mongodb";
import Product, { Discount } from "../../../domain/models/product";
import { ObjectID } from "bson";


export default class MongoProductMapper {
  public toDBProduct = (product: Product) => {
    return {
      "_id" : new ObjectID(product.id),
      "product_name" : product.productName,
      "brand" : product.brand,
      "description" : product.description,
      "original_price" : product.originalPrice,
      "stock" : product.stock,
      "discount_type" : (product.discount != null) ? product.discount.type : null,
      "discount_amount" : (product.discount != null) ? product.discount.amount : null,
      "arrival_time" : product.arrivalTime,
      "images" : product.images,
      "videos" : product.videos
    };
  };

  public mapProduct = (productDocument: Document) => {
    let discount: Discount | undefined = undefined;
    if(productDocument["discount_type"] != undefined && productDocument["discount_amount"] != undefined)
      discount = new Discount(productDocument["discount_type"], productDocument["discount_amount"]);    

    const r: Product = new Product({
      id: productDocument["_id"].toString(),
      productName: productDocument["product_name"],
      brand: productDocument["brand"],
      description: productDocument["description"],
      arrivalTime: productDocument["arrival_time"],
      stock: productDocument["stock"],
      originalPrice: productDocument["original_price"],
      discount: discount,
      images: productDocument["images"],
      videos: productDocument["videos"],
      variantOf: productDocument["variant_of"]
    });
    
    return r;
  };

  public mapProductVariant = (variantDocument: Document, baseDocument: Document) => {
    let discount: Discount | undefined = undefined;
    if(baseDocument["discount_type"] != undefined && baseDocument["discount_amount"] != undefined)
      discount = new Discount(baseDocument["discount_type"], baseDocument["discount_amount"]);    

    const r: Product = new Product({
      id: variantDocument["_id"].toString(),
      productName: variantDocument["product_name"],
      brand: baseDocument["brand"],
      description: variantDocument["description"] ?? baseDocument["description"],
      arrivalTime: variantDocument["arrival_time"],
      stock: parseInt(variantDocument["stock"]),
      originalPrice: parseFloat(variantDocument["original_price"] ?? baseDocument["original_price"]),
      discount: discount,
      images: variantDocument["images"],
      videos: variantDocument["videos"],
      variantOf: variantDocument["variant_of"]
    });

    return r;
  }
}