import DataType from "../../contracts/types";

class KnowledgeBase {
  public tag: HTMLDivElement;
  public buttonsTag: HTMLDivElement;
  public contentTag: HTMLDivElement;

  constructor() {
    this.tag = document.createElement("div");
    this.tag.classList.add("base__wrapper");

    this.buttonsTag = document.createElement("div");
    this.buttonsTag.classList.add("base__buttons");

    this.contentTag = document.createElement("div");
    this.contentTag.classList.add("base__content", "hidden");

    this.tag.append(this.buttonsTag, this.contentTag);
  }

  public setButtonHandler(
    tag: HTMLElement,
    type: "Bank" | "Product" | "Category" | "Subsections" | "SubsectionDetails"
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
            case "SubsectionDetails": {
              node.setAttribute("href", `#${node.id}-details`);
              localStorage.setItem("subsection-details", node.id);
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

  public drawButtons(items: DataType[] | [], isList?: boolean): void {
    while (this.buttonsTag.firstChild) {
      this.buttonsTag.removeChild(this.buttonsTag.firstChild);
    }

    if (items.length === 0) {
      this.drawEmptyPage();
      return;
    }

    items.forEach((item) => {
      const a: HTMLAnchorElement = document.createElement("a");
      a.id = String(item.id);

      const button: HTMLDivElement = document.createElement("div");
      this.buttonsTag.className = "base__buttons";
      this.contentTag.classList.add("hidden");

      button.className = "button";
      button.textContent = item.nameRus;

      a.appendChild(button);
      this.buttonsTag.appendChild(a);

      if (isList) {
        this.buttonsTag.className = "base__buttons_list";
        this.contentTag.classList.remove("hidden");
        button.className = "button__thin";
      }
    });
  }
}

export default KnowledgeBase;
