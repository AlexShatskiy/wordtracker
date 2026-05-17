from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/health")
async def health():
    return {"ok": True, "service": "backend-python"}
