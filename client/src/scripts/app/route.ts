import { Links } from "../contracts/enums";

class Router {
  private routes: Map<Links, () => void> = new Map();

  private getURL(): URL {
    return new URL(window.location.href);
  }

  public getPath(): Links {
    const path = this.getURL().pathname.slice(1);

    if (!this.isValidPath(path)) {
      throw new Error("Unavailable URL: " + path);
    }
    return path as Links;
  }

  get searchParams(): URLSearchParams {
    return this.getURL().searchParams;
  }

  private isValidPath(path: string): boolean {
    return Object.values(Links).includes(path as Links);
  }

  public resolveRoute() {
    const callback = this.routes.get(this.getPath());
    if (callback) callback();
  }

  public route(path: Links, callback: () => void): void {
    this.routes.set(path, callback);
  }

  public navigate(path: Links = Links.home) {
    history.pushState({}, "", path);
    const callback = this.routes.get(path);
    if (callback) callback();
  }
}

export default Router;

