/* Word check with the phone's own speech recognizer (Android app only).
   Uses @capacitor-community/speech-recognition through the native bridge. The score is
   simple and honest: what share of the target words Google heard you say. */
(function(){
  const st = document.createElement("style");
  st.textContent = `
  .wchips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0 2px}
  .wchip{padding:6px 10px;border-radius:10px;font-weight:700;font-size:16px}
  .wchip.ok{background:var(--good-soft);color:var(--good)}.wchip.near{background:var(--warn-soft);color:var(--warn)}.wchip.miss{background:var(--red-soft);color:var(--red)}
  .listening{display:flex;align-items:center;justify-content:center;gap:8px;color:var(--red);font-weight:600}
  .listening i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blink 1s infinite}
  .heardlive{margin-top:6px;color:var(--ink2);font-size:15px;text-align:center}
  @keyframes blink{50%{opacity:.2}}`;
  document.head.appendChild(st);

  const isNative = () => { const C = window.Capacitor; if (!C) return false;
    if (C.isNativePlatform) return C.isNativePlatform(); if (C.getPlatform) return C.getPlatform() !== "web"; return !!C.isNative; };
  let cached;
  const plugin = () => {
    if (cached !== undefined) return cached;
    const C = window.Capacitor; cached = null;
    if (!isNative()) return cached;
    try { cached = (C.Plugins && C.Plugins.SpeechRecognition) || (C.registerPlugin ? C.registerPlugin("SpeechRecognition") : null); } catch(e) { cached = null; }
    return cached;
  };
  // short status line for the Speaking screen, so it's obvious which kind of check is running
  window.asrStatus = () => !isNative() ? "" : plugin() ? (checked === false ? "Word check unavailable on this phone" : "Word check: Google speech recognition (needs internet)") : "Word check unavailable (speech plugin missing)";
  let checked = null; // null unknown, true ok, false unavailable
  window.nativeSR = () => !!plugin() && checked !== false;

  /* One listening session per tap. Tap the mic to start, tap again when you're done.
     - Dictation mode (partialResults) so Google doesn't end the take at the first pause.
     - If the recognizer still ends on its own before the whole sentence is heard, it restarts and the pieces are joined.
     - Every session has an id, so a late result from an old take can never land on a new line. */
  let session = 0, active = null;
  const LIMIT_MS = 15000, NO_SPEECH_MS = 6500;
  const live = t => { const s = $("#status"); if (s) s.innerHTML = `<span class="listening"><i></i> Listening… tap the mic when you're done</span>${t ? `<div class="heardlive">“${esc(t)}”</div>` : ""}`; };
  const heardText = a => [...a.segs, a.cur[0] || ""].filter(Boolean).join(" ");
  const candidates = a => { const pre = a.segs.join(" "); const cur = a.cur.length ? a.cur : [""];
    return [...new Set(cur.map(c => (pre + " " + c).trim()).filter(Boolean))]; };
  async function cleanup(a){ clearTimeout(a.limit); clearTimeout(a.quiet); clearTimeout(a.pauseT); for (const h of a.handles) { try { await h.remove(); } catch(e){} } }
  window.nativeCancel = () => { const a = active; if (!a) return; active = null; a.cancelled = true; cleanup(a); try { plugin().stop(); } catch(e){} const b = $("#recbtn"); if (b) b.classList.remove("on"); };

  window.nativeListen = async function(it){
    const SR = plugin();
    if (active) return finish(active, true); // second tap = I'm done
    try {
      if (checked === null) {
        const av = await SR.available(); if (!av || !av.available) { checked = false; $("#status").textContent = ""; return noRecognizer(it); }
        checked = true;
      }
      const perm = await (SR.checkPermissions ? SR.checkPermissions() : Promise.resolve({speechRecognition:"prompt"}));
      if (perm.speechRecognition !== "granted") { const r = await SR.requestPermissions(); if (r.speechRecognition !== "granted") { $("#status").textContent = "Microphone permission is needed for speaking practice."; return; } }
    } catch(e) { checked = false; return noRecognizer(it); }
    stopAudio();
    const a = active = {id: ++session, it, segs: [], cur: [], handles: [], panel: $("#result"), started: Date.now(), gotSpeech: false};
    $("#recbtn").classList.add("on"); a.panel.innerHTML = ""; live("");
    // after the recognizer pauses, its final result for that piece arrives as one more event; only then restart
    const afterPause = async () => {
      if (active !== a || a.finishing) return;
      if (wholeHeard(a) || Date.now() - a.started > LIMIT_MS) return finish(a, false);
      if (a.cur.length) { a.segs.push(a.cur[0]); a.cur = []; }
      try { await SR.start({language: "is-IS", maxResults: 5, partialResults: true, popup: false}); } catch(e) { finish(a, false); }
    };
    a.handles.push(await SR.addListener("partialResults", d => {
      if (active !== a || !d || !d.matches || !d.matches.length) return;
      a.cur = d.matches.filter(Boolean); a.gotSpeech = true; clearTimeout(a.quiet); live(heardText(a));
      if (a.waitFinal) { a.waitFinal = false; clearTimeout(a.pauseT); a.pauseT = setTimeout(afterPause, 60); return; }
      if (wholeHeard(a)) finish(a, false); // said it all: no need to wait for a tap
    }));
    a.handles.push(await SR.addListener("listeningState", d => {
      if (active !== a || !d || d.status !== "stopped" || a.finishing) return;
      a.waitFinal = true; clearTimeout(a.pauseT); a.pauseT = setTimeout(() => { a.waitFinal = false; afterPause(); }, 1000);
    }));
    try { await SR.start({language: "is-IS", maxResults: 5, partialResults: true, popup: false}); }
    catch(e) {
      const msg = String((e && (e.message || e.code)) || e);
      await cleanup(a); active = null; $("#recbtn").classList.remove("on"); $("#status").textContent = "";
      if (/language|not supported|12|13/i.test(msg)) { checked = false; return noRecognizer(it); }
      a.panel.innerHTML = `<div class="why">Speech recognition didn't start (${esc(msg)}). Check your internet connection and try again.</div>`; return;
    }
    a.limit = setTimeout(() => finish(a, false), LIMIT_MS);
    a.quiet = setTimeout(() => { if (!a.gotSpeech) finish(a, false); }, NO_SPEECH_MS);
  };

  function wholeHeard(a){ // every target word heard (or nearly), so the take can end by itself
    return candidates(a).some(c => alignWords(a.it.is, c).st.every(x => x !== "miss"));
  }
  async function finish(a, byTap){
    if (!a || a.finishing || active !== a) return; a.finishing = true;
    const s = $("#status"); if (s) s.innerHTML = `<span class="loading">Checking…</span>`;
    try { await plugin().stop(); } catch(e){}
    await new Promise(z => setTimeout(z, 700)); // the final result arrives just after stop
    await cleanup(a); if (active !== a) return; active = null;
    const btn = $("#recbtn"); if (btn) btn.classList.remove("on");
    if (s && document.body.contains(s)) s.textContent = "";
    if (!document.body.contains(a.panel)) return; // moved on to another line
    const c = candidates(a);
    if (!c.length) { a.panel.innerHTML = `<div class="why">Didn't hear anything. Tap the mic, wait a moment, then speak.${byTap ? "" : " Holding the phone a little closer helps."}</div>`; return; }
    showWords(a.it, c);
  }

  function noRecognizer(it){
    $("#result").innerHTML = `<div class="why"><b>Icelandic speech recognition isn't available on this phone.</b> It comes from Google: open the Google app or Gboard settings → Voice typing → Languages, add <b>Íslenska</b>, and make sure you're online. Until then you can still use “Upload recording” for a rough sound match.</div>`;
  }

  // align target words with what was heard: ok / near (only accents or one letter off) / miss
  // How close two written words sound: same letters ignoring accents, y/i and double letters count as "almost".
  const NUM = {"1":["einn","ein","eitt","einum","eina"],"2":["tveir","tvær","tvö","tvo","tveimur"],"3":["þrír","þrjár","þrjú","þrjá","þremur"],"4":["fjórir","fjórar","fjögur","fjóra"],
    "5":["fimm"],"6":["sex"],"7":["sjö"],"8":["átta"],"9":["níu"],"10":["tíu"],"20":["tuttugu"],"100":["hundrað"],"1000":["þúsund"]};
  const key = w => strip(w.toLowerCase().replace(/æ/g,"ai").replace(/ey/g,"ei").replace(/ý/g,"í")).replace(/y/g,"i").replace(/(.)\1+/g,"$1"); // æ and ei are easy to mix up
  const wcost = (a,b) => {
    if (a === b || (NUM[b] && NUM[b].includes(a))) return 0;
    if (strip(a) === strip(b)) return 0.25;
    const ka = key(a), kb = key(b);
    if (ka === kb) return 0.3;
    return lev(ka, kb) <= Math.max(1, Math.floor(ka.length / 3.5)) ? 0.5 : 1;
  };
  // align target words with what was heard: ok / near (accent or a sound off) / miss
  function alignWords(target, heard){
    const T = norm(target).split(" ").filter(Boolean), U = norm(heard).split(" ").filter(Boolean);
    const n=T.length, m=U.length, D=[...Array(n+1)].map(()=>Array(m+1).fill(0));
    for (let i=0;i<=n;i++) D[i][0]=i; for (let j=0;j<=m;j++) D[0][j]=j*0.5;
    for (let i=1;i<=n;i++) for (let j=1;j<=m;j++) D[i][j]=Math.min(D[i-1][j]+1, D[i][j-1]+0.5, D[i-1][j-1]+wcost(T[i-1],U[j-1]));
    const st = Array(n).fill("miss"); let i=n, j=m;
    while (i>0 && j>0) {
      const c = wcost(T[i-1],U[j-1]);
      if (D[i][j] === D[i-1][j-1]+c) { st[i-1] = c===0 ? "ok" : c<1 ? "near" : "miss"; i--; j--; }
      else if (D[i][j] === D[i-1][j]+1) i--; else j--;
    }
    // Google sometimes splits or joins words differently ("ertu" / "ert þú"): give a word credit if its sounds
    // appear in that spot of the whole heard line
    const flat = key(U.join("")); let pos = 0;
    T.forEach((w,k) => { const kw = key(w), at = flat.indexOf(kw, pos);
      if (at >= 0) { pos = at + kw.length; if (st[k] === "miss" && kw.length >= 3) st[k] = "near"; } });
    const pts = st.reduce((s,x)=>s+(x==="ok"?1:x==="near"?0.75:0),0);
    return {words: target.split(" "), st, score: Math.round(100*pts/Math.max(1,n))};
  }

  function showWords(it, alts){
    const out = $("#result");
    if (!alts.length) { out.innerHTML = `<div class="why">Didn't catch anything. Try again, a little louder.</div>`; return; }
    let best = null;
    for (const a of alts) { const r = alignWords(it.is, a); if (!best || r.score > best.score) best = {...r, heard:a}; }
    const sc = best.score, col = sc>=75 ? "var(--good)" : sc>=50 ? "var(--warn)" : "var(--red)";
    const verdict = sc===100 ? "Fullkomið! Understood perfectly" : sc>=75 ? "Gott! Understood" : sc>=50 ? "Partly understood" : "Not understood yet";
    const b = store.get("best",{}); if (b[it.is]==null || sc > b[it.is]) { b[it.is] = sc; store.set("best", b); }
    out.innerHTML = `<div class="score" style="flex-direction:column;align-items:stretch">
      <div style="display:flex;align-items:center;gap:16px"><div class="ring" style="--p:${sc};--c:${col}"><b>${sc}</b></div>
      <div class="fb"><strong>${verdict}</strong>Google heard: “${esc(best.heard)}”</div></div>
      <div class="wchips">${best.words.map((w,k)=>`<span class="wchip ${best.st[k]}">${esc(w)}</span>`).join("")}</div>
      <div class="note" style="text-align:center">green = heard right · orange = almost (accent or a sound off) · red = not heard</div></div>
      <div class="btns" style="margin-top:10px"><button class="btn" id="model">${ICON.play} Model</button><button class="btn" id="modelslow">${ICON.play} ${slowLabel()}</button></div>`;
    $("#model").onclick = () => say(it.is);
    $("#modelslow").onclick = () => say(it.is, {level: Math.max(1, Math.min(2, state.speed + 1))});
    // colour the big target text word by word too
    const tgt = $("#tgt"); if (tgt) tgt.innerHTML = best.words.map((w,k)=>`<span style="color:${best.st[k]==="ok"?"var(--good)":best.st[k]==="near"?"var(--warn)":"var(--red)"}">${esc(w)}</span>`).join(" ");
  }
  window.alignWords = alignWords;
})();
