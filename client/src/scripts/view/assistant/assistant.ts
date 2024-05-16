import { AssistantAnswer } from "../../contracts/interfaces";
import EventObserver from "../../observer/observer";

class Assistant {
  public tag: HTMLDivElement;
  private dialog: HTMLDivElement;
  private eventObserver: EventObserver;

  constructor(eventObserver: EventObserver) {
    this.tag = document.createElement("div");
    this.dialog = document.createElement("div");

    this.eventObserver = eventObserver;
    this.eventObserver.subscribe(
      "assistantAnswer",
      this.handleApiCall.bind(this)
    );
  }

  public drawAssistantPage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("assistant__wrapper");

    this.dialog = document.createElement("div");
    this.dialog.classList.add("assistant__dialog");

    const form = document.createElement("form");
    form.classList.add("assistant__form");

    const textArea = document.createElement("textarea");
    textArea.classList.add("assistant__textarea");
    textArea.addEventListener("keydown", this.handleEnterPress.bind(this));

    form.appendChild(textArea);
    this.tag.append(this.dialog, form);
  }

  private setUserMessage(inputText: string) {
    const message = document.createElement("div");
    message.classList.add("message__user");
    message.textContent = inputText;
    this.dialog.appendChild(message);
  }

  private handleEnterPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      const inputText = (event.target as HTMLTextAreaElement).value;

      this.setUserMessage(inputText);

      this.eventObserver.notify("enterPressed", inputText);
      (event.target as HTMLTextAreaElement).value = "";
    }
  }

  private highlightCategory(data: string, className: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("highlight", className);
    data.replace(data.charAt(0), data.charAt(0).toUpperCase());
    div.textContent = data.replace(
      data.charAt(0),
      data.charAt(0).toUpperCase()
    );
    return div;
  }

  private getInfoBlock(
    bank: string,
    category: string,
    title: string
  ): HTMLDivElement {
    const bankBlock = this.highlightCategory(bank, "highlight__blue");
    const categoryBlock = this.highlightCategory(category, "highlight__green");
    const titleBlock = this.highlightCategory(title, "highlight__orange");

    const infoBlock = document.createElement("div");
    infoBlock.classList.add("highlight_block");
    infoBlock.append(bankBlock, categoryBlock, titleBlock);
    return infoBlock;
  }

  private getLinkBlock(link: string): HTMLDivElement {
    const linkBlock = document.createElement("div");
    const linkElement = document.createElement("a");
    linkElement.textContent = "Документ";
    linkElement.href = link;
    linkElement.target = "_blank";
    linkElement.classList.add("table__link");
    linkBlock.append(linkElement);

    return linkBlock;
  }

  private setAssistantMessage(
    bank: string,
    category: string,
    title: string,
    link: string,
    upperCaseAnswer: string
  ) {
    const infoBlock = this.getInfoBlock(bank, category, title);
    const linkBlock = this.getLinkBlock(link);
    const textBlock = document.createElement("div");
    textBlock.innerHTML = upperCaseAnswer;

    const message = document.createElement("div");
    message.classList.add("message__assistant");
    message.append(infoBlock, textBlock, linkBlock);

    this.dialog.append(message);
  }

  private handleApiCall(response: AssistantAnswer): void {
    const { bank, category, title, answer, link } = response;

    const answerMetadata = [bank, category, title];
    for (const data of answerMetadata) {
      data.replace(data.charAt(0), data.charAt(0).toUpperCase());
    }

    const upperCaseAnswer = answer
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\-/g, "	•");

    this.setAssistantMessage(bank, category, title, link, upperCaseAnswer);
  }
}

export default Assistant;
