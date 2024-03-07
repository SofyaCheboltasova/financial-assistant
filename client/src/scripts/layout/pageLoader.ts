import Assistant from "../assistentPage/assistant";
import KnowledgeBase from "../knowledgeBase/knowledgeBase";
import MainPage from "./main";

class PageLoader {
  public url: URL;
  public currentPage: string;
  private newTag: HTMLElement | undefined;

  constructor() {
    this.url = new URL("http://localhost:8080/");
    this.newTag = undefined;
    this.currentPage = this.url.hash;
    this.setUrlChangeListener();
  }

  private setUrlChangeListener() {
    window.addEventListener("popstate", () => {
      this.currentPage = this.url.hash;
      this.changePage(this.currentPage);
    });
  }
  public setUrl(page: string): void {
    this.url = new URL(`#${page}`, this.url);
    this.currentPage = page;
    window.location.href = this.url.toString();
  }

  private changePage(page: string): void {
    switch (page) {
      case "#knowledge-base": {
        const base = new KnowledgeBase(this);
        this.newTag = base.tag;
        break;
      }
      case "#assistant": {
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

