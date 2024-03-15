interface ResponseType {
  id: number;
  nameRus: string;
  nameEng: string;
}

interface Categories extends ResponseType {
  bankID: number;
  productID: number;
}

export { ResponseType, Categories };

