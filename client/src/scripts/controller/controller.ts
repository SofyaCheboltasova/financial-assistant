import { Bank, Categories, Product } from "../contracts/interfaces";
import Api from "./api";

/**
 * Gets data from the API and returns it to App class
 */

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

  public async getProductsCategories(
    bankId: number,
    productId: number
  ): Promise<Categories[] | []> {
    const categories = await this.api.fetchProductsCategories(
      bankId,
      productId
    );
    return categories;
  }

  public getCategoryData() {}

  public getFullInfo() {}
}

export default AppController;

