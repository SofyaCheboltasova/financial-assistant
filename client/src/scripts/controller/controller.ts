import Router from "../app/route";
import { EventTypes, Links } from "../contracts/enums";
import Model from "../model/model";
import EventObserver from "../observer/observer";
import View from "../view/view";

class Controller {
  private view: View;
  private model: Model;
  public searchParams: URLSearchParams | null = null;

  constructor(observer: EventObserver, router: Router) {
    this.view = new View(observer);
    this.model = new Model(observer);
    this.setRouting(router);
  }

  private setUrlChangeHandler(path: Links, clickedValue: Links) {
    const buttons = this.view.knowledgeBase.buttonsTag;
    this.model.onButtonClicked(buttons, path, clickedValue);
  }

  private setRouting(router: Router): void {
    router.route(Links.home, () => {
      this.view.renderStartPage();
    });

    router.route(Links.assistant, () => {
      this.view.renderAssistantPage();
    });

    router.route(Links.banks, async () => {
      const banks = await this.model.getBanks();
      this.view.renderKnowledgeBasePage(banks);
      this.setUrlChangeHandler(Links.products, Links.banks);
    });

    router.route(Links.products, async () => {
      const products = await this.model.getProducts();
      this.view.renderKnowledgeBasePage(products);
      this.setUrlChangeHandler(Links.categories, Links.products);
    });

    router.route(Links.categories, async () => {
      const categories = await this.model.getProductCategories();
      this.view.renderKnowledgeBasePage(categories);
      this.setUrlChangeHandler(Links.category_subsections, Links.categories);
    });

    router.route(Links.category_subsections, async () => {
      const subsections = await this.model.getCategorySubsections();
      this.view.renderKnowledgeBasePage(subsections);
      this.setUrlChangeHandler(
        Links.subsection_details,
        Links.category_subsections
      );
    });
    router.route(Links.subsection_details, async () => {
      const details = await this.model.getSubsectionDetails();
      this.view.renderKnowledgeBasePage(details, true);
      this.setUrlChangeHandler(Links.detailed_data, Links.subsection_details);
    });
    router.route(Links.detailed_data, async () => {
      const detailedData = await this.model.getDetailedData();
      this.view.renderKnowledgeBaseTable(detailedData);
    });
  }
}

export default Controller;
