import { fetchBanks } from "../api/banksApi";

class KnowledgeBase {
  public tag: HTMLDivElement;
  private banks: unknown;

  constructor() {
    this.tag = document.createElement("div");
    this.setClasses();
  }

  private async setClasses(): Promise<void> {
    this.tag.classList.add("base__wrapper");
    this.banks = await fetchBanks();
  }
}

export default KnowledgeBase;

