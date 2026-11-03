/* Journey (scenario units), Review (spaced repetition) and Chat (Claude role-play).
   Depends on globals from index.html: $, esc, say, stopAudio, playBtn, ICON, store, shuffle,
   toast, sheet, norm, strip, state, VOICES, SC, REACT, C, crumbs, route, render,
   toggleRecord, assess, stopRecording, micOK, MIC_NOTE_HOSTED. */

(function injectStyles(){
  const css = `
  .seg{display:flex;gap:4px;background:var(--line);padding:3px;border-radius:10px}
  .seg button{flex:1;padding:6px 8px;border-radius:8px;font-size:13px;font-weight:600;color:var(--ink2)}
  .seg button.on{background:var(--card);color:var(--ink);box-shadow:var(--shadow)}
  .path{display:grid;gap:10px;position:relative}
  .pathcard{display:flex;gap:14px;align-items:center;background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);padding:12px 14px;text-align:left;width:100%}
  .pathcard .emo{width:52px;height:52px;flex:0 0 52px;border-radius:14px;display:grid;place-items:center;font-size:28px;background:var(--ice)}
  .pathcard.done .emo{background:var(--good-soft)}
  .pathcard .t{flex:1;min-width:0}.pathcard .t b{display:block;font-family:Fraunces,serif;font-size:17px}
  .pathcard .t span{color:var(--mute);font-size:13.5px}
  .dots{display:flex;gap:4px;margin-top:6px}.dots i{width:16px;height:5px;border-radius:3px;background:var(--line)}.dots i.on{background:var(--good)}
  .banner{border-radius:20px;padding:18px;color:#fff;margin-bottom:12px;background:linear-gradient(135deg,#02529c,#0b6fc9 60%,#4aa3e8);position:relative;overflow:hidden}
  .banner .emo{position:absolute;right:10px;bottom:-14px;font-size:92px;opacity:.9;filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))}
  .banner h2{font-size:26px;max-width:75%}.banner .sub{opacity:.85;font-size:14px;margin-top:2px;max-width:70%}
  .banner .num{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.8}
  .steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:12px}
  .steps button{padding:7px 2px;border-radius:12px;background:var(--card);box-shadow:var(--shadow);font-size:11.5px;font-weight:600;color:var(--ink2);line-height:1.2;display:flex;flex-direction:column;align-items:center;gap:1px}
  .steps button b{font-size:15px}
  .steps button.on{background:var(--blue);color:#fff}.steps button.done:not(.on){color:var(--good)}
  .signs{display:flex;flex-wrap:wrap;gap:8px}
  .sign{background:#f5c400;color:#111;font-weight:800;padding:8px 12px;border-radius:6px;font-size:15px;letter-spacing:.02em;box-shadow:inset 0 0 0 2px #111}
  .sign small{display:block;font-weight:500;font-size:11.5px}
  .reveal{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--line);color:var(--ink2);font-size:12px;font-weight:700;margin-left:6px;vertical-align:1px}
  .wgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .wcard{background:var(--card);border-radius:14px;box-shadow:var(--shadow);padding:14px 10px;text-align:center}
  .wcard .e{font-size:38px;line-height:1.1}.wcard .w{font-weight:700;margin-top:6px}.wcard .tr{font-size:13px}
  .wcard.right{outline:3px solid var(--good)}.wcard.wrong{outline:3px solid var(--red);opacity:.6}
  .tipcard p{margin:0 0 8px}
  .answerline{min-height:54px;border-bottom:2px solid var(--line);display:flex;flex-wrap:wrap;gap:6px;padding:8px 0;margin:8px 0 12px}
  .tiles{display:flex;flex-wrap:wrap;gap:6px}
  .tile{padding:9px 12px;border-radius:10px;background:var(--card);border:1.5px solid var(--line);font-weight:600;font-size:16px;box-shadow:0 2px 0 var(--line)}
  .tile.used{visibility:hidden}
  .answerline.ok .tile{border-color:var(--good);background:var(--good-soft)}
  .answerline.bad{animation:shake .35s}
  @keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .chatlog{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
  .bubble{max-width:84%;padding:10px 12px;border-radius:16px;font-size:16px;line-height:1.4}
  .bubble.npc{background:var(--card);box-shadow:var(--shadow);align-self:flex-start;border-bottom-left-radius:4px}
  .bubble.me{background:var(--blue);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
  .bubble.me.wrong{background:var(--red-soft);color:var(--red)}
  .bubble .who{font-size:11px;font-weight:700;opacity:.65;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
  .bubble .tr{color:var(--ink2);font-size:14px}.bubble.me .tr{color:#cfe2f7}.bubble.me .reveal{background:rgba(255,255,255,.25);color:#fff}
  .fix{align-self:flex-end;max-width:84%;font-size:13.5px;background:var(--warn-soft);color:var(--ink2);padding:8px 10px;border-radius:10px}
  .choice{display:block;width:100%;text-align:left;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--card);font-weight:600;margin-bottom:8px}
  .chatbar{display:flex;gap:8px;align-items:center}
  .chatbar input{flex:1;font:inherit;font-size:16px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);outline:none}
  .hero{position:relative;display:flex;align-items:center;width:100%;text-align:left;color:#fff;border-radius:22px;padding:18px;margin-bottom:18px;overflow:hidden;box-shadow:0 8px 22px rgba(2,82,156,.25)}
  .hero-t{flex:1;z-index:1}.hero h2{font-size:26px;margin:2px 0}.hero .num{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.85}.hero .sub{font-size:13px;opacity:.9;letter-spacing:.1em}
  .hero-pic{font-size:76px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25));margin-right:30px}
  .hero-go{position:absolute;right:14px;bottom:14px;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--blue);display:grid;place-items:center;font-size:14px;box-shadow:0 4px 10px rgba(0,0,0,.2)}
  .gridhead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px}
  .scgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  @media (min-width:600px){.scgrid{grid-template-columns:repeat(3,1fr)}}
  .sctile{position:relative;aspect-ratio:1/1;border-radius:20px;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;padding:12px;text-align:left;overflow:hidden;box-shadow:var(--shadow)}
  .sctile b{font-family:Fraunces,serif;font-size:16px;line-height:1.15;z-index:1;text-shadow:0 1px 3px rgba(0,0,0,.25)}
  .sc-pic{position:absolute;top:50%;left:50%;transform:translate(-50%,-62%);font-size:62px;line-height:1;filter:drop-shadow(0 5px 8px rgba(0,0,0,.25))}
  .sc-num{position:absolute;top:10px;left:12px;font-size:12px;font-weight:800;opacity:.85}
  .ring5{position:absolute;top:8px;right:8px;width:28px;height:28px}
  .sc-check{position:absolute;top:8px;right:8px;width:28px;height:28px;display:grid;place-items:center;font-weight:900;font-size:14px}
  .sctile.done .ring5 circle:last-child{stroke:#fff}
  .wcard .e{display:flex;justify-content:center;min-height:72px;align-items:center}
  .btns .btn.turtlebig{flex:0 0 72px;font-size:24px;padding:8px}
  .big-due{font-family:Fraunces,serif;font-size:48px;font-weight:700;line-height:1}
  /* ---- lesson mode: full screen, nothing hidden behind bars ---- */
  body.lesson header.top, body.lesson nav.bottom{display:none}
  body.lesson .app{padding-bottom:0;min-height:0}
  body.lesson main{padding:0}
  .lesson{height:100vh;height:100dvh;display:flex;flex-direction:column}
  .ltop{display:flex;align-items:center;gap:12px;padding:calc(12px + env(safe-area-inset-top)) 14px 0}
  .lx{width:44px;height:44px;flex:0 0 44px;border-radius:50%;background:var(--chip);color:var(--onbg);display:grid;place-items:center;font-size:19px}
  .lprog{flex:1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}
  .lseg{display:flex;flex-direction:column;gap:5px;padding:6px 0;color:var(--onbg2);font-size:10.5px;font-weight:600;line-height:1}
  .lseg i{display:block;height:6px;border-radius:3px;background:var(--track)}
  .lseg.done i{background:var(--progress)} .lseg.on i{background:var(--onbg)} .lseg.on{color:var(--onbg)}
  .lseg span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .lhead{padding:12px 20px 8px}
  .lkick{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--kicker)}
  .lsub{color:var(--onbg2);font-size:14.5px;margin-top:3px;line-height:1.35}.lsub b{color:var(--onbg);font-weight:600}
  .lbody{flex:1;min-height:0;overflow-y:auto;padding:6px 16px 16px;display:flex;flex-direction:column;gap:10px}
  .lbody.center>:first-child{margin-top:auto}.lbody.center>:last-child{margin-bottom:auto}
  .lbody .card,.lbody .lcard{margin:0}
  .lcard{background:var(--card);border-radius:24px;padding:18px}
  .lbar{background:var(--sheet);border-radius:26px 26px 0 0;padding:14px 16px calc(14px + env(safe-area-inset-bottom));max-height:62vh;overflow-y:auto;display:flex;flex-direction:column;gap:10px;box-shadow:0 -6px 24px rgba(0,0,0,.12)}
  .lbar:empty{display:none}
  .lbar .btns{margin:0}.lbar .btn{min-height:52px;font-size:16.5px}.lbar .choice{margin:0 0 8px;min-height:52px;font-size:16.5px}
  .lbar .choice:last-child{margin-bottom:0}
  .lkick2{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2);margin-bottom:8px}
  .lhint{color:var(--onbg2);font-size:13.5px;text-align:center;margin:4px 8px 0}
  /* word card */
  .wordcard{display:flex;flex-direction:column;align-items:center;text-align:center;padding:26px 18px 18px;border-radius:28px}
  .wbig{font-family:Fraunces,Georgia,serif;font-size:40px;font-weight:700;line-height:1.1;margin-top:12px}
  .wmean{font-size:18px;color:var(--ink2);margin-top:4px;min-height:24px}
  .wplay{margin-top:14px}.wplay .play{width:64px;height:64px;flex-basis:64px}.wplay .play svg{width:24px;height:24px}.wplay .play.turtle{font-size:28px}
  .wplay .pbpair{gap:12px}
  .wex{display:flex;gap:10px;align-items:center;text-align:left;width:100%;border-top:1px solid var(--line);margin-top:16px;padding-top:14px}
  .wex .tr{font-size:14px}
  .wdots{display:flex;justify-content:center;gap:6px;margin-top:4px}
  .wdots i{width:8px;height:8px;border-radius:4px;background:var(--track)}.wdots i.seen{background:var(--progress)}.wdots i.on{width:22px;background:var(--onbg)}
  .wprev{flex:0 0 60px!important;font-size:26px!important;padding:0}
  .ltest .progress{color:var(--onbg2)}
  .ltest .listenbig .play{background:var(--blue);color:#fff}
  .ltest .wgrid{gap:12px}.ltest .wcard{padding:16px 10px;border-radius:20px}
  /* conversation */
  .lwho{display:flex;align-items:center;gap:10px;color:var(--onbg2);font-size:13px;line-height:1.3}
  .lwho b{color:var(--onbg);font-size:15px}
  .lav{display:inline-grid;place-items:center;border-radius:50%;background:var(--avatar);color:var(--avatarink);font-family:Fraunces,serif;font-weight:700;flex:0 0 auto}
  .sbs{display:flex;flex-direction:column;gap:8px}
  .sb{display:flex;align-items:center;gap:8px;max-width:88%;padding:10px 10px 10px 14px;border-radius:20px;background:var(--card);transition:box-shadow .2s}
  .sb.npc{align-self:flex-start;border-top-left-radius:6px}
  .sb.me{align-self:flex-end;background:var(--ice);border-top-right-radius:6px}
  .sb.hl{box-shadow:0 0 0 3px var(--progress)}
  .sb .sbt{flex:1;min-width:0}.sb .is{font-size:16.5px}.sb .tr{font-size:14px}
  .sb.wrong{background:var(--red-soft);color:var(--red)}.sb.wrong .is{text-decoration:line-through}
  .lsigns{display:flex;flex-wrap:wrap;gap:8px}
  .sb.me .play{background:var(--card)}
  body.lesson .toast{bottom:auto;top:calc(64px + env(safe-area-inset-top))}
  .lbar .target{margin-top:0}.lbar .recrow{margin:4px 0}.lbar .score{margin-top:6px}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* ---------- shared bits ---------- */
const SCENE_COLORS = [["#0b6fc9","#4aa3e8"],["#3949ab","#7986cb"],["#00897b","#4db6ac"],["#f57c00","#ffb74d"],["#6d4c41","#a1887f"],["#2e7d32","#81c784"],
  ["#8d6e63","#d7a86e"],["#c2185b","#f06292"],["#0277bd","#4fc3f7"],["#455a64","#90a4ae"],["#7b1fa2","#ba68c8"],["#d32f2f","#ef9a9a"]];
const sceneBg = i => `linear-gradient(135deg,${SCENE_COLORS[i%12][0]},${SCENE_COLORS[i%12][1]})`;
const STEPS = [ // words first, so the dialogue is easier to follow
  {id:"words", is:"Orð", en:"Words", ic:"🃏"},
  {id:"watch", is:"Horfa", en:"Watch", ic:"👀"},
  {id:"tips", is:"Ábending", en:"Pointers", ic:"💡"},
  {id:"build", is:"Smíða", en:"Build", ic:"🧩"},
  {id:"role", is:"Hlutverk", en:"Role-play", ic:"🎭"},
];
const jprog = () => store.get("jprog", {});
function markStep(sid, step){ const p = jprog(); p[sid] = p[sid] || {}; p[sid][step] = 1; store.set("jprog", p); }
function npcVoice(sc){
  if (sc.npc.g === "f") return state.voice === "ugla" ? "salka" : "ugla";
  return state.voice === "steinn" ? "bui" : "steinn";
}
// English help: "show" always visible, "tap" behind a ? button. Auto fades out after the first 4 scenes.
function engMode(idx){ const p = store.get("eng","auto"); return p === "auto" ? (idx < SC.filter(x=>x.intro).length + 4 ? "show" : "tap") : p; }
function en(text, mode, block=true){
  if (!text) return "";
  if (mode === "show") return `<span class="tr" ${block?"":'style="display:inline"'}>${esc(text)}</span>`;
  return `<button class="reveal" data-en="${esc(text)}" data-block="${block?1:0}" aria-label="Show English">?</button>`;
}
document.addEventListener("click", e => {
  const r = e.target.closest(".reveal[data-en]");
  if (!r) return;
  e.stopPropagation();
  const s = document.createElement("span"); s.className = "tr"; s.textContent = r.dataset.en;
  if (r.dataset.block === "0") s.style.display = "inline";
  r.replaceWith(s);
}, true);

/* ---------- deck for review ---------- */
function addToDeck(keys){
  const d = store.get("deck", {}); let n = 0;
  for (const k of keys) if (!d[k]) { d[k] = {box:0, due:0}; n++; }
  store.set("deck", d); return n;
}
function deckItem(key){
  const [kind, text] = [key.slice(0,1), key.slice(2)];
  for (const sc of SC) {
    if (kind === "w") { const w = sc.words.find(x=>x.is===text); if (w) return {kind, is:w.is, en:w.en, pic:w.pic, scene:sc}; }
    else { const b = sc.build.find(x=>x.is===text) || sc.dialogue.find(x=>x.is===text); if (b) return {kind, is:b.is, en:b.en, scene:sc}; }
  }
  return null;
}

/* ================= JOURNEY ================= */
function Journey(){
  const m = $("#main");
  document.body.classList.toggle("lesson", route.sub != null);
  if (route.sub == null) {
    const p = jprog();
    const doneSteps = sc => STEPS.filter(s => (p[sc.id]||{})[s.id]).length;
    const doneCount = SC.filter(sc => doneSteps(sc) === STEPS.length).length;
    let next = SC.findIndex(sc => doneSteps(sc) < STEPS.length); if (next < 0) next = 0;
    const nx = SC[next];
    const ring = (n) => `<svg class="ring5" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="4"/><circle cx="18" cy="18" r="15" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="${n/5*94.2} 94.2" transform="rotate(-90 18 18)"/></svg>`;
    m.innerHTML = `
      <button class="hero" data-sc="${next}" style="background:${sceneBg(next)}">
        <div class="hero-t"><div class="num">${doneCount ? "Halda áfram · continue" : "Byrjum · let's start"}</div><h2>${esc(nx.is_title)}</h2><div class="sub">${next+1} / ${SC.length} · ${STEPS.map(s=>(p[nx.id]||{})[s.id]?"●":"○").join(" ")}</div></div>
        <div class="hero-pic">${nx.pic}</div><span class="hero-go">▶</span></button>
      ${[["Fyrstu skrefin","First steps",sc=>sc.intro],["Ferðin","The trip",sc=>!sc.intro]].map(([is,en,f]) => `
      <div class="gridhead"><h2 class="sectiontitle" style="margin:0">${is} <span class="note" style="font-family:Inter;font-weight:500;font-size:14px">· ${en}</span></h2>${is==="Ferðin"?`<span class="note">${doneCount}/${SC.length} ✓</span>`:`<button class="note" id="howBtn" style="color:var(--blue2);font-weight:600">How this works</button>`}</div>
      <div class="scgrid" style="margin-bottom:18px">${SC.map((sc,i) => { if (!f(sc)) return ""; const n = doneSteps(sc);
        return `<button class="sctile ${n===5?"done":""}" data-sc="${i}" style="background:${sceneBg(i)}">
          <span class="sc-num">${i+1}</span>${ring(n)}${n===5?'<span class="sc-check">✓</span>':""}
          <span class="sc-pic">${sc.pic}</span><b>${esc(sc.is_title)}</b></button>`; }).join("")}</div>`).join("")}`;
    $("#howBtn").onclick = showWelcome;
    m.querySelectorAll("[data-sc]").forEach(b => b.onclick = () => {
      const i = +b.dataset.sc, sp = jprog()[SC[i].id] || {};
      route.sub = {i, step: (STEPS.find(s=>!sp[s.id]) || STEPS[0]).id}; Journey(); window.scrollTo(0,0);
    });
    return;
  }
  // ---- lesson: full screen, one step at a time, action pinned at the bottom ----
  const {i, step} = route.sub, sc = SC[i], mode = engMode(i), sp = jprog()[sc.id] || {};
  const cur = STEPS.find(s => s.id === step);
  m.innerHTML = `<div class="lesson">
    <div class="ltop">
      <button class="lx" data-back aria-label="Close lesson"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="lprog">${STEPS.map(s=>`<button class="lseg ${s.id===step?"on":""} ${sp[s.id]?"done":""}" data-step="${s.id}" aria-label="${s.en}${sp[s.id]?" (done)":""}"><i></i><span>${s.en}</span></button>`).join("")}</div>
      <button class="lx" id="lspd" aria-label="Speech speed: ${SPEEDS[state.speed].en}">${SPEEDS[state.speed].ic}</button>
    </div>
    <div class="lhead"><div class="lkick">${esc(cur.is)} · ${esc(cur.en)}</div><div class="lsub"><b>${sc.pic} ${esc(sc.is_title)}</b> · ${esc(mode==="show" ? sc.setting : sc.en_title)}</div></div>
    <div class="lbody" id="stepbody"></div>
    <div class="lbar" id="lbar"></div>
  </div>`;
  m.querySelectorAll("[data-step]").forEach(b => b.onclick = () => { stopAudio(); stopRecording(true); route.sub = {i, step: b.dataset.step}; Journey(); });
  $("#lspd").onclick = () => { setSpeed((state.speed + 1) % 3); toast(`${SPEEDS[state.speed].ic} ${SPEEDS[state.speed].en} speech`); };
  ({watch:stepWatch, words:stepWords, tips:stepTips, build:stepBuild, role:stepRole})[step](sc, i, mode, $("#stepbody"));
}
const bar = html => { const b = $("#lbar"); if (b) b.innerHTML = html || ""; };
function nextStepBtn(sc, i, cur){
  const k = STEPS.findIndex(s=>s.id===cur);
  if (k < STEPS.length-1) return `<button class="btn primary block lnext" id="nextstep">Next: ${STEPS[k+1].en} ›</button>`;
  return i < SC.length-1 ? `<button class="btn primary block lnext" id="nextstep">Next scene: ${esc(SC[i+1].is_title)} ›</button>` : `<button class="btn primary block lnext" id="nextstep">Back to the journey</button>`;
}
function bindNextStep(sc, i, cur){
  const b = $("#nextstep"); if (!b) return;
  b.onclick = () => {
    markStep(sc.id, cur); stopAudio();
    const k = STEPS.findIndex(s=>s.id===cur);
    if (k < STEPS.length-1) route.sub = {i, step: STEPS[k+1].id};
    else if (i < SC.length-1) route.sub = {i:i+1, step:STEPS[0].id};
    else route.sub = null;
    Journey(); window.scrollTo(0,0);
  };
}
const voiceName = id => VOICES.find(v=>v.id===id).name;
const npcAvatar = (sc, size=36) => `<span class="lav" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.45)}px">${esc(sc.npc.role[0])}</span>`;

