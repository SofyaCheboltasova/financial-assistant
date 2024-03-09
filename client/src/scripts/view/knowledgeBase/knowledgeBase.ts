import { Bank, Product } from "../../contracts/interfaces";

class KnowledgeBase {
  public tag: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("div");
    this.tag.classList.add("base__wrapper");
  }

  public setButtonHandler(tag: HTMLElement, type: "Bank" | "Product"): void {
    tag.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.addEventListener("click", () => {
          if (type === "Bank") {
            localStorage.setItem("bank", node.id);
          } else if (type === "Product") {
            localStorage.setItem("product", node.id);
          }
        });
      }
    });
  }

  public drawButtons(items: (Bank | Product)[]) {
    while (this.tag.firstChild) {
      this.tag.removeChild(this.tag.firstChild);
    }

    items.forEach((item) => {
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = `#${item.nameEng}`;
      a.id = String(item.id);

      const button: HTMLDivElement = document.createElement("div");
      button.classList.add("button");
      button.textContent = item.nameRus;

      a.appendChild(button);
      this.tag.appendChild(a);
    });
  }
}

export default KnowledgeBase;

