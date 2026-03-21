# Perplexity AI(Mistral + LangChain + Multi-LLM)

A powerful **GenAI-based search assistant** inspired by Perplexity AI.  
This project leverages **Mistral AI**, **LangChain**, and multiple LLMs to provide **intelligent, context-aware answers** to user queries.

---

## 🚀 Overview

This application acts as an **AI-powered search engine** that:
- Accepts user queries
- Retrieves relevant information
- Uses LLMs to generate accurate, summarized, and contextual responses

It combines **retrieval + reasoning**, making it more powerful than traditional search systems.

---

## 🧠 Key Features

- 🔍 Smart Query Understanding  
- 🤖 Multi-LLM Support (Mistral + other LLMs)  
- 🔗 LangChain Integration  
- 📚 Context-Aware Responses  
- 🧠 Memory Support (optional)  
- ⚡ Fast & Scalable  

---

## 🏗️ Tech Stack

- Node.js  
- LangChain  
- Mistral AI  
- Other LLM APIs  
- JavaScript  

---

## ⚙️ How It Works

1. User enters a query  
2. Query is processed using LangChain  
3. System may:
   - Retrieve relevant data (RAG approach)
   - Pass query through multiple LLMs  
4. LLM generates a refined response  
5. Final answer is returned to the user  

---

## 📂 Project Structure

project-root/

├── src/
│   ├── chains/        # LangChain logic
│   ├── models/        # LLM configurations
│   ├── tools/         # Custom tools (search, APIs)
│   ├── utils/         # Helper functions
│   └── index.js       # Entry point

├── .env
├── package.json
└── README.md


---

## 🔑 Environment Variables

Create a `.env` file in the root directory:


MISTRAL_API_KEY=your_mistral_key
OTHER_LLM_API_KEY=your_other_llm_key




## 🛠️ Installation & Setup

### 1. Clone the repository

git clone (https://github.com/afdhruval/perplexity/tree/main)
cd perplexity-ai


### 2. Install dependencies

npm install


### 3. Add environment variables
Create a `.env` file (see above)

### 4. Run the project

npm run dev




## 💡 Example Usage

Ask: What is LangChain?

Response:
LangChain is a framework used to build applications powered by LLMs. It helps in chaining models, tools, and memory to build intelligent AI systems.




## 🔍 Use Cases

- AI-powered search engine  
- Chatbot with reasoning capabilities  
- Research assistant  
- Knowledge-based Q&A system  

---
## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Make your changes  
4. Submit a pull request  

---

## 📜 License

MIT License  

---

## 👨‍💻 Author
Dhruval  
