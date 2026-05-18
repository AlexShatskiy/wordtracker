from typing import Literal
from pydantic import BaseModel, Field


Lang = Literal["en", "ru"]


class TranslateRequest(BaseModel):
    term: str = Field(min_length=1)
    lang: Lang = "en"


class TranslateResponse(BaseModel):
    term: str
    lang: Lang
    translation: str
    examples: list[str]
    source: str


class LLMOutput(BaseModel):
    """Structured output extracted from the LLM."""

    translation: str = Field(description="Translation of the term into the target language")
    examples: list[str] = Field(
        description=(
            "3 example sentences using the term. "
            "Each formatted as: '{lang_a} sentence — {lang_b} sentence'"
        )
    )
