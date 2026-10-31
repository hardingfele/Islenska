"""Synthesize any text (from content.json + scenes.json) that has no audio yet, in all 5 voices,
then rebuild the per-voice audio packs. Idempotent: run after editing content."""
import json, hashlib, os, subprocess, base64, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
import content, scenes
PIPER = "/home/claude/piper/piper"; VOICES = "/home/claude/voices"
texts = content.all_texts(json.load(open("content.json"))) + scenes.texts(json.load(open("scenes.json"))["scenes"])
texts = list(dict.fromkeys(texts))
ids = {t: hashlib.md5(t.encode()).hexdigest()[:10] for t in texts}
json.dump(ids, open("ids.json", "w"), ensure_ascii=False)
PACKS = [("", "mp3", "wav", None), ("_slow", "mp3s", "wavs", "1.5")]  # normal + naturally slower speech
trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"  # trim only leading/trailing silence
os.makedirs("dist/audio", exist_ok=True)
for suffix, mdir, wdir, length in PACKS:
    os.makedirs(mdir, exist_ok=True); os.makedirs(wdir, exist_ok=True)
    todo = [t for t in texts if not os.path.exists(f"{mdir}/hekla_{ids[t]}.mp3")]
    print(suffix or "normal", ":", len(todo), "to synthesize")
    if todo:
        for v in ["salka", "ugla", "bui", "steinn"]:
            inp = "".join(json.dumps({"text": t, "output_file": os.path.abspath(f"{wdir}/{v}_{ids[t]}.wav")}, ensure_ascii=False) + "\n" for t in todo)
            cmd = [PIPER, "-m", f"{VOICES}/is-{v}-medium.onnx", "--json-input", "--sentence_silence", "0.25" if length else "0.1"]
            if length: cmd += ["--length_scale", length]
            subprocess.run(cmd, input=inp.encode(), cwd=os.path.dirname(PIPER), capture_output=True)
        jobs = []
        for v in ["salka", "ugla", "bui", "steinn", "hekla"]:
            for t in todo:
                i = ids[t]; src = f"{wdir}/{'salka' if v == 'hekla' else v}_{i}.wav"
                af = ("asetrate=22050*1.14,aresample=22050,atempo=0.92," + trim) if v == "hekla" else trim
                jobs.append(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", af, "-ac", "1", "-ar", "22050", "-b:a", "40k", f"{mdir}/{v}_{i}.mp3"])
        with ThreadPoolExecutor(8) as ex: list(ex.map(subprocess.run, jobs))
    for v in ["salka", "ugla", "bui", "steinn", "hekla"]:
        d = {i: base64.b64encode(open(f"{mdir}/{v}_{i}.mp3", "rb").read()).decode() for i in ids.values()}
        json.dump(d, open(f"dist/audio/{v}{suffix}.json", "w"))
        print(" ", v + suffix, len(d), os.path.getsize(f"dist/audio/{v}{suffix}.json") // 1024, "KB")
