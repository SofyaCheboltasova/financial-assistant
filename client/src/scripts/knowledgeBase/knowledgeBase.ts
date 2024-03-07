import { fetchBanks } from "../api/banksApi";
import { Bank } from "../contracts/interfaces";
class KnowledgeBase {
  public tag: HTMLDivElement;
  banks: Bank[] | [];

  constructor() {
    this.tag = document.createElement("div");
    this.banks = [];
    this.fetchBanks();
  }

  private async fetchBanks(): Promise<void> {
    try {
      this.banks = await fetchBanks();

      this.banks.forEach((bank) => {
        const div = document.createElement("div");
        div.textContent = bank.name;
        div.id = String(bank.id);
        div.classList.add("button");
        this.tag.appendChild(div);
      });

      this.setClasses();
    } catch (error) {
      console.error("Error initializing banks:", error);
    }
  }

  private async setClasses(): Promise<void> {
    this.tag.classList.add("base__wrapper");
  }
}

export default KnowledgeBase;

