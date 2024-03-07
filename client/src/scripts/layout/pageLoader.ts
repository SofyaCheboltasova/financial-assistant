import Assistant from "../assistentPage/assistant";
import KnowledgeBase from "../knowledgeBase/knowledgeBase";
import MainPage from "./main";

class PageLoader {
  public url: string;
  public currentPage: string;
  private newTag: HTMLElement | undefined;

  constructor() {
    this.url = "http://localhost:8080/";
    this.newTag = undefined;
    this.currentPage = this.getCurrentPage();
    this.setUrlChangeListener();
  }

  private setUrlChangeListener() {
    window.addEventListener("popstate", () => {
      this.currentPage = this.getCurrentPage();
      this.changePage(this.currentPage);
    });
  }

  private getCurrentPage(): string {
    const url = window.location.href;
    const parts = url.split("#");
    return parts[parts.length - 1];
  }

  public setUrl(page: string): void {
    const newUrl = this.url + "#" + page;
    window.location.href = newUrl;
  }

  private changePage(page: string): void {
    switch (page) {
      case "knowledge-base": {
        const base = new KnowledgeBase();
        this.newTag = base.tag;
        break;
      }
      case "assistant": {
        const assistant = new Assistant();
        this.newTag = assistant.tag;
        break;
      }
      default: {
        const main = new MainPage(this);
        this.newTag = main.getMainWrapper();
        break;
      }
    }

    const main = document.querySelector(".main");
    if (main) {
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
      main.append(this.newTag);
    }
  }
}

export default PageLoader;

