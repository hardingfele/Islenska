# Íslenska app: notes for publishing later

## How it's built now
- **Engine and content are separate.** `index.html`, `journey.js` and `scorer.js` hold all the logic. Every Icelandic sentence lives in `content/scenes.json` (scenarios) and `content/reference.json` (the original course). Adding a scene means editing data, not code.
- **Audio is generated from the content.** `gen_audio.py` finds any text without audio, synthesizes it in all 5 voices with Piper, and rebuilds the `audio/<voice>.json` packs. Clips are keyed by a hash of the text, so if a sentence changes, it gets new audio automatically.
- **Source files:** `content.py` (reference course), `scenes.py` (scenarios), `gen_audio.py`, `app.html`, `journey.js`, `scorer.js`, `build.py`.

## Licences (checked 28 Oct 2026)
- The Piper Icelandic voices (Búi, Salka, Steinn, Ugla) are released on CLARIN-IS under **CC BY 4.0**. Commercial use is allowed with attribution, and the app's About screen already carries a credit line. Hekla is a modified (pitch-shifted) Salka. CC BY requires saying when material was changed, and the About screen says so.
- The **Talrómur paper** is CC BY-NC-ND. That licence covers the paper, not the voice models. Re-check the corpus licence before training any new voices on it.
- The course text is original.
- **Emoji** render with each device's own emoji font, so they need no licence. Custom illustrations would be needed for a consistent brand look.

## What has to change before a public release
1. **Native-speaker review** of all Icelandic text (about 470 phrases). This is the biggest credibility risk.
2. **Real voices for the core dialogues.** Synthetic voices are fine for drills, but paid apps are judged on how the audio sounds. Option: record 2–3 native speakers for the scene dialogues and keep TTS for the long tail.
3. **Pronunciation scoring.** The current sound match is rough. Production options:
   - Run an Icelandic speech-recognition model on a server. Iceland's Language Technology Programme publishes open Icelandic ASR models and data, e.g. the Samrómur speech corpus.
   - Or use a commercial pronunciation-assessment API, if one supports Icelandic. Check the vendor's language list first.
4. **Accounts and sync.** Progress is currently stored only in the browser on one device. Publishing means a backend (or a platform database) for user progress, plus a privacy policy, because voice recordings count as personal data under GDPR.
5. **Packaging.** It's a web app now. Options: an installable PWA (needs a service worker, which Claude-hosted pages don't allow, so it has to be self-hosted), or wrap it with Capacitor for the App Store and Google Play.
6. **AI chat.** It currently runs through Claude inside the hosted page. A standalone app would need its own model-API key on a server, with rate limits and a cost per user.
7. **Internationalisation.** UI strings are English. Move them into a strings file before adding other source languages (e.g. Scandinavian learners).

## Content roadmap ideas
- More scenes: renting a car, a restaurant dinner, a hike or guided tour, a doctor visit, a bakery, a weather emergency or a closed road.
- A short story that runs through all the scenes, so they connect.
- A spoken check at the end of each scene instead of picking options (needs better speech recognition).
- Culture notes per scene: pool rules, tipping (not expected), names (people use first names; surnames are patronymics), the Yule Lads.
