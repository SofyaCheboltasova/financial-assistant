import { Bank, Product } from "../../contracts/interfaces";

class KnowledgeBase {
  public tag: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("div");
    this.tag.classList.add("base__wrapper");
  }

  public drawButtons(items: (Bank | Product)[]) {
    while (this.tag.firstChild) {
      this.tag.removeChild(this.tag.firstChild);
    }

    items.forEach((item) => {
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = `#${item.nameEng}`;

      const button: HTMLDivElement = document.createElement("div");
      button.id = String(item.id);
      button.classList.add("button");
      button.textContent = item.nameRus;

      a.appendChild(button);
      this.tag.appendChild(a);
    });
  }
}

export default KnowledgeBase;

