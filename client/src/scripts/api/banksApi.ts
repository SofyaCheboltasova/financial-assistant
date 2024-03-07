import axios from "../../../node_modules/axios/index";
import { Bank, Product } from "../contracts/interfaces";

const serverUrl: string = "http://127.0.0.1:8000/";

async function fetchBanks(): Promise<Bank[] | []> {
  try {
    const response = await axios.get(`${serverUrl}banks/`);
    return response.data as Bank[];
  } catch (error) {
    console.error("Error fetching banks:", error);
    return [];
  }
}

async function fetchFinancialProducts(): Promise<Product[] | []> {
  try {
    const response = await axios.get(`${serverUrl}financial-products/`);
    return response.data as Product[];
  } catch (error) {
    console.error("Error fetching financial products:", error);
    return [];
  }
}

export { fetchBanks, fetchFinancialProducts };

