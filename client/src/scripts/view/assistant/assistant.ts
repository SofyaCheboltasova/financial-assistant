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

  private setAssistantMessage(inputText: string) {
    const message = document.createElement("div");
    message.classList.add("message__assistant");
    message.textContent = inputText;
    this.dialog.appendChild(message);
  }

  private handleApiCall(data: string): void {
    console.error("Данные из API:", data);

    const editedMessage = data
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\-/g, "	•");

    this.setAssistantMessage(editedMessage);
  }
}

export default Assistant;

