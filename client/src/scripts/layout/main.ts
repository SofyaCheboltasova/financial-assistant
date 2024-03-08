import PageLoader from "./pageLoader";

class MainPage {
  public tag: HTMLElement;
  private loader: PageLoader;
  private mainWrapper: HTMLDivElement;
  private baseButton: HTMLDivElement;
  private assistantButton: HTMLDivElement;

  constructor(loader: PageLoader) {
    this.loader = loader;
    this.tag = document.createElement("main");
    this.mainWrapper = document.createElement("div");

    this.baseButton = document.createElement("div");
    this.baseButton.textContent = "Knowledge base";
    this.baseButton.id = "banks";

    this.assistantButton = document.createElement("div");
    this.assistantButton.textContent = "Assistant";
    this.assistantButton.id = "assistant";

    this.mainWrapper.append(this.baseButton, this.assistantButton);
    this.tag.appendChild(this.mainWrapper);

    this.setClasses();
    this.setButtonHandler(this.baseButton);
    this.setButtonHandler(this.assistantButton);
  }

  public getMainWrapper(): HTMLElement {
    return this.mainWrapper;
  }

  private setClasses(): void {
    this.tag.classList.add("main");
    this.mainWrapper.classList.add("main__wrapper");

    this.baseButton.classList.add("button");
    this.assistantButton.classList.add("button");
  }

  private setButtonHandler(button: HTMLDivElement): void {
    button.addEventListener("click", (e) => {
      this.loader.setUrl(button.id);
    });
  }
}

export default MainPage;
