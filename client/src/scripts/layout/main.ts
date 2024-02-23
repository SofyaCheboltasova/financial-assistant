import PageLoader from "./pageLoader";

class MainPage {
  public tag: HTMLElement;
  mainWrapper: HTMLDivElement;
  baseButton: HTMLDivElement;
  assistantButton: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("main");
    this.mainWrapper = document.createElement("div");

    this.baseButton = document.createElement("div");
    this.baseButton.textContent = "Knowledge base";
    this.baseButton.id = "knowledge-base";

    this.assistantButton = document.createElement("div");
    this.assistantButton.textContent = "Assistant";
    this.assistantButton.id = "assistant";

    this.mainWrapper.append(this.baseButton, this.assistantButton);
    this.tag.appendChild(this.mainWrapper);

    this.setClasses();
    this.setButtonHandler(this.baseButton);
    this.setButtonHandler(this.assistantButton);
  }

  private setClasses(): void {
    this.tag.classList.add("main");
    this.mainWrapper.classList.add("main__wrapper");

    this.baseButton.classList.add("main__button_base");
    this.assistantButton.classList.add("main__button_assistant");
  }

  private setButtonHandler(button: HTMLDivElement): void {
    const url = new PageLoader();
    button.addEventListener("click", (e) => {
      this.tag.removeChild(this.mainWrapper);
      url.setUrl(button.id);
    });
  }
}

export default MainPage;

