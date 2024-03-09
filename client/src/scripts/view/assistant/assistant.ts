class Assistant {
  public tag: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("div");
  }

  public drawAssistantPage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("assistant__wrapper");

    const form = document.createElement("form");
    form.classList.add("assistant__form");

    const textArea = document.createElement("textarea");
    textArea.classList.add("assistant__textarea");

    form.appendChild(textArea);
    this.tag.appendChild(form);
  }
}

export default Assistant;

