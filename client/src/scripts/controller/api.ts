import axios from "../../../node_modules/axios/index";
import { Categories, ResponseType } from "../contracts/interfaces";

class Api {
  private serverUrl: string;

  constructor() {
    this.serverUrl = "http://127.0.0.1:8000/";
  }

  public async fetchBanks(): Promise<ResponseType[] | []> {
    try {
      const response = await axios.get(`${this.serverUrl}banks/`);
      return response.data as ResponseType[];
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  }

  public async fetchProducts(): Promise<ResponseType[] | []> {
    try {
      const response = await axios.get(`${this.serverUrl}financial-products/`);
      return response.data as ResponseType[];
    } catch (error) {
      console.error("Error fetching financial products:", error);
      return [];
    }
  }

  public async fetchProductsCategories(
    bankId: number,
    productId: number
  ): Promise<Categories[] | []> {
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

  public async fetchCategorySubsections(
    categoryId: number
  ): Promise<ResponseType[] | []> {
    try {
      const response = await axios.get(`${this.serverUrl}loan-subsections/`, {
        params: {
          category_id: categoryId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching credit categories:", error);
      return [];
    }
  }
}

export default Api;

