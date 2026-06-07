from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402

from config import settings  # noqa: E402
from router import router  # noqa: E402


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings.validate_keys()
    yield


app = FastAPI(title="WordTracker Translation Service", lifespan=lifespan)
app.include_router(router)


@app.get("/health")
async def health():
    return {"ok": True, "service": "backend-python"}