/* --- 1 Watch: the scene as a conversation --- */
function stepWatch(sc, i, mode, el){
  const nv = npcVoice(sc);
  el.innerHTML = `
    ${sc.signs.length ? `<div class="lsigns">${sc.signs.map(s=>`<button class="sign" data-say="${esc(s.is)}">${esc(s.is)}${mode==="show"?`<small>${esc(s.en)}</small>`:""}</button>`).join("")}</div>` : ""}
    <div class="lwho">${npcAvatar(sc)}<span><b>${esc(sc.npc.role)}</b> ${sc.npc.en!==sc.npc.role?en(sc.npc.en, mode, false):""}<br><small>voice ${voiceName(nv)} · you: ${voiceName(state.voice)}</small></span></div>
    <div class="sbs">${sc.dialogue.map((l,k)=>`<div class="sb ${l.spk==="A"?"npc":"me"}" data-k="${k}"><div class="sbt"><span class="is">${esc(l.is)}</span>${en(l.en, mode)}</div>${playBtn(l.is,"sm",l.spk==="A"?nv:state.voice)}</div>`).join("")}</div>
    <p class="lhint">You won't catch every word, and that's the point. Listen for the words you just learned.</p>`;
  bar(`<div class="btns"><button class="btn" id="playscene" style="flex:1">${ICON.play} Play the scene</button><button class="btn turtlebig" id="slowscene" aria-label="Play the whole scene slowly">🐢</button></div>${nextStepBtn(sc, i, "watch")}`);
  const hl = k => el.querySelectorAll(".sb").forEach(d => { const on = +d.dataset.k===k; d.classList.toggle("hl", on); if (on) d.scrollIntoView({block:"nearest", behavior:"smooth"}); });
  // play the dialogue line by line; level: null = current speed, 1 = slow, 2 = slowest
  let sceneRun = 0;
  const pBtn = $("#playscene"), tBtn = $("#slowscene");
  const resetPlay = () => { delete pBtn.dataset.on; pBtn.innerHTML = ICON.play + " Play the scene"; };
  const playScene = async (level) => {
    const run = ++sceneRun;
    pBtn.dataset.on = 1; pBtn.innerHTML = ICON.stop + " Stop";
    for (let k=0;k<sc.dialogue.length;k++) {
      hl(k); const l = sc.dialogue[k];
      const ok = await say(l.is, {voice: l.spk==="A"?nv:state.voice, level: level==null ? undefined : level});
      if (!ok || run !== sceneRun) return false;
      await new Promise(z=>setTimeout(z, level ? 650 : 450));
      if (run !== sceneRun) return false;
    }
    hl(-1); if (document.body.contains(pBtn)) resetPlay();
    return true;
  };
  pBtn.onclick = () => {
    if (pBtn.dataset.on) { sceneRun++; stopAudio(); hl(-1); resetPlay(); clearTimeout(tBtn._t); setSnail(tBtn, false); return; }
    setSnail(tBtn, false); playScene(null);
  };
  tBtn.onclick = async () => { // 🐢 slow; while it shows 🐌, tapping restarts from the first line even slower
    const snail = tBtn.dataset.mode === "snail";
    clearTimeout(tBtn._t); setSnail(tBtn, true);
    const done = await playScene(snail ? 2 : Math.max(1, Math.min(2, state.speed + 1)));
    if (done) tBtn._t = setTimeout(() => { if (document.body.contains(tBtn)) setSnail(tBtn, false); }, 3000);
  };
  bindNextStep(sc, i, "watch");
}

