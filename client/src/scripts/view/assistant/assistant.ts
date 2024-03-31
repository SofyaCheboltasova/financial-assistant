import EventObserver from "../../observer/observer";

class Assistant {
  public tag: HTMLDivElement;
  private textArea: HTMLTextAreaElement;
  private eventObserver: EventObserver;

  constructor(eventObserver: EventObserver) {
    this.tag = document.createElement("div");
    this.textArea = document.createElement("textarea");
    this.eventObserver = eventObserver;
    this.eventObserver.subscribe(
      "assistantAnswer",
      this.handleApiCall.bind(this)
    );
  }

  public drawAssistantPage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("assistant__wrapper");

    const dialog = document.createElement("div");
    dialog.classList.add("assistant__dialog");

    const form = document.createElement("form");
    form.classList.add("assistant__form");

    const textArea = document.createElement("textarea");
    textArea.classList.add("assistant__textarea");
    textArea.addEventListener("keydown", this.handleEnterPress.bind(this));

    form.appendChild(textArea);
    this.tag.append(dialog, form);
  }

  private handleEnterPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      const inputText = (event.target as HTMLTextAreaElement).value;
      this.eventObserver.notify("enterPressed", inputText);
      (event.target as HTMLTextAreaElement).value = "";
    }
  }

  private handleApiCall(data: string): void {
    console.error("Данные из API:", data);

    const editData = data
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\-/g, "	•");
  }
}

export default Assistant;

