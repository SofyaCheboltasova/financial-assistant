class Home {
  public main: HTMLElement;
  private mainWrapper: HTMLDivElement;

  constructor() {
    this.main = document.createElement("main");
    this.mainWrapper = document.createElement("div");

    this.main.classList.add("main");
    this.mainWrapper.classList.add("main__wrapper");

    this.main.appendChild(this.mainWrapper);
    document.body.appendChild(this.main);
  }

  public drawHomePage(): void {
    const baseLink = document.createElement("a");
    baseLink.href = "#banks";

    const assistantLink = document.createElement("a");
    assistantLink.href = "#assistant";

    const baseButton = document.createElement("div");
    baseButton.textContent = "Knowledge base";
    baseButton.classList.add("button");

    const assistantButton = document.createElement("div");
    assistantButton.textContent = "Assistant";
    assistantButton.classList.add("button");

    baseLink.appendChild(baseButton);
    assistantLink.appendChild(assistantButton);

    this.mainWrapper.append(baseLink, assistantLink);
  }
}

export default Home;

