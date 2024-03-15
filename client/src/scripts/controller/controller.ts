import { Categories, ResponseType } from "../contracts/interfaces";
import Api from "./api";

/**
 * Gets data from the API and returns it to App class
 */

class AppController {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  public async getBanks(): Promise<ResponseType[] | []> {
    const banks = await this.api.fetchBanks();
    return banks;
  }

  public async getProducts(): Promise<ResponseType[] | []> {
    const products = await this.api.fetchProducts();
    return products;
  }

  public async getProductCategories(): Promise<Categories[] | []> {
    const bankId = localStorage.getItem("bank");
    const productId = localStorage.getItem("product");

    if (!bankId || !productId) return [];

    const categories = await this.api.fetchProductsCategories(
      Number(bankId),
      Number(productId)
    );
    return categories;
  }

  public async getCategorySubsections(): Promise<ResponseType[] | []> {
    const categoryId = localStorage.getItem("category");
    if (!categoryId) return [];

    const subsections = await this.api.fetchCategorySubsections(
      Number(categoryId)
    );
    return subsections;
  }

  public async getSubsectionDetails() {
    const subsectionId = localStorage.getItem("subsection");
    if (!subsectionId) return [];

    const subsectionDetails = await this.api.fetchSubsectionDetails(
      Number(subsectionId)
    );
    return subsectionDetails;
  }
}

export default AppController;

