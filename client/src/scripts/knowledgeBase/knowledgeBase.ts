import { fetchBanks, fetchFinancialProducts } from "../api/banksApi";
import { Bank, Product } from "../contracts/interfaces";
import PageLoader from "../layout/pageLoader";
class KnowledgeBase {
  public tag: HTMLDivElement;
  private banks: Bank[] | [] = [];
  private chosenBankID: number | undefined = undefined;
  private finProducts: Product[] | [] = [];
  private loader: PageLoader;

  constructor(loader: PageLoader) {
    this.loader = loader;
    this.tag = document.createElement("div");
    this.getBanks();
  }

  private setButtonsHtml(item: Bank | Product): HTMLDivElement {
    const button: HTMLDivElement = document.createElement("div");

    button.textContent = item.nameRus;
    button.id = String(item.id);
    button.setAttribute("path", item.nameEng);
    button.classList.add("button");

    this.tag.appendChild(button);

    return button;
  }

  private setButtonHandler(
    button: HTMLDivElement,
    callback: () => void,
    url: string
  ): void {
    button.addEventListener("click", () => {
      this.chosenBankID = Number(button.id);
      this.loader.setUrl(url);
      callback();
    });
  }

  private async getBanks(): Promise<void> {
    try {
      this.banks = await fetchBanks();

      while (this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }

      this.banks.forEach((item) => {
        const buttonTag: HTMLDivElement = this.setButtonsHtml(item);
        this.setButtonHandler(buttonTag, this.getFinancialProducts, "products");
      });

      this.setClasses();
    } catch (error) {
      console.error("Error initializing banks:", error);
    }
  }

  private setProductsCategories(): void {}

  private async getFinancialProducts(): Promise<void> {
    try {
      this.finProducts = await fetchFinancialProducts();

      while (this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }

      this.finProducts.forEach((item) => {
        const buttonTag = this.setButtonsHtml(item);
        const url = buttonTag.getAttribute("path") ?? "#";
        this.setButtonHandler(buttonTag, this.setProductsCategories, url);
      });

      this.setClasses();
    } catch (error) {
      console.error("Error initializing financial products:", error);
    }
  }

  private async setClasses(): Promise<void> {
    this.tag.classList.add("base__wrapper");
  }
}

export default KnowledgeBase;
