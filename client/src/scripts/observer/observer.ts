import { EventTypes } from "../contracts/enums";

class EventObserver {
  private observers: { [eventType: string]: ((data: any) => void)[] } = {};

  public subscribe(eventType: EventTypes, observer: (data: any) => void): void {
    if (!this.observers[eventType]) {
      this.observers[eventType] = [];
    }
    this.observers[eventType].push(observer);
  }

  public unsubscribe(eventType: string, observer: (data: any) => void): void {
    if (this.observers[eventType]) {
      this.observers[eventType] = this.observers[eventType].filter(
        (obs) => obs !== observer
      );
    }
  }

  public notify(eventType: EventTypes, data?: any): void {
    if (this.observers[eventType]) {
      this.observers[eventType].forEach((observer) => observer(data));
    }
  }
}

export default EventObserver;