/* --- 2 Words: one card at a time, then a picture test --- */
function exampleFor(sc, w){
  const n = norm(w.is), stem = n.length > 4 ? n.slice(0, n.length - 1) : n;
  const has = t => (" " + norm(t) + " ").includes(" " + n + " ") || (stem.length > 3 && norm(t).split(" ").some(x => x.startsWith(stem)));
  return sc.dialogue.find(l => norm(l.is) !== n && has(l.is)) || sc.build.find(b => norm(b.is) !== n && has(b.is)) || null;
}
function stepWords(sc, i, mode, el){
  const k = Math.max(0, Math.min(sc.words.length - 1, route.sub.wi || 0)), w = sc.words[k], ex = exampleFor(sc, w);
  el.classList.add("center");
  el.innerHTML = `<div class="lcard wordcard">
      ${pictogram(w.pic, 112)}
      <div class="wbig">${esc(w.is)}</div>
      <div class="wmean">${mode==="show" ? esc(w.en) : en(w.en, "tap", false)}</div>
      <div class="wplay">${playBtn(w.is, "big")}</div>
      ${ex ? `<div class="wex">${playBtn(ex.is, "sm", "", true)}<div><span class="is">${esc(ex.is)}</span>${en(ex.en, mode)}</div></div>` : ""}
    </div>
    <div class="wdots" aria-label="Word ${k+1} of ${sc.words.length}">${sc.words.map((_,n)=>`<i class="${n<k?"seen":n===k?"on":""}"></i>`).join("")}</div>`;
  const last = k === sc.words.length - 1;
  bar(`<div class="btns"><button class="btn ghost wprev" id="wprev" ${k?"":"disabled"} aria-label="Previous word">‹</button><button class="btn primary" id="wnext" style="flex:1">${last ? "Test yourself" : "Next word ›"}</button></div>`);
  const moveTo = n => { stopAudio(); route.sub.wi = n; stepWords(sc, i, mode, el); };
  $("#wprev").onclick = () => moveTo(k - 1);
  $("#wnext").onclick = () => { if (last) { route.sub.wi = 0; el.classList.remove("center"); wordTest(sc, i, el); } else moveTo(k + 1); };
  say(w.is).catch(()=>{});
}
function wordTest(sc, i, el){
  const order = shuffle(sc.words); let k = 0, right = 0;
  const draw = () => {
    if (k >= order.length) {
      const n = addToDeck(sc.words.map(w=>"w:"+w.is));
      el.classList.add("center");
      el.innerHTML = `<div class="lcard" style="text-align:center"><div class="big-due">${right}/${order.length}</div><p style="margin:8px 0 0;color:var(--ink2)">${right===order.length?"Perfect.":"Good. The ones you missed will come back in Review."}</p>${n?`<p class="note" style="margin:6px 0 0">${n} words added to your review deck.</p>`:""}</div>`;
      bar(`<div class="btns"><button class="btn ghost" id="wagain" style="flex:0 0 auto">Again</button>${nextStepBtn(sc, i, "words").replace('class="btn primary block lnext"','class="btn primary lnext" style="flex:1"')}</div>`);
      $("#wagain").onclick = () => { el.classList.remove("center"); wordTest(sc, i, el); }; bindNextStep(sc, i, "words"); markStep(sc.id, "words"); return;
    }
    const w = order[k], opts = shuffle([w, ...shuffle(sc.words.filter(x=>x!==w)).slice(0,3)]);
    el.innerHTML = `<div class="ltest"><div class="progress"><span>Which picture? ${k+1} of ${order.length}</span><span>${right} right</span></div>
      <div class="listenbig"><button class="play" id="wp" aria-label="Hear the word again">${ICON.play}</button></div>
      <div class="wgrid">${opts.map((o,n)=>`<button class="wcard" data-n="${n}"><div class="e">${pictogram(o.pic, 72)}</div></button>`).join("")}</div></div>`;
    bar("");
    const play = () => say(w.is, {btn: $("#wp")});
    $("#wp").onclick = play; play();
    el.querySelectorAll("[data-n]").forEach(b => b.onclick = () => {
      if (el.querySelector(".wcard.right")) return;
      const o = opts[+b.dataset.n];
      el.querySelectorAll("[data-n]").forEach(x => { if (opts[+x.dataset.n]===w) { x.classList.add("right"); x.insertAdjacentHTML("beforeend", `<div class="w">${esc(w.is)}</div>`); } });
      if (o !== w) b.classList.add("wrong"); else right++;
      if (o !== w) { const d = store.get("deck",{}); if (d["w:"+w.is]) { d["w:"+w.is] = {box:0, due:0}; store.set("deck", d); } }
      setTimeout(() => { k++; draw(); }, o===w ? 900 : 1700);
    });
  };
  draw();
}

