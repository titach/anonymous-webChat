"""SSENSE advisory analysis, reusing the bounded, private HTTP/cache transport."""
import os
from pathlib import Path

from dotenv import dotenv_values

if __package__:
    from .moderation import BullyingModerator, ModerationUnavailable
else:
    from moderation import BullyingModerator, ModerationUnavailable


class SentimentAnalyzer(BullyingModerator):
    @classmethod
    def from_env(cls):
        config = dotenv_values(Path(__file__).resolve().parents[1] / '.env', encoding='utf-8-sig')
        return cls(api_key=os.getenv('API_KEY', config.get('API_KEY', '')),
                   service_url=os.getenv('SSENSE_URL', config.get('SSENSE_URL', '')))

    @staticmethod
    def parse(payload):
        sentiment = payload.get('sentiment') if isinstance(payload, dict) else None
        if not isinstance(sentiment, dict):
            raise ModerationUnavailable('Invalid sentiment response')
        polarity = sentiment.get('polarity')
        if polarity not in ('negative', 'positive', 'neutral', ''):
            raise ModerationUnavailable('Invalid sentiment polarity')
        return polarity == 'negative'
