class Home {
  public main: HTMLElement;
  public tag: HTMLDivElement | undefined;

  constructor() {
    this.main = document.createElement("main");
    this.main.classList.add("main");

    document.body.appendChild(this.main);
  }

  public drawHomePage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("main__wrapper");

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

    this.tag.append(baseLink, assistantLink);
  }
}

export default Home;