/* --- 3 Pointers --- */
function stepTips(sc, i, mode, el){
  el.classList.add("center");
  el.innerHTML = sc.tips.map(t => `<div class="lcard tipcard"><p>💡 ${esc(t.en)}</p>${t.ex.map(x=>`<div class="ex">${playBtn(x,"sm")}<span class="is">${esc(x)}</span></div>`).join("")}</div>`).join("");
  bar(nextStepBtn(sc, i, "tips"));
  bindNextStep(sc, i, "tips");
}

/* --- 4 Build: put the words in order --- */
function stepBuild(sc, i, mode, el){
  let k = 0;
  el.classList.add("center");
  const draw = () => {
    if (k >= sc.build.length) {
      const n = addToDeck(sc.build.map(b=>"s:"+b.is));
      el.innerHTML = `<div class="lcard" style="text-align:center"><h3>Vel gert! <span class="note">· well done</span></h3>${n?`<p class="note" style="margin:6px 0 0">${n} phrases added to your review deck.</p>`:""}</div>`;
      bar(nextStepBtn(sc, i, "build")); bindNextStep(sc, i, "build"); markStep(sc.id, "build"); return;
    }
    const b = sc.build[k], words = b.is.split(" "), tiles = shuffle(words.map((w,n)=>({w,n})));
    if (tiles.map(t=>t.n).join() === words.map((_,n)=>n).join() && words.length > 1) tiles.reverse();
    const picked = [];
    el.innerHTML = `<div class="lcard"><div class="progress"><span>${k+1} of ${sc.build.length}</span><span></span></div>
      <div style="display:flex;align-items:center;gap:10px">${playBtn(b.is,"sm")}<div><span class="note">Say this in Icelandic:</span> ${mode==="show"?`<b>${esc(b.en)}</b>`:en(b.en,"tap",false)}</div></div>
      <div class="answerline" id="ansl"></div><div class="tiles" id="tiles"></div></div>`;
    bar(`<div class="btns"><button class="btn ghost" id="reset">Reset</button><button class="btn" id="hint">Hint</button></div><div id="bres"></div>`);
    const ansl = $("#ansl"), tl = $("#tiles");
    const paint = () => {
      tl.innerHTML = tiles.map((t,x)=>`<button class="tile ${picked.includes(x)?"used":""}" data-x="${x}">${esc(t.w)}</button>`).join("");
      ansl.innerHTML = picked.map((x,p)=>`<button class="tile" data-p="${p}">${esc(tiles[x].w)}</button>`).join("");
      tl.querySelectorAll("[data-x]").forEach(t => t.onclick = () => { if (!picked.includes(+t.dataset.x)) { picked.push(+t.dataset.x); paint(); check(); } });
      ansl.querySelectorAll("[data-p]").forEach(t => t.onclick = () => { if (ansl.classList.contains("ok")) return; picked.splice(+t.dataset.p,1); paint(); });
    };
    const check = () => {
      if (picked.length < tiles.length) return;
      const ok = picked.map(x=>tiles[x].w).join(" ") === b.is;
      if (ok) { ansl.classList.add("ok"); say(b.is); bar(`<button class="btn primary block lnext" id="bnext">${k < sc.build.length-1 ? "Next sentence ›" : "Done ›"}</button>`); $("#bnext").onclick = () => { k++; draw(); }; }
      else { ansl.classList.remove("bad"); void ansl.offsetWidth; ansl.classList.add("bad"); $("#bres").innerHTML = `<div class="why" style="margin-top:10px">Not quite. Tap words in the answer to send them back.</div>`; }
    };
    $("#reset").onclick = () => { picked.length = 0; ansl.className = "answerline"; $("#bres").innerHTML = ""; paint(); };
    $("#hint").onclick = () => { // place the next correct word
      if (ansl.classList.contains("ok")) return;
      const pos = picked.findIndex((x,p)=>tiles[x].w !== words[p]);
      if (pos >= 0) picked.length = pos;
      const need = words[picked.length], x = tiles.findIndex((t,xx)=>t.w===need && !picked.includes(xx));
      if (x >= 0) { picked.push(x); paint(); check(); }
    };
    paint();
  };
  draw();
}

