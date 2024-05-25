import KnowledgeBase from "./knowledgeBase/knowledgeBase";
import Home from "./home/home";
import Assistant from "./assistant/assistant";
import DataType from "../contracts/types";
import { TableData } from "../contracts/interfaces";
import EventObserver from "../observer/observer";
import { EventTypes } from "../contracts/enums";
class View {
  private home: Home;
  private assistant: Assistant;
  private observer: EventObserver;
  public knowledgeBase: KnowledgeBase;

  private mainTag: HTMLElement;
  public prevPageButton: HTMLElement;

  constructor(observer: EventObserver) {
    this.observer = observer;
    this.home = new Home(observer);
    this.knowledgeBase = new KnowledgeBase();
    this.assistant = new Assistant(observer);

    this.mainTag = this.home.main;
    this.prevPageButton = this.setPrevPageButton();
  }

  private setPrevPageButton(): HTMLElement {
    const button = document.createElement("div");
    button.classList.add("main__prev-page");
    this.mainTag.appendChild(button);

    button.addEventListener("click", () => {
      this.observer.notify(EventTypes.CHANGE_PAGE);
    });
    return button;
  }

  private removePrevPageButton(): void {
    const prevPageButton = document.querySelector(".main__prev-page");
    prevPageButton?.remove();
  }

  public renderStartPage(): void {
    this.home.renderStartPage();
    this.updateMainTag(this.home.tag);
    this.removePrevPageButton();
  }

  public renderAssistantPage(): void {
    this.assistant.renderAssistantPage();
    this.updateMainTag(this.assistant.tag);
  }

  public renderKnowledgeBasePage(
    data: DataType[] | [],
    isList?: boolean
  ): void {
    this.knowledgeBase.drawButtons(data, isList);
    this.updateMainTag(this.knowledgeBase.tag);
  }

  public renderKnowledgeBaseTable(data: TableData[] | []): void {
    this.knowledgeBase.fillTable(data);
  }

  private updateMainTag(newTag: HTMLElement | undefined) {
    while (this.mainTag.firstChild) {
      this.mainTag.removeChild(this.mainTag.firstChild);
    }

    if (newTag) this.mainTag.appendChild(newTag);
    this.setPrevPageButton();
  }
}

export default View;
