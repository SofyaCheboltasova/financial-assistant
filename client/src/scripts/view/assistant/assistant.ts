import { EventTypes } from "../../contracts/enums";
import { AssistantAnswer } from "../../contracts/interfaces";
import EventObserver from "../../observer/observer";

class Assistant {
  public tag: HTMLDivElement;
  private dialog: HTMLDivElement;
  private observer: EventObserver;
  private textField: HTMLTextAreaElement;

  constructor(observer: EventObserver) {
    this.tag = document.createElement("div");
    this.dialog = document.createElement("div");
    this.textField = document.createElement("textarea");

    this.observer = observer;
    this.observer.subscribe(
      EventTypes.ASSISTANT_ANSWER,
      this.handleApiCall.bind(this)
    );
  }

  public renderAssistantPage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("assistant__wrapper");

    this.dialog = document.createElement("div");
    this.dialog.classList.add("assistant__dialog");

    const form = document.createElement("form");
    form.classList.add("assistant__form");

    this.textField = document.createElement("textarea");
    this.textField.classList.add("assistant__textarea");
    this.textField.addEventListener(
      "keydown",
      this.handleEnterPress.bind(this)
    );

    const sendButton = document.createElement("div");
    sendButton.classList.add("assistant__send-button");
    sendButton.addEventListener("click", (event) =>
      this.handleEnterPress(event as PointerEvent)
    );

    form.append(this.textField, sendButton);
    this.tag.append(this.dialog, form);
  }

  private setUserMessage(inputText: string) {
    const message = document.createElement("div");
    message.classList.add("message__user");
    message.textContent = inputText;
    this.dialog.appendChild(message);
  }

  private handleEnterPress(event: KeyboardEvent | PointerEvent): void {
    if (
      (event instanceof KeyboardEvent && event.key === "Enter") ||
      event instanceof PointerEvent
    ) {
      event.preventDefault();
      if (this.textField.value === "") return;
      this.setUserMessage(this.textField.value);

      this.observer.notify(EventTypes.ENTER_PRESSED, this.textField.value);
      this.textField.value = "";
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
