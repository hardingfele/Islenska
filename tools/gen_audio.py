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
todo = [t for t in texts if not os.path.exists(f"mp3/hekla_{ids[t]}.mp3")]
print(len(texts), "texts,", len(todo), "to synthesize")
if todo:
    for v in ["salka", "ugla", "bui", "steinn"]:
        inp = "".join(json.dumps({"text": t, "output_file": os.path.abspath(f"wav/{v}_{ids[t]}.wav")}, ensure_ascii=False) + "\n" for t in todo)
        subprocess.run([PIPER, "-m", f"{VOICES}/is-{v}-medium.onnx", "--json-input", "--sentence_silence", "0.1"], input=inp.encode(), cwd=os.path.dirname(PIPER), capture_output=True)
    jobs = []
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"  # trim only leading/trailing silence
    for v in ["salka", "ugla", "bui", "steinn", "hekla"]:
        for t in todo:
            i = ids[t]; src = f"wav/{'salka' if v == 'hekla' else v}_{i}.wav"
            af = ("asetrate=22050*1.14,aresample=22050,atempo=0.92," + trim) if v == "hekla" else trim
            jobs.append(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", af, "-ac", "1", "-ar", "22050", "-b:a", "40k", f"mp3/{v}_{i}.mp3"])
    with ThreadPoolExecutor(8) as ex: list(ex.map(subprocess.run, jobs))
os.makedirs("dist/audio", exist_ok=True)
for v in ["salka", "ugla", "bui", "steinn", "hekla"]:
    d = {i: base64.b64encode(open(f"mp3/{v}_{i}.mp3", "rb").read()).decode() for i in ids.values()}
    json.dump(d, open(f"dist/audio/{v}.json", "w"))
    print(v, len(d), os.path.getsize(f"dist/audio/{v}.json") // 1024, "KB")
