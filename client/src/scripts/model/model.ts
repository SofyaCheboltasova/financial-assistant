import { EventTypes, Links } from "../contracts/enums";
import { Categories } from "../contracts/interfaces";
import EventObserver from "../observer/observer";
import Api from "./api";
import { ResponseType } from "../contracts/interfaces";

class Model {
  private api: Api;
  private observer: EventObserver;

  constructor(observer: EventObserver) {
    this.api = new Api();
    this.observer = observer;
  }

  public onButtonClicked(
    buttonsTag: HTMLDivElement,
    path: Links,
    clickedValue?: Links
  ): void {
    buttonsTag.childNodes.forEach((node) => {
      node.addEventListener("click", () => {
        if (node instanceof HTMLElement && clickedValue)
          localStorage.setItem(clickedValue, node.id);

        const url = new URL(location.toString());
        url.pathname = path;
        history.pushState(null, "", url.toString());
        this.observer.notify(EventTypes.URL_CHANGED, path);
      });
    });
  }

  private getLSItem(item: Links): string | null {
    return localStorage.getItem(item);
  }

  private removeLSItem(item: Links): void {
    localStorage.removeItem(item);
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
    const bankID = this.getLSItem(Links.banks);
    const productID = this.getLSItem(Links.products);

    if (!bankID || !productID) return [];

    const categories = await this.api.fetchProductsCategories(
      Number(bankID),
      Number(productID)
    );

    this.removeLSItem(Links.banks);
    this.removeLSItem(Links.products);

    return categories;
  }

  public async getCategorySubsections(): Promise<ResponseType[] | []> {
    const categoryID = this.getLSItem(Links.categories);
    if (!categoryID) return [];

    const subsections = await this.api.fetchCategorySubsections(
      Number(categoryID)
    );

    this.removeLSItem(Links.categories);
    return subsections;
  }

  public async getSubsectionDetails() {
    const subsectionID = this.getLSItem(Links.category_subsections);
    if (!subsectionID) return [];

    const subsectionDetails = await this.api.fetchSubsectionDetails(
      Number(subsectionID)
    );

    this.removeLSItem(Links.category_subsections);
    return subsectionDetails;
  }

  public async getDetailedData() {
    const detailID = this.getLSItem(Links.subsection_details);
    if (!detailID) return [];

    const detailedInfo = await this.api.fetchDetailedData(Number(detailID));

    this.removeLSItem(Links.subsection_details);
    return detailedInfo;
  }

  public async getAssistantAnswer(query: string) {
    const answer = await this.api.assistant(query);
    this.observer.notify(EventTypes.ASSISTANT_ANSWER, answer);
  }
}

export default Model;

