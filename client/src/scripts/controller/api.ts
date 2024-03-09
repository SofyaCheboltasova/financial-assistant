import axios from "../../../node_modules/axios/index";
import { Bank, Product } from "../contracts/interfaces";

class Api {
  private serverUrl: string;

  constructor() {
    this.serverUrl = "http://127.0.0.1:8000/";
  }

  public async fetchBanks(): Promise<Bank[] | []> {
    try {
      const response = await axios.get(`${this.serverUrl}banks/`);
      return response.data as Bank[];
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  }

  public async fetchProducts(): Promise<Product[] | []> {
    try {
      const response = await axios.get(`${this.serverUrl}financial-products/`);
      return response.data as Product[];
    } catch (error) {
      console.error("Error fetching financial products:", error);
      return [];
    }
  }

  public async fetchProductsCategories(bankId: number, productId: number) {
    try {
      const response = await axios.get(
        `${this.serverUrl}products-categories/`,
        {
          params: {
            bank_id: bankId,
            product_id: productId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching credit categories:", error);
      return [];
    }
  }
}

export default Api;

