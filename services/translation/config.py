import sys

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str = ""
    groq_api_key: str = ""
    internal_api_secret: str = ""
    port: int = 8000

    def validate_keys(self) -> None:
        if not self.gemini_api_key and not self.groq_api_key:
            print(
                "ERROR: At least one of GEMINI_API_KEY or GROQ_API_KEY must be set.",
                file=sys.stderr,
            )
            sys.exit(1)


settings = Settings()
