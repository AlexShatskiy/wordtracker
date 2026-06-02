import logging
from fastapi import APIRouter, HTTPException

from schemas import TranslateRequest, TranslateResponse
from translation_service import translate

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def translate_word(request: TranslateRequest) -> TranslateResponse:
    """Translate a word or phrase EN↔RU↔PL with example sentences and phonetic."""
    resolved_target = request.target_lang or ("ru" if request.lang == "en" else "en")

    try:
        result, source = await translate(request.term, request.lang, resolved_target)
    except RuntimeError as exc:
        logger.error("Translation failed for term=%r lang=%r: %s", request.term, request.lang, exc)
        raise HTTPException(status_code=503, detail="Translation service unavailable")

    return TranslateResponse(
        term=request.term,
        lang=request.lang,
        translation=result.translation,
        phonetic=result.phonetic,
        examples=result.examples,
        source=source,
    )
