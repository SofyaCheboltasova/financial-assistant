import { EventTypes, Links } from "../contracts/enums";
import EventObserver from "../observer/observer";

class Router {
  private observer: EventObserver;
  private routes: Map<Links, () => void> = new Map();

  constructor(observer: EventObserver) {
    this.observer = observer;
    this.subscribeToUrlChange();
  }

  private subscribeToUrlChange() {
    this.observer.subscribe(EventTypes.CHANGE_PAGE, this.navigate.bind(this));
    window.addEventListener("popstate", () => this.resolveRoute());
    window.addEventListener("hashchange", () => this.resolveRoute());
  }

  public getPath(): Links {
    const url = new URL(window.location.href);
    const path = url.pathname.slice(1);

    if (!this.isValidPath(path)) {
      throw new Error("Unavailable URL: " + path);
    }
    return path === "" ? Links.home : (path as Links);
  }

  private isValidPath(path: string): boolean {
    return Object.values(Links).includes(path as Links) || path === "";
  }

  public resolveRoute() {
    const callback = this.routes.get(this.getPath());
    if (callback) callback();
  }

  public route(path: Links, callback: () => void): void {
    this.routes.set(path, callback);
  }

  private updateURL(path: Links): void {
    const url = new URL(location.toString());
    url.pathname = path;
    history.pushState(null, "", url.toString());
  }

  private navigate(path: Links = Links.home) {
    this.updateURL(path);
    const callback = this.routes.get(path);
    if (callback) callback();
  }
}

export default Router;

