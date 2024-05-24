import KnowledgeBase from "./knowledgeBase/knowledgeBase";
import Home from "./home/home";
import Assistant from "./assistant/assistant";
import DataType from "../contracts/types";
import { TableData } from "../contracts/interfaces";
import EventObserver from "../observer/observer";
class View {
  private home: Home;
  private assistant: Assistant;
  public knowledgeBase: KnowledgeBase;
  private mainTag: HTMLElement;

  constructor(observer: EventObserver) {
    this.home = new Home(observer);
    this.knowledgeBase = new KnowledgeBase();
    this.assistant = new Assistant();

    this.mainTag = this.home.main;
  }

  public renderStartPage(): void {
    this.home.renderStartPage();
    this.updateMainTag(this.home.tag);
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
  }
}

export default View;
