import { TableData } from "../../contracts/interfaces";
import DataType from "../../contracts/types";
import EventObserver from "../../observer/observer";

class KnowledgeBase {
  public tag: HTMLDivElement;
  public buttonsTag: HTMLDivElement;
  public contentTag: HTMLDivElement;
  private tbody: HTMLTableSectionElement;

  constructor() {
    this.tag = document.createElement("div");
    this.tag.classList.add("base__wrapper");

    this.buttonsTag = document.createElement("div");
    this.buttonsTag.classList.add("base__buttons");

    this.contentTag = document.createElement("div");
    this.contentTag.classList.add("base__content", "hidden");

    const table = document.createElement("table");
    table.classList.add("table");

    this.tbody = document.createElement("tbody");

    table.appendChild(this.tbody);
    this.contentTag.appendChild(table);
    this.tag.append(this.buttonsTag, this.contentTag);
  }

  private renderEmptyPage(): void {
    const h1: HTMLHeadingElement = document.createElement("h1");
    h1.classList.add("header");
    h1.textContent = "Извините, по выбранной категории нет данных";

    this.buttonsTag.appendChild(h1);
  }

  public fillTable(rows: TableData[] | []): void {
    while (this.tbody.firstChild) {
      this.tbody.removeChild(this.tbody.firstChild);
    }

    rows.forEach((row) => {
      const { title, description, link } = row;
      const descWithBr = description
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\-/g, "	•");

      const tr = document.createElement("tr");
      const tTitle = document.createElement("th");
      const tDesc = document.createElement("td");
      tDesc.classList.add("table__description");

      const tLink = document.createElement("td");
      tLink.classList.add("table__link");
      const a = document.createElement("a");

      a.href = link;
      a.target = "_blank";
      a.appendChild(tLink);

      tTitle.textContent = title;
      tDesc.innerHTML = descWithBr;
      tLink.textContent = "Ссылка на документ";

      tr.append(tTitle, tDesc, a);

      this.tbody.appendChild(tr);
    });
  }

  public drawButtons(items: DataType[] | [], isList?: boolean): void {
    while (this.buttonsTag.firstChild) {
      this.buttonsTag.removeChild(this.buttonsTag.firstChild);
    }

    if (items.length === 0) {
      this.renderEmptyPage();
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
