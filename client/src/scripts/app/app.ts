import { Bank, Product } from "../contracts/interfaces";
import AppController from "../controller/controller";
import AppView from "../view/appView";

class App {
  private controller: AppController;
  private view: AppView;

  public url: URL;
  public currentPage: string;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();

    this.url = new URL("http://localhost:8080/");
    this.currentPage = this.url.hash;
  }

  public start(): void {
    this.setUrlChangeListener();
    this.view.setHomePage();
  }

  private getCurrentPage(): string {
    const url = window.location.href;
    const parts = url.split("#");
    return parts[parts.length - 1];
  }

  private setUrlChangeListener() {
    window.addEventListener("popstate", () => {
      this.currentPage = this.getCurrentPage();
      this.changePage(this.currentPage);
    });
  }

  private async changePage(page: string): Promise<void> {
    switch (page) {
      case "products": {
        const products: Product[] | [] = await this.controller.getProducts();
        this.view.drawKnowledgeBasePage(products);
        break;
      }
      case "banks": {
        const banks: Bank[] | [] = await this.controller.getBanks();
        this.view.drawKnowledgeBasePage(banks);
        break;
      }
      case "assistant": {
        this.view.setAssistantPage();
        break;
      }
      default: {
        this.view.setHomePage();
        break;
      }
    }
  }
}

export default App;

