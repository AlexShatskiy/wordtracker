# /backend-python
You work only inside services/translation/.
Stack: FastAPI, Python 3.11, Pydantic v2.
One job: receive a word, call LLM, return translation.
No DB, no users, no caching.
Fallback: Gemini 1.5 Flash → Groq Llama 3.1 8B.
