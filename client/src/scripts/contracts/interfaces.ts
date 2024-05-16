interface ResponseType {
  id: number;
  nameRus: string;
  nameEng: string;
}

interface Categories extends ResponseType {
  bankID: number;
  productID: number;
}

interface TableData {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface AssistantAnswer {
  bank: string;
  category: string;
  title: string;
  answer: string;
  link: string;
}

export { ResponseType, Categories, TableData, AssistantAnswer };