/* --- 5 Role-play: you are the traveller; the conversation fills the screen, your options sit in the sheet --- */
function stepRole(sc, i, mode, el){
  const nv = npcVoice(sc);
  const otherU = SC.filter(x=>x!==sc).flatMap(x=>x.dialogue.filter(l=>l.spk==="U"));
  let pos = 0;
  el.innerHTML = `<div class="lwho">${npcAvatar(sc)}<span><b>${esc(sc.npc.role)}</b> ${sc.npc.en!==sc.npc.role?en(sc.npc.en, mode, false):""}<br><small>You're the traveller. Pick what you'd say, then say it out loud.</small></span></div><div class="sbs" id="log"></div>`;
  bar(`<div id="act"><button class="btn primary block lnext" id="rstart">${ICON.play} Start</button></div>`);
  const log = $("#log"), act = () => $("#act");
  const bubble = (who, text, trn, cls="") => {
    log.insertAdjacentHTML("beforeend", `<div class="sb ${who==="npc"?"npc":"me"} ${cls}"><div class="sbt"><span class="is">${esc(text)}</span>${trn?en(trn, mode==="show"?"show":"tap"):""}</div></div>`);
    log.lastElementChild.scrollIntoView({block:"nearest", behavior:"smooth"});
  };
  const advance = async () => {
    while (pos < sc.dialogue.length && sc.dialogue[pos].spk === "A") {
      const l = sc.dialogue[pos]; bubble("npc", l.is, l.en);
      act().innerHTML = `<p class="loading">…</p>`;
      await say(l.is, {voice:nv}); await new Promise(z=>setTimeout(z, 250)); pos++;
    }
    if (pos >= sc.dialogue.length) {
      markStep(sc.id, "role");
      bar(`<div class="why" style="text-align:center;margin-bottom:10px">🎉 Atriði lokið · scene complete!</div>${nextStepBtn(sc, i, "role")}`); bindNextStep(sc, i, "role"); return;
    }
    choose();
  };
  const choose = (removed=[]) => {
    const l = sc.dialogue[pos], valid = [{is:l.is, en:l.en}, ...(l.alts||[])];
    const wrong = shuffle(otherU.filter(o=>!removed.includes(o.is))).slice(0, valid.length > 1 ? 1 : 2);
    const opts = shuffle([...valid.map(v=>({...v, ok:true})), ...wrong.map(w=>({is:w.is, en:w.en, ok:false}))]);
    act().innerHTML = `<div class="lkick2">Your reply</div>` + opts.map((o,n)=>`<button class="choice" data-n="${n}">${esc(o.is)}</button>`).join("");
    act().querySelectorAll("[data-n]").forEach(b => b.onclick = async () => {
      const o = opts[+b.dataset.n];
      if (!o.ok) {
        bubble("me", o.is, null, "wrong"); act().innerHTML = "";
        const r = REACT[Math.floor(Math.random()*REACT.length)];
        bubble("npc", r.is, r.en); await say(r.is, {voice:nv});
        choose([...removed, o.is]); return;
      }
      bubble("me", o.is, o.en); speak(o);
    });
  };
  const speak = (o) => {
    const it = {is:o.is, en:o.en};
    act().innerHTML = `<div class="lkick2">Now say it</div>
      <div class="target" id="tgt" style="font-size:22px">${[...o.is].map(c=>`<span class="ch">${esc(c)}</span>`).join("")}</div>
      <div class="recrow"><button class="play" id="hear" aria-label="Hear it">${ICON.play}</button><button class="rec" id="recbtn" aria-label="Record" ${micOK===false?'style="opacity:.35"':""}>${ICON.mic}</button>${turtleBtn(o.is)}</div>
      <label class="upload">Upload recording<input type="file" accept="audio/*,.m4a,.mp3,.wav,.aac,.ogg,.webm" id="file"></label>
      <div id="status" class="loading"></div>${window.asrStatus && asrStatus() ? `<p class="note" style="text-align:center;margin:2px 0 0">${asrStatus()}</p>` : ""}<div id="result"></div>
      <button class="btn primary block" style="margin-top:10px" id="cont">Continue ›</button>`;
    $("#hear").onclick = e => say(o.is, {btn:e.currentTarget});
    $("#recbtn").onclick = () => toggleRecord(it);
    $("#file").onchange = async e => { const f = e.target.files[0]; if (f) await assess(it, await f.arrayBuffer(), null); e.target.value = ""; };
    $("#cont").onclick = () => { stopRecording(true); pos++; advance(); };
    say(o.is).catch(()=>{});
  };
  $("#rstart").onclick = () => advance();
}

