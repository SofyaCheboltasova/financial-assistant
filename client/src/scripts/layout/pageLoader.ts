import Assistant from "../assistentPage/assistantPage";

class PageLoader {
  public url: string;
  public currentPage: string;
  private newTag: HTMLDivElement | undefined;

  constructor() {
    this.url = "http://localhost:8080/";
    this.newTag = undefined;
    this.currentPage = this.getCurrentPage();
  }

  private getCurrentPage(): string {
    const url = window.location.href;
    const parts = url.split("#");
    return parts[parts.length - 1];
  }

  public setUrl(page: string): void {
    const newUrl = this.url + "#" + page;
    window.location.href = newUrl;

    this.changePage(page);
  }

  private changePage(page: string): void {
    switch (page) {
      default: {
        const assistant = new Assistant();
        this.newTag = assistant.tag;
        break;
      }
    }

    const main = document.querySelector(".main");
    main?.append(this.newTag);
  }
}

export default PageLoader;

