import Assistant from "../assistentPage/assistant";
import KnowledgeBase from "../knowledgeBase/knowledgeBase";
import MainPage from "./main";

class PageLoader {
  public url: URL;
  public currentPage: string;
  private newTag: HTMLElement | undefined;
  private base: KnowledgeBase;
  private assistant: Assistant;
  private main: MainPage;

  constructor() {
    this.url = new URL("http://localhost:8080/");
    this.newTag = undefined;
    this.currentPage = this.url.hash;

    this.base = new KnowledgeBase(this);
    this.assistant = new Assistant();
    this.main = new MainPage(this);

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
    this.url = new URL(`#${page}`, this.url);
    this.currentPage = page;
    window.location.href = this.url.toString();
  }

  private changePage(page: string): void {
    switch (page) {
      case "products": {
        this.newTag = this.base.tag;
        break;
      }
      case "banks": {
        this.newTag = this.base.tag;
        break;
      }
      case "assistant": {
        this.newTag = this.assistant.tag;
        break;
      }
      default: {
        this.newTag = this.main.getMainWrapper();
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

