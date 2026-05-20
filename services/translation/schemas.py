import re
from typing import Literal
from pydantic import BaseModel, Field, field_validator


Lang = Literal["en", "ru"]

_TERM_MAX_LENGTH = 50

# Null bytes, ASCII control chars, and characters with no place in a dictionary term.
_DANGEROUS_CHARS_RE = re.compile(r"[\x00-\x1f\x7f<>;\\`]")

_PROMPT_INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(previous|prior|above|all)\s+instructions", re.IGNORECASE),
    re.compile(r"system\s*prompt", re.IGNORECASE),
    re.compile(r"you\s+are\s+now", re.IGNORECASE),
    re.compile(r"act\s+as\s+", re.IGNORECASE),
    re.compile(r"jailbreak", re.IGNORECASE),
    re.compile(r"disregard\s+(all|any|previous)", re.IGNORECASE),
]


class TranslateRequest(BaseModel):
    term: str = Field(min_length=1, max_length=_TERM_MAX_LENGTH)
    lang: Lang = "en"

    @field_validator("term", mode="before")
    @classmethod
    def validate_term(cls, v: object) -> object:
        if not isinstance(v, str):
            return v
        v = v.strip()
        if not v:
            raise ValueError("term must not be empty or whitespace only")
        if _DANGEROUS_CHARS_RE.search(v):
            raise ValueError("term contains invalid characters")
        if any(p.search(v) for p in _PROMPT_INJECTION_PATTERNS):
            raise ValueError("term contains disallowed content")
        return v


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
