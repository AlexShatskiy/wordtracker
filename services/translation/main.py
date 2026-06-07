from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402

from router import router  # noqa: E402

app = FastAPI(title="WordTracker Translation Service")
app.include_router(router)


@app.get("/health")
async def health():
    return {"ok": True, "service": "backend-python"}
