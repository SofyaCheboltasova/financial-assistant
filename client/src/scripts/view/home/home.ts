import { EventTypes, Links } from "../../contracts/enums";
import EventObserver from "../../observer/observer";

class Home {
  public main: HTMLElement;
  public tag: HTMLDivElement | undefined;
  private observer: EventObserver;

  constructor(observer: EventObserver) {
    this.observer = observer;
    this.main = document.createElement("main");
    this.main.classList.add("main");

    document.body.appendChild(this.main);
  }

  private setButtonListener(a: HTMLAnchorElement, path: string): void {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const url = new URL(location.toString());
      url.pathname = path;
      history.pushState(null, "", url.toString());
      this.observer.notify(EventTypes.URL_CHANGED, path);
    });
  }

  public renderStartPage(): void {
    this.tag = document.createElement("div");
    this.tag.classList.add("main__wrapper");

    const baseLink = document.createElement("a");
    this.setButtonListener(baseLink, Links.knowledgeBase);

    const assistantLink = document.createElement("a");
    this.setButtonListener(assistantLink, Links.assistant);

    const baseButton = document.createElement("div");
    baseButton.textContent = "База знаний";
    baseButton.classList.add("button");

    const assistantButton = document.createElement("div");
    assistantButton.textContent = "Ассистент";
    assistantButton.classList.add("button");

    baseLink.appendChild(baseButton);
    assistantLink.appendChild(assistantButton);

    this.tag.append(baseLink, assistantLink);
  }
}

export default Home;

