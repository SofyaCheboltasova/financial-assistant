import { ResponseType, Categories } from "../contracts/interfaces";
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
      this.changePage();
    });
  }

  private async changePage(): Promise<void> {
    switch (this.currentPage) {
      case "assistant": {
        this.view.setAssistantPage();
        break;
      }
      case "banks": {
        const banks: ResponseType[] | [] = await this.controller.getBanks();
        this.view.drawKnowledgeBasePage(banks);
        this.view.setButtonHandler("Bank");
        break;
      }
      case "products": {
        const products: ResponseType[] | [] =
          await this.controller.getProducts();
        this.view.drawKnowledgeBasePage(products);
        this.view.setButtonHandler("Product");
        break;
      }
      case "categories": {
        const categories: Categories[] | [] =
          await this.controller.getProductCategories();
        this.view.drawKnowledgeBasePage(categories);
        this.view.setButtonHandler("Category");
        break;
      }
      case "category-subsections": {
        const subsections: ResponseType[] | [] =
          await this.controller.getCategorySubsections();
        this.view.drawKnowledgeBasePage(subsections);
        this.view.setButtonHandler("Subsections");
        break;
      }
      case "subsection-details": {
        const subsectionDetails: ResponseType[] | [] =
          await this.controller.getSubsectionDetails();
        this.view.drawKnowledgeBaseList(subsectionDetails);
        this.view.setButtonHandler("SubsectionDetails");
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

