import { Bank, Categories, Product } from "../../contracts/interfaces";

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
            node.setAttribute("href", "#products");
            localStorage.setItem("bank", node.id);
          } else if (type === "Product") {
            node.setAttribute("href", "#categories");
            localStorage.setItem("product", node.id);
          }
        });
      }
    });
  }

  public drawButtons(items: (Bank | Product | Categories)[]) {
    while (this.tag.firstChild) {
      this.tag.removeChild(this.tag.firstChild);
    }

    items.forEach((item) => {
      const a: HTMLAnchorElement = document.createElement("a");
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

