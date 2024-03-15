import DataType from "../../contracts/types";

class KnowledgeBase {
  public tag: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("div");
    this.tag.classList.add("base__wrapper");
  }

  public setButtonHandler(
    tag: HTMLElement,
    type: "Bank" | "Product" | "Category" | "Subsections"
  ): void {
    tag.childNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.addEventListener("click", () => {
          switch (type) {
            case "Bank": {
              node.setAttribute("href", "#products");
              localStorage.setItem("bank", node.id);
              break;
            }
            case "Product": {
              node.setAttribute("href", "#categories");
              localStorage.setItem("product", node.id);
              break;
            }
            case "Category": {
              node.setAttribute("href", "#category-subsections");
              localStorage.setItem("category", node.id);
              break;
            }
            case "Subsections": {
              node.setAttribute("href", "#subsection-details");
              localStorage.setItem("subsection", node.id);
              break;
            }
          }
        });
      }
    });
  }

  private drawEmptyPage(): void {
    const h1: HTMLHeadingElement = document.createElement("h1");
    h1.classList.add("header");
    h1.textContent = "Извините, по выбранной категории нет данных";

    this.tag.appendChild(h1);
  }

  public drawButtons(items: DataType[] | []): void {
    while (this.tag.firstChild) {
      this.tag.removeChild(this.tag.firstChild);
    }

    if (items.length === 0) {
      this.drawEmptyPage();
      return;
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

