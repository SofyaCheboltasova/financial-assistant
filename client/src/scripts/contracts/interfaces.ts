interface Bank {
  id: number;
  nameRus: string;
  nameEng: string;
}

interface Product {
  id: number;
  nameRus: string;
  nameEng: string;
}

interface Categories {
  bankID: number;
  productID: number;
  nameRus: string;
  nameEng: string;
}

export { Bank, Product, Categories };

