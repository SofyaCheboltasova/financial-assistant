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
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = `#${item.nameEng}`;

    button.textContent = item.nameRus;
    button.id = String(item.id);
    button.classList.add("button");

    link.appendChild(button);
    this.tag.appendChild(link);

    return button;
  }

  private setButtonHandler(button: HTMLDivElement): void {
    button.addEventListener("click", () => {
      this.chosenBankID = Number(button.id);

      this.getFinancialProducts();
    });
  }

  private async getBanks(): Promise<void> {
    try {
      this.banks = await fetchBanks();
      this.banks.forEach((item) => {
        const buttonTag: HTMLDivElement = this.setButtonsHtml(item);
        this.setButtonHandler(buttonTag);
      });

      this.setClasses();
    } catch (error) {
      console.error("Error initializing banks:", error);
    }
  }

  private async getFinancialProducts(): Promise<void> {
    try {
      this.finProducts = await fetchFinancialProducts();
      this.finProducts.forEach((item) => {
        this.setButtonsHtml(item);
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

