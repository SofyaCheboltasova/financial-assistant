import { Bank, Product } from "../contracts/interfaces";
import Api from "./api";

class AppController {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  public async getBanks(): Promise<Bank[] | []> {
    const banks = await this.api.fetchBanks();
    return banks;
  }

  public async getProducts(): Promise<Product[] | []> {
    const products = await this.api.fetchProducts();
    return products;
  }

  public async getProductsCategories() {}

  public getCategoryData() {}

  public getFullInfo() {}
}

export default AppController;

