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

  let listening = false;
  window.nativeListen = async function(it){
    const SR = plugin(), btn = $("#recbtn"), status = $("#status"), out = $("#result");
    if (listening) { try { await SR.stop(); } catch(e){} return; }
    try {
      if (checked === null) {
        const a = await SR.available(); if (!a || !a.available) { checked = false; status.textContent = ""; return noRecognizer(it); }
        checked = true;
      }
      const perm = await (SR.checkPermissions ? SR.checkPermissions() : Promise.resolve({speechRecognition:"prompt"}));
      if (perm.speechRecognition !== "granted") { const r = await SR.requestPermissions(); if (r.speechRecognition !== "granted") { status.textContent = "Microphone permission is needed for speaking practice."; return; } }
    } catch(e) { checked = false; return noRecognizer(it); }
    stopAudio(); listening = true; btn.classList.add("on"); out.innerHTML = "";
    status.innerHTML = `<span class="listening"><i></i> Listening… say it, then pause</span>`;
    let res;
    try { res = await SR.start({ language: "is-IS", maxResults: 5, partialResults: false, popup: false }); }
    catch(e) {
      listening = false; btn.classList.remove("on");
      const msg = String((e && (e.message || e.code)) || e);
      status.textContent = "";
      if (/no match|didn.t understand|7|No speech/i.test(msg)) { out.innerHTML = `<div class="why">Didn't catch anything. Tap the mic and speak a little louder, right after the beep.</div>`; return; }
      if (/language|not supported|12|13/i.test(msg)) { checked = false; return noRecognizer(it); }
      out.innerHTML = `<div class="why">Speech recognition stopped (${esc(msg)}). Check your internet connection and try again.</div>`; return;
    }
    listening = false; btn.classList.remove("on"); status.textContent = "";
    showWords(it, (res && res.matches) || []);
  };

  function noRecognizer(it){
    $("#result").innerHTML = `<div class="why"><b>Icelandic speech recognition isn't available on this phone.</b> It comes from Google: open the Google app or Gboard settings → Voice typing → Languages, add <b>Íslenska</b>, and make sure you're online. Until then you can still use “Upload recording” for a rough sound match.</div>`;
  }

  // align target words with what was heard: ok / near (only accents or one letter off) / miss
  function alignWords(target, heard){
    const T = norm(target).split(" ").filter(Boolean), U = norm(heard).split(" ").filter(Boolean);
    const cost = (a,b) => a===b ? 0 : strip(a)===strip(b) ? 0.4 : (lev(a,b) <= Math.max(1, Math.floor(a.length/4)) ? 0.6 : 1);
    const n=T.length, m=U.length, D=[...Array(n+1)].map(()=>Array(m+1).fill(0));
    for (let i=0;i<=n;i++) D[i][0]=i; for (let j=0;j<=m;j++) D[0][j]=j*0.5;
    for (let i=1;i<=n;i++) for (let j=1;j<=m;j++) D[i][j]=Math.min(D[i-1][j]+1, D[i][j-1]+0.5, D[i-1][j-1]+cost(T[i-1],U[j-1]));
    const st = Array(n).fill("miss"); let i=n, j=m;
    while (i>0 && j>0) {
      const c = cost(T[i-1],U[j-1]);
      if (D[i][j] === D[i-1][j-1]+c) { st[i-1] = c===0 ? "ok" : c<1 ? "near" : "miss"; i--; j--; }
      else if (D[i][j] === D[i-1][j]+1) i--; else j--;
    }
    const pts = st.reduce((s,x)=>s+(x==="ok"?1:x==="near"?0.6:0),0);
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
      <div class="note" style="text-align:center">green = heard right · orange = almost (accent or one sound off) · red = not heard</div></div>
      <div class="btns" style="margin-top:10px"><button class="btn" id="model">${ICON.play} Model</button><button class="btn" id="modelslow">🐢 Slowly</button></div>`;
    $("#model").onclick = () => say(it.is);
    $("#modelslow").onclick = () => say(it.is, {level: 1});
    // colour the big target text word by word too
    const tgt = $("#tgt"); if (tgt) tgt.innerHTML = best.words.map((w,k)=>`<span style="color:${best.st[k]==="ok"?"var(--good)":best.st[k]==="near"?"var(--warn)":"var(--red)"}">${esc(w)}</span>`).join(" ");
  }
  window.alignWords = alignWords;
})();
