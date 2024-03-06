class Assistant {
  public tag: HTMLDivElement;
  form: HTMLFormElement;
  textArea: HTMLTextAreaElement;

  constructor() {
    this.tag = document.createElement("div");
    this.form = document.createElement("form");
    this.textArea = document.createElement("textarea");

    this.form.appendChild(this.textArea);
    this.tag.appendChild(this.form);

    this.setClasses();
  }

  private setClasses(): void {
    this.tag.classList.add("assistant__wrapper");
    this.form.classList.add("assistant__form");
    this.textArea.classList.add("assistant__textarea");
  }
}

export default Assistant;

