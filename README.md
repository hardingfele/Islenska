# Íslenska — learn Icelandic

A scenario-based Icelandic course: 12 real-life scenes in the order of a trip to Iceland (airport, passport control, customs, bus, hotel, directions, café, grocery store, pool, gas station, small talk, pharmacy). There's also a reference course (vocabulary, grammar, reading, listening, speaking), spaced-repetition review, and pronunciation practice with scoring.

## Install

- **Android:** download `Islenska.apk` from the [latest release](../../releases/tag/latest) and open it on your phone. Android will ask you to allow installs from your browser.
- **Web:** the GitHub Pages site for this repo (see Settings → Pages). It runs on any phone or computer, and you can add it to your home screen.

## Layout

| Path | What |
|---|---|
| `web/` | The app: `index.html`, `journey.js`, `scorer.js`, `content/*.json`, `audio/<voice>.json` |
| `tools/` | Content sources (`content.py`, `scenes.py`) and the audio pipeline (`gen_audio.py`, which uses Piper TTS) |
| `.github/workflows/` | Builds the APK (Capacitor) and deploys the web version to GitHub Pages |

See `tools/PUBLISHING.md` for licences and the roadmap.

## Credits

Voices Búi, Salka, Steinn and Ugla are Piper voice models trained on the Talrómur corpus (Language and Voice Lab, Reykjavík University), released under CC BY 4.0. Hekla is a pitch-shifted version of Salka. The course content is original.
