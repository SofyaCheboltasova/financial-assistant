# 📱Financial Assistant

This is web-platform that consists of a knowledge base with a gathered and preprocessed banking data and a digital assistant capable of answering user queries in real-time.

Client side — SPA with MVC architecture. State management is implemented using an Observer pattern. Axios library is used to make requests to server.

Assistant is a question-answering system with a "Hybrid Retriever" architecture. Assistant's hybrid approach combines _BM25 Okapi_ algorithm for a keyword-based search ("Sparse retriever") and _Multilingual E5 embedding model_ for a semantic search ("Dense retriever"). Final results are sorted by _Mean Reciprocal Rank (MRR)_ to choose the most relevant text from the knowledge base.

![image](https://github.com/SofyaCheboltasova/financial-assistant/assets/96617834/e9fe13c8-9b5e-49e8-895c-859fd0db8422)

## 🔌Preview

![Preview](https://github.com/SofyaCheboltasova/financial-assistant/assets/96617834/a0fb6934-890a-45d2-8af8-4e9f3bff732b)


https://github.com/SofyaCheboltasova/financial-assistant/assets/96617834/0b4170c9-5848-498e-8f90-ae7717d41486


## 🔌Server

### Quickstart

**Install via pip**

```powershell
1. cd server1/server
2. pip install -r requirements.txt
```

**Run server**

```powershell
1. python manage.py runserver
```

## 🔌Client

### Quickstart

```powershell
1. cd client/
2. npm i
3. npm run build
4. npm run start
5. Project is running at: http://localhost:8080/
```