/* ================= REVIEW (spaced repetition) ================= */
const INTERVALS = [0, 1, 3, 7, 16, 35]; // days per box
function Review(){
  const m = $("#main"), d = store.get("deck", {}), now = Date.now();
  const keys = Object.keys(d).filter(k => deckItem(k));
  const due = keys.filter(k => d[k].due <= now);
  if (route.sub == null) {
    m.innerHTML = `<h2 class="sectiontitle">Upprifjun</h2><p class="lede">Words and phrases from the scenes you've done come back just before you'd forget them.</p>
      <div class="card" style="text-align:center"><div class="big-due">${due.length}</div><div class="note">due now · ${keys.length} in your deck</div>
      ${due.length ? `<button class="btn primary block" style="margin-top:12px" id="rstart">Start review</button>` : keys.length ? `<p class="lede" style="margin:10px 0 0">All caught up. Come back tomorrow.</p><button class="btn block" style="margin-top:10px" id="rextra">Practise anyway</button>` : `<p class="lede" style="margin:10px 0 0">Nothing yet. Do the Words and Build steps in a scene to fill your deck.</p><button class="btn primary block" style="margin-top:10px" id="rgo">Go to the journey</button>`}</div>
      ${keys.length ? `<div class="card"><div class="note" style="margin-bottom:6px">Deck strength</div><div class="segs" style="height:10px">${[0,1,2,3,4,5].map(b=>{const n=keys.filter(k=>d[k].box===b).length;return n?`<i style="flex:${n};background:${["#dc1e35","#e8743b","#c77700","#7aa83a","#1d8a5a","#02529c"][b]}"></i>`:""}).join("")}</div><div class="note" style="margin-top:6px">red = new or missed · blue = well known</div></div>` : ""}`;
    const s = $("#rstart"), x = $("#rextra"), g = $("#rgo");
    if (s) s.onclick = () => { route.sub = {q: shuffle(due).slice(0, 20), k:0, ok:0}; Review(); };
    if (x) x.onclick = () => { route.sub = {q: shuffle(keys).slice(0, 12), k:0, ok:0, extra:true}; Review(); };
    if (g) g.onclick = () => go("journey");
    return;
  }
  const R = route.sub;
  if (R.k >= R.q.length) { m.innerHTML = crumbs("Done") + `<div class="card" style="text-align:center"><div class="big-due">${R.ok}/${R.q.length}</div><p class="lede">remembered. Góð vinna!</p><button class="btn primary block" id="rback">Done</button></div>`; $("#rback").onclick = () => { route.sub = null; Review(); }; return; }
  const key = R.q[R.k], it = deckItem(key); let flipped = false;
  const draw = () => {
    m.innerHTML = crumbs(`${R.k+1} of ${R.q.length}`) + `<div class="card flash" id="rc">
      ${it.kind==="w" ? pictogram(it.pic, 110) : `<div class="meaning" style="color:var(--ink)">${esc(it.en)}</div>`}
      ${flipped ? `<div class="big" style="font-size:${it.kind==="w"?32:24}px">${esc(it.is)}</div>${it.kind==="w"?`<div class="tr">${esc(it.en)}</div>`:""}<div>${playBtn(it.is)}</div>` : `<div class="hint">${it.kind==="w"?"What's this in Icelandic? Say it, then tap.":"How do you say this? Say it, then tap."}</div>`}
      <div class="note">${it.scene.pic} ${esc(it.scene.is_title)}</div></div>
      ${flipped ? `<div class="grade"><button class="btn" style="background:var(--red-soft);color:var(--red)" data-g="0">Again</button><button class="btn" data-g="1">Got it</button><button class="btn primary" data-g="2">Easy</button></div>` : `<button class="btn primary block" id="rflip">Show answer</button>`}`;
    const flip = () => { flipped = true; draw(); say(it.is).catch(()=>{}); };
    $("#rc").onclick = e => { if (!flipped && !e.target.closest("button")) flip(); };
    const f = $("#rflip"); if (f) f.onclick = flip;
    m.querySelectorAll("[data-g]").forEach(b => b.onclick = () => {
      const g = +b.dataset.g, dk = store.get("deck", {}), c = dk[key] || {box:0, due:0};
      if (!R.extra || g === 0) {
        c.box = g === 0 ? 0 : Math.min(5, c.box + g);
        c.due = Date.now() + INTERVALS[c.box] * 864e5 - 36e5; // an hour early is fine
        dk[key] = c; store.set("deck", dk);
      }
      if (g > 0) R.ok++;
      R.k++; Review();
    });
  };
  draw();
}

