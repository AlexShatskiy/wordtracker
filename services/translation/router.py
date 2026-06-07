import logging

from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader

from config import settings
from schemas import TranslateRequest, TranslateResponse
from translation_service import translate

logger = logging.getLogger(__name__)

_secret_header = APIKeyHeader(name="X-Internal-Secret", auto_error=False)


def _require_internal(secret: str | None = Security(_secret_header)) -> None:
    if settings.internal_api_secret and secret != settings.internal_api_secret:
        raise HTTPException(status_code=403, detail="Forbidden")


router = APIRouter(dependencies=[Depends(_require_internal)])


@router.post("/translate", response_model=TranslateResponse)
async def translate_word(request: TranslateRequest) -> TranslateResponse:
    """Translate a word or phrase EN↔RU↔PL with example sentences and phonetic."""
    resolved_target = request.target_lang or ("ru" if request.lang == "en" else "en")

    try:
        result, source = await translate(request.term, request.lang, resolved_target)
    except RuntimeError as exc:
        logger.error("Translation failed for term=%r lang=%r: %s", request.term, request.lang, exc)
        raise HTTPException(status_code=503, detail="Translation service unavailable") from exc

    return TranslateResponse(
        term=request.term,
        lang=request.lang,
        translation=result.translation,
        phonetic=result.phonetic,
        examples=result.examples,
        source=source,
    )
