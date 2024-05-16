# Financial Assistant

This is web-platform that consists of a knowledge base with a gathered and preprocessed banking data and a digital assistant capable of answering user queries in real-time.

Assistant is a question-answering system with a "Hybrid Retriever" architecture. Assistant's hybrid approach combines _BM25 Okapi_ algorithm for a keyword-based search ("Sparse retriever") and _Multilingual E5 embedding model_ for a semantic search ("Dense retriever"). Final results are sorted by _Mean Reciprocal Rank (MRR)_ to choose the most relevant text from the knowledge base.

## Server

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

## Client

### Quickstart

```powershell
1. cd client/
2. npm i
3. npm run build
4. npm run start
5. Project is running at: http://localhost:8080/
```

