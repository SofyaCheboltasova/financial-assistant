import axios from "../../../node_modules/axios/index";

async function fetchBanks() {
  try {
    const response = await axios.get(" http://127.0.0.1:8000/banks/");
    return response.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    return [];
  }
}

async function fetchFinancialProducts() {
  try {
    const response = await axios.get("/financial-products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching financial products:", error);
    return [];
  }
}

export { fetchBanks, fetchFinancialProducts };

