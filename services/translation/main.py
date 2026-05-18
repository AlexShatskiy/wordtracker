from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from router import router

app = FastAPI(title="WordTracker Translation Service")
app.include_router(router)


@app.get("/health")
async def health():
    return {"ok": True, "service": "backend-python"}
