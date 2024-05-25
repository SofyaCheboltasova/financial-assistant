import { EventTypes } from "../contracts/enums";
import AppController from "../controller/controller";
import EventObserver from "../observer/observer";
import Router from "./route";

class App {
  private controller: AppController;
  private observer: EventObserver;
  private router: Router;

  constructor() {
    this.observer = new EventObserver();
    this.router = new Router(this.observer);
    this.controller = new AppController(this.observer, this.router);
  }

  public start(): void {
    const path = this.router.getPath();
    this.observer.notify(EventTypes.CHANGE_PAGE, path);
  }
}

export default App;