/* ================= CHAT (Claude plays the local) ================= */
let sampleFn = null, chatReady = false;
async function initChat(){
  try {
    if (window.claude && typeof window.claude.use === "function") sampleFn = await window.claude.use("sample");
  } catch(e) { sampleFn = null; }
  chatReady = true;
  if (route.s === "chat") Chat();
}
let chat = null; // {i, msgs:[{role, is, en, fix}]}
function Chat(){
  const m = $("#main");
  if (!chatReady) { m.innerHTML = `<p class="loading">Loading…</p>`; return; }
  if (!sampleFn) {
    m.innerHTML = `<h2 class="sectiontitle">Spjall</h2><div class="card"><p style="margin:0">Free conversation with Claude playing a local is only available in the Claude-hosted version of this app. The rest of the app works everywhere.</p></div>`;
    return;
  }
  if (!chat) {
    m.innerHTML = `<h2 class="sectiontitle">Spjall</h2><p class="lede">Improvise. Claude plays the local in a scene and answers in simple Icelandic. Make mistakes — you'll get a short correction in English.</p>
      <div class="list">${SC.map((sc,i)=>`<button class="pathcard" data-ci="${i}"><div class="emo" style="background:${sceneBg(i)}">${sc.pic}</div><div class="t"><b>${esc(sc.is_title)}</b><span>${esc(sc.npc.role)} · ${esc(sc.en_title)}</span></div><span class="chev">›</span></button>`).join("")}</div>`;
    m.querySelectorAll("[data-ci]").forEach(b => b.onclick = () => { chat = {i:+b.dataset.ci, msgs:[]}; Chat(); chatTurn(null); });
    return;
  }
  const sc = SC[chat.i];
  m.innerHTML = `<div class="crumbs"><button id="chback">‹ Chat</button><span>/ ${esc(sc.is_title)}</span></div>
    <div class="card"><div class="chatlog" id="clog">${chat.msgs.map(msg => msg.role==="npc"
      ? `<div class="bubble npc"><div class="who">${esc(sc.npc.role)}</div>${esc(msg.is)}${msg.en?`<div>${en(msg.en,"tap",false)}</div>`:""}</div>`
      : `<div class="bubble me">${esc(msg.is)}</div>${msg.fix?`<div class="fix">✏️ ${esc(msg.fix)}</div>`:""}`).join("")}
      ${chat.busy?`<div class="bubble npc"><span class="loading">…</span></div>`:""}</div>
      <div class="keys">${"á é í ó ú ý þ ð æ ö".split(" ").map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div>
      <form class="chatbar" id="cform"><input id="cin" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Skrifaðu á íslensku…" ${chat.busy?"disabled":""}><button class="btn primary" ${chat.busy?"disabled":""}>Senda</button></form>
      <p class="note" style="margin:8px 0 0">Stuck? Write in English and you'll be shown how to say it.</p></div>`;
  $("#chback").onclick = () => { chat = null; Chat(); };
  const cin = $("#cin");
  m.querySelectorAll("[data-key]").forEach(b => b.onclick = () => { const s=cin.selectionStart??cin.value.length; cin.value = cin.value.slice(0,s)+b.dataset.key+cin.value.slice(cin.selectionEnd??s); cin.focus(); cin.setSelectionRange(s+1,s+1); });
  $("#cform").onsubmit = e => { e.preventDefault(); const v = cin.value.trim(); if (v && !chat.busy) chatTurn(v); };
  const log = $("#clog"); if (log.lastElementChild) log.lastElementChild.scrollIntoView({block:"nearest"});
}
async function chatTurn(userText){
  const c = chat, sc = SC[c.i];
  if (userText) c.msgs.push({role:"me", is:userText});
  c.busy = true; Chat();
  const sys = `You are role-playing a ${sc.npc.en} ("${sc.npc.role}") in Iceland, talking to a beginner (CEFR A1–A2) English-speaking learner of Icelandic.
Scene: ${sc.setting}
Useful words from the lesson: ${sc.words.map(w=>w.is).join(", ")}.
Rules: stay in role; reply ONLY in simple, natural, grammatically correct Icelandic, at most 2 short sentences; keep the conversation moving with a question when natural.
If the learner's latest message contains an Icelandic mistake, write ONE short English sentence in "fix" showing the corrected Icelandic. If they wrote in English, put in "fix" how to say it in Icelandic. Otherwise "fix" is "".
Return JSON only: {"reply": "<Icelandic>", "reply_en": "<English translation>", "fix": "<string>"}`;
  const convo = c.msgs.map(m => m.role==="npc" ? `${sc.npc.role}: ${m.is}` : `Learner: ${m.is}`).join("\n");
  const prompt = `${sys}\n\nConversation so far:\n${convo || "(none — open the conversation with a greeting suited to the scene)"}\n\nYour next turn as JSON:`;
  try {
    const out = await sampleFn.json(prompt, {cache:false});
    if (userText && out.fix) c.msgs[c.msgs.length-1].fix = out.fix;
    c.msgs.push({role:"npc", is: String(out.reply||"…"), en: String(out.reply_en||"")});
  } catch(e) {
    if (e && e.code === "not_granted") { sampleFn = null; }
    else toast(e && e.code === "rate_limited" ? "Too many messages — wait a moment." : "Claude didn't answer. Try again.");
    if (userText && !c.msgs.some(m=>m.role==="npc")) {/* keep user's line */}
  }
  c.busy = false;
  if (chat === c && route.s === "chat") Chat();
}

