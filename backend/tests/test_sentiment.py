"""Advisory SSENSE must never become a second gate for room/chat actions."""
import unittest

import httpx

from backend.commands import dispatch
from backend.chat import ChatManager
from backend.moderation import ModerationUnavailable
from backend.sentiment import SentimentAnalyzer
from backend.tests.test_moderation import StubModerator, drain


class SentimentTests(unittest.IsolatedAsyncioTestCase):
    async def test_provider_shape_cache_and_private_transport(self):
        requests = []

        def respond(request):
            requests.append(request)
            return httpx.Response(200, json={'sentiment': {'polarity': 'negative'}})

        service = SentimentAnalyzer(api_key='test', service_url='https://example.test/ssense',
                                    transport=httpx.MockTransport(respond))
        try:
            self.assertTrue(await service.check('negative text'))
            self.assertTrue(await service.check('negative text'))
            self.assertEqual(len(requests), 1)
            self.assertEqual(requests[0].headers['Apikey'], 'test')
            self.assertNotIn('negative text', str(service.cache))
            for polarity in ('positive', 'neutral', ''):
                self.assertFalse(service.parse({'sentiment': {'polarity': polarity}}))
            for invalid in ({}, [], {'sentiment': None}, {'sentiment': {}},
                            {'sentiment': {'polarity': 'unexpected'}}):
                with self.assertRaises(ModerationUnavailable):
                    service.parse(invalid)
        finally:
            await service.close()

    async def test_errors_are_not_cached(self):
        for status in (401, 429, 500):
            service = SentimentAnalyzer(api_key='test', service_url='https://example.test',
                transport=httpx.MockTransport(lambda request: httpx.Response(status)))
            try:
                with self.assertRaises(ModerationUnavailable):
                    await service.check('text')
                self.assertEqual(len(service.cache), 0)
            finally:
                await service.close()

    async def test_negative_preview_is_private_and_actions_still_work(self):
        manager = ChatManager()
        owner, guest = manager.connect(), manager.connect()
        drain(owner)
        drain(guest)

        class Negative:
            async def check(self, text):
                return True

        await dispatch(manager, owner, {'type': 'sentiment', 'requestId': 's',
                       'scope': 'title', 'text': 'negative'}, StubModerator(), Negative())
        self.assertTrue(drain(owner)[-1]['negative'])
        self.assertEqual(manager.rooms, {})
        self.assertEqual(drain(guest), [])
        # Saturating advisory checks must not consume the bullying budget.
        for _ in range(21):
            await dispatch(manager, owner, {'type': 'sentiment', 'scope': 'title',
                           'text': 'negative', 'requestId': 's'}, StubModerator(), Negative())
        await dispatch(manager, owner, {'type': 'create', 'title': 'negative',
                       'requestId': 'create'}, StubModerator(), Negative())
        self.assertTrue(drain(owner)[-1]['ok'])
        manager.handle(guest, {'type': 'join', 'roomId': owner.room_id})
        await dispatch(manager, owner, {'type': 'message', 'text': 'negative',
                       'requestId': 'message'}, StubModerator(), Negative())
        self.assertEqual(manager.rooms[owner.room_id].messages[-1]['text'], 'negative')
        await dispatch(manager, owner, {'type': 'message', 'text': 'bully',
                       'requestId': 'bully'}, StubModerator(), Negative())
        self.assertFalse(drain(owner)[-1]['ok'])

    async def test_missing_config_is_only_advisory(self):
        manager = ChatManager()
        client = manager.connect()
        await dispatch(manager, client, {'type': 'sentiment', 'scope': 'message',
                       'text': 'hello', 'requestId': 's'}, StubModerator())
        self.assertFalse(drain(client)[-1]['ok'])
        await dispatch(manager, client, {'type': 'create', 'title': 'hello',
                       'requestId': 'create'}, StubModerator())
        self.assertTrue(drain(client)[-1]['ok'])
