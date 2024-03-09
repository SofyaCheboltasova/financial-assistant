import { Bank, Product } from "../contracts/interfaces";
import KnowledgeBase from "./knowledgeBase/knowledgeBase";
import Home from "./home/home";
import Assistant from "./assistant/assistant";

/**
 * Call methods for drawing HTML and append new tag to main tag
 */
class AppView {
  private home: Home;
  private assistant: Assistant;
  private knowledgeBase: KnowledgeBase;
  private mainTag: HTMLElement;

  constructor() {
    this.home = new Home();
    this.assistant = new Assistant();
    this.knowledgeBase = new KnowledgeBase();
    this.mainTag = this.home.main;
  }

  public setHomePage(): void {
    this.home.drawHomePage();

    this.clearMainTag();
    if (this.home.tag) {
      this.appendToMainTag(this.home.tag);
    }
  }

  public setAssistantPage(): void {
    this.assistant.drawAssistantPage();

    this.clearMainTag();
    this.appendToMainTag(this.assistant.tag);
  }

  public drawKnowledgeBasePage(data: (Bank | Product)[]): void {
    this.knowledgeBase.drawButtons(data);

    this.clearMainTag();
    this.appendToMainTag(this.knowledgeBase.tag);
  }

  public setButtonHandler(type: "Bank" | "Product"): void {
    this.knowledgeBase.setButtonHandler(this.knowledgeBase.tag, type);
  }

  private appendToMainTag(tag: HTMLElement) {
    this.mainTag.appendChild(tag);
  }

  private clearMainTag() {
    while (this.mainTag.firstChild) {
      this.mainTag.removeChild(this.mainTag.firstChild);
    }
  }
}

export default AppView;

