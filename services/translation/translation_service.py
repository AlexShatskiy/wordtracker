import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

from config import settings
from schemas import Lang, LLMOutput

logger = logging.getLogger(__name__)

_LANG_NAMES: dict[Lang, str] = {"en": "English", "ru": "Russian", "pl": "Polish"}

_PROMPT = ChatPromptTemplate.from_template(
    "You are a bilingual dictionary.\n\n"
    "Translate the {source_lang} word or phrase \"{term}\" into {target_lang}.\n"
    "Provide the IPA phonetic transcription of the source term (empty string if unknown).\n"
    "Then provide 2–3 example sentences that naturally use this word/phrase.\n"
    "Format each example as: \"{lang_a} sentence — {lang_b} sentence\"\n"
    "Always put {lang_a} first, regardless of translation direction.\n\n"
    "Return structured output only."
)


def _canonical_pair(lang_a: str, lang_b: str) -> tuple[str, str]:
    """Return (lang_a_name, lang_b_name) in stable alphabetical order."""
    first, second = (lang_a, lang_b) if lang_a < lang_b else (lang_b, lang_a)
    return _LANG_NAMES[first], _LANG_NAMES[second]


def _providers():
    return [
        (
            ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=settings.gemini_api_key,
            ),
            "gemini",
        ),
        (
            ChatGroq(
                model="llama-3.1-8b-instant",
                api_key=settings.groq_api_key,
            ),
            "groq",
        ),
    ]


async def translate(term: str, lang: Lang, target_lang: Lang) -> tuple[LLMOutput, str]:
    source_lang = _LANG_NAMES[lang]
    target_lang_name = _LANG_NAMES[target_lang]
    lang_a, lang_b = _canonical_pair(lang, target_lang)
    prompt_values = {
        "term": term,
        "source_lang": source_lang,
        "target_lang": target_lang_name,
        "lang_a": lang_a,
        "lang_b": lang_b,
    }

    last_error: Exception | None = None
    for llm, source_name in _providers():
        try:
            chain = _PROMPT | llm.with_structured_output(LLMOutput)
            result: LLMOutput = await chain.ainvoke(prompt_values)
            return result, source_name
        except Exception as exc:
            logger.warning("Provider %s failed for term=%r: %s", source_name, term, exc)
            last_error = exc

    raise RuntimeError(f"All LLM providers failed. Last error: {last_error}")
