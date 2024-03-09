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

  public async getProductsCategories(): Promise<Categories[] | []> {
    const bankId = localStorage.getItem("bank");
    const productId = localStorage.getItem("product");

    if (!bankId || !productId) return [];

    const categories = await this.api.fetchProductsCategories(
      Number(bankId),
      Number(productId)
    );
    return categories;
  }

  public getCategoryData() {}

  public getFullInfo() {}
}

export default AppController;