/* ---------- welcome / how this works ---------- */
function showWelcome(){
  sheet(`<h3 style="font-size:24px">Velkomin! 👋</h3>
    <p style="margin-top:4px">This app teaches the way you'd pick up Icelandic on a trip: <b>you hear it first and understand it gradually.</b></p>
    <div class="howlist">
      <div><span>👂</span><p><b>You won't understand everything at first. That's normal.</b> Early on you're just getting familiar with the sounds and patterns. Recognition comes before understanding.</p></div>
      <div><span>🃏</span><p><b>Each scene goes:</b> learn the words → watch the scene → one short tip → build sentences → play your part.</p></div>
      <div><span>❓</span><p><b>Stuck?</b> Tap the <b>?</b> next to any line to see the English. In the first scenes the English is already shown.</p></div>
      <div><span>🐢</span><p><b>Too fast?</b> Tap 🐇 at the top to switch to 🐢 slow or 🐌 slower speech.</p></div>
      <div><span>🔁</span><p><b>Little and often.</b> Ten minutes a day plus the Review tab beats an hour once a week.</p></div>
    </div>`);
  store.set("welcomed", 1);
}
window.addEventListener("load", () => setTimeout(() => { if (!store.get("welcomed", 0) && route.s === "journey") showWelcome(); }, 600));
(function(){ const st = document.createElement("style"); st.textContent = `
  .howlist{display:grid;gap:10px;margin-top:12px}.howlist div{display:flex;gap:12px;align-items:flex-start}
  .howlist span{font-size:24px;line-height:1.2;flex:0 0 30px;text-align:center}.howlist p{margin:0;font-size:15px}`; document.head.appendChild(st); })();
