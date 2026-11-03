"""Rebuild content/scenes.json and content/ids.json, then synthesize audio for any text
that has no clip yet and add it to the existing web/audio/<voice>.json packs.

Unlike gen_audio.py this needs no local mp3 cache: it works straight from the packs in the repo,
so it can run in GitHub Actions. Existing clips are never re-synthesized.

  python tools/add_audio.py --check        # list texts without audio, change nothing
  python tools/add_audio.py --voices DIR   # DIR holds is_IS-<voice>-medium.onnx (+ .onnx.json)
"""
import argparse, base64, hashlib, json, os, subprocess, sys, tempfile, wave
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, "web")
sys.path.insert(0, os.path.join(ROOT, "tools"))
import content, scenes  # noqa: E402

BASE = ["salka", "ugla", "bui", "steinn"]
ALL = BASE + ["hekla"]                       # hekla = salka pitched up
# Hekla: Salka 6% higher with formants kept, so she sounds like a different woman rather than a sped-up one.
# Changing this string rebuilds every Hekla clip on the next run (it is stored in the packs under "__fx").
HEKLA_FX = "rubberband=pitch=1.06:formant=preserved"
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
PACKS = [("", None, 0.1), ("_slow", "auto", 0.25)]  # suffix, length_scale, silence between sentences (s)
# Slow clips aim for about 0.7x speaking speed. Measured on the old 1.5 stretch, clips came out at 0.75x (long
# sentences) to 0.83x (single words), because fixed lead-in/out silence and Piper's pauses don't stretch.
# So short phrases get a stronger stretch. Changing SLOW_V rebuilds every slow clip (stored in packs as "__slow").
SLOW_V = "v2: 2.05/1.8/1.72/1.64 by word count"
def slow_len(t):
    w = len(t.split())
    return 2.05 if w == 1 else 1.8 if w == 2 else 1.72 if w <= 4 else 1.64
TRIM = ("silenceremove=start_periods=1:start_threshold=-60dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-62dB,apad=pad_dur=0.2,areverse,apad=pad_dur=0.08")


def build_content():
    sc = scenes.build()
    json.dump({"scenes": sc, "reactions": [{"is": a, "en": b} for a, b in scenes.REACTIONS]},
              open(os.path.join(WEB, "content", "scenes.json"), "w"), ensure_ascii=False, indent=1)
    ref = json.load(open(os.path.join(WEB, "content", "reference.json")))
    texts = list(dict.fromkeys(content.all_texts(ref) + scenes.texts(sc)))
    ids = {t: hashlib.md5(t.encode()).hexdigest()[:10] for t in texts}
    json.dump(ids, open(os.path.join(WEB, "content", "ids.json"), "w"), ensure_ascii=False)
    return ids


def pack_path(v, suffix):
    return os.path.join(WEB, "audio", f"{v}{suffix}.json")


def synth(voice, text, out, length, silence):
    from piper import PiperVoice, SynthesisConfig
    syn = SynthesisConfig(length_scale=length)
    gap = None
    with wave.open(out, "wb") as w:
        first = True
        for k, chunk in enumerate(voice.synthesize(text, syn)):
            if first:
                w.setframerate(chunk.sample_rate); w.setsampwidth(chunk.sample_width); w.setnchannels(chunk.sample_channels)
                gap = bytes(int(chunk.sample_rate * silence) * 2); first = False
            if k > 0: w.writeframes(gap)
            w.writeframes(chunk.audio_int16_bytes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--voices", default=os.environ.get("PIPER_VOICES", "voices"))
    a = ap.parse_args()

    ids = build_content()
    packs = {(v, s): json.load(open(pack_path(v, s))) for v in ALL for s, _, _ in PACKS}
    need = {}
    for v in ALL:
        for s, _, _ in PACKS:
            p = packs[(v, s)]
            redo = (v == "hekla" and p.get("__fx") != HEKLA_FX) or (s == "_slow" and p.get("__slow") != SLOW_V)
            need[(v, s)] = [t for t, i in ids.items() if redo or i not in p]
    for s, _, _ in PACKS:
        texts = {t for v in ALL for t in need[(v, s)]}
        print(f"{s or 'normal'}: {len(texts)} of {len(ids)} texts need audio" + (f" (rebuilds: Hekla {len(need[('hekla', s)])}, Salka {len(need[('salka', s)])})" if need[("hekla", s)] else ""))
        for t in [t for t in ids if t in texts and t not in need[("hekla", s)]][:60]: print("   ", t)
    if a.check or not any(need.values()):
        return
    if any(need[("hekla", s)] for s, _, _ in PACKS):
        flt = subprocess.run([FFMPEG, "-hide_banner", "-filters"], capture_output=True, text=True).stdout
        if " rubberband " not in flt: sys.exit(f"{FFMPEG} has no rubberband filter (needed for Hekla)")

    from piper import PiperVoice
    tmp = tempfile.mkdtemp()
    for v in BASE:
        voice = PiperVoice.load(os.path.join(a.voices, f"is_IS-{v}-medium.onnx"))
        for s, length, silence in PACKS:
            want = list(dict.fromkeys(need[(v, s)] + (need[("hekla", s)] if v == "salka" else [])))
            for t in want:
                synth(voice, t, os.path.join(tmp, f"{v}{s}_{ids[t]}.wav"), slow_len(t) if length == "auto" else length, silence)
        print("synthesized", v)

    jobs = []
    for v in ALL:
        for s, _, _ in PACKS:
            for t in need[(v, s)]:
                i = ids[t]; src = os.path.join(tmp, f"{'salka' if v == 'hekla' else v}{s}_{i}.wav")
                af = (HEKLA_FX + "," + TRIM) if v == "hekla" else TRIM
                jobs.append([FFMPEG, "-y", "-loglevel", "error", "-i", src, "-af", af, "-ac", "1", "-ar", "22050",
                             "-b:a", "40k", os.path.join(tmp, f"{v}{s}_{i}.mp3")])
    with ThreadPoolExecutor(8) as ex:
        for r in ex.map(lambda c: subprocess.run(c).returncode, jobs):
            if r: sys.exit("ffmpeg failed")

    for v in ALL:
        for s, _, _ in PACKS:
            p = packs[(v, s)]
            if v == "hekla": p["__fx"] = HEKLA_FX
            if s == "_slow": p["__slow"] = SLOW_V
            for t in need[(v, s)]:
                p[ids[t]] = base64.b64encode(open(os.path.join(tmp, f"{v}{s}_{ids[t]}.mp3"), "rb").read()).decode()
            json.dump(p, open(pack_path(v, s), "w"))
            print("  ", v + s, len(p), "clips")


if __name__ == "__main__":
    main()
