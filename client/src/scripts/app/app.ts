import { EventTypes } from "../contracts/enums";
import AppController from "../controller/controller";
import EventObserver from "../observer/observer";
import Router from "./route";

class App {
  private controller: AppController;
  private observer: EventObserver;
  private router: Router;

  constructor() {
    this.router = new Router();
    this.observer = new EventObserver();
    this.controller = new AppController(this.observer, this.router);

    window.addEventListener("popstate", () => this.router.resolveRoute());
    window.addEventListener("hashchange", () => this.router.resolveRoute());
  }

  public start(): void {
    this.observer.subscribe(
      EventTypes.URL_CHANGED,
      this.router.navigate.bind(this.router)
    );

    const path = this.router.getPath();
    this.router.navigate(path);
  }
}

export default App;
