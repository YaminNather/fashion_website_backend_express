import * as express from "express";
import { connectToMongo } from "./mongodb";
import productRouter from "./application_layer/products_router/products_router";
import authenticationRouter from "./application_layer/authentication_router/authentication_router";
import cors from "cors";
import customersRouter from "./application_layer/customers_router/customers_router";
import Stripe from "stripe";
import ordersRouter from "./application_layer/orders_router/orders_router";

async function main(): Promise<void> {
  await connectToMongo();
  const app: express.Express = express.default();
  
  app.use(express.json({limit: "10mb"}));
  app.use(express.static("public"));
  app.use(cors());

  app.use("/api/products", productRouter);
  app.use("/api/auth", authenticationRouter);
  app.use("/api/customers/", customersRouter);
  app.use("/api/orders/", ordersRouter);

  const port: string = process.env.PORT || "8000";
  app.listen(port, () => console.log(`Server listening to PORT ${port}`));
}

main();