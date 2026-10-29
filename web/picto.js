/* Pictograms: turn a short spec into a picture tile, so a word's meaning is clear without English.
   Specs:  "☕"  plain emoji · "☕+🫘" emoji with a badge (emoji or short text) · "sign:→" road sign
           "exit" exit sign · "pharmacy" green cross · "far" / "near" distance · "num:12" big number
           "day:3" week strip with day 3 lit · "color:#d62828" colour swatch                         */
(function(){
  const css = `
  .pg{--s:56px;position:relative;display:inline-grid;place-items:center;width:var(--s);height:var(--s);font-size:calc(var(--s)*.72);line-height:1;flex:0 0 auto}
  .pg .m{display:block;line-height:1}
  .pg .b{position:absolute;right:-6%;bottom:-6%;min-width:44%;height:44%;padding:0 6%;border-radius:999px;background:#fff;box-shadow:0 1px 4px rgba(15,29,51,.25);
    display:grid;place-items:center;font-size:calc(var(--s)*.27);font-weight:800;color:#0f1d33;font-family:Inter,system-ui,sans-serif}
  .pg .b.e{font-size:calc(var(--s)*.26)}
  .pg .sign{width:86%;height:86%;border-radius:16%;background:#1d5fbf;color:#fff;display:grid;place-items:center;font-size:calc(var(--s)*.58);font-weight:900;box-shadow:inset 0 0 0 calc(var(--s)*.035) #fff,0 0 0 calc(var(--s)*.02) #1d5fbf}
  .pg .exit{width:92%;height:62%;border-radius:12%;background:#15803d;color:#fff;display:flex;align-items:center;justify-content:center;gap:2%;font-size:calc(var(--s)*.34);font-weight:900}
  .pg .cross{position:relative;width:70%;height:70%}
  .pg .cross:before,.pg .cross:after{content:"";position:absolute;background:#16a34a;border-radius:8%}
  .pg .cross:before{left:33%;top:0;width:34%;height:100%}.pg .cross:after{top:33%;left:0;height:34%;width:100%}
  .pg .num{width:88%;height:88%;border-radius:22%;background:#02529c;color:#fff;display:grid;place-items:center;font:800 calc(var(--s)*.36)/1 Inter,system-ui,sans-serif;letter-spacing:-.02em}
  .pg .week{display:grid;grid-template-columns:repeat(7,1fr);gap:7%;width:96%;height:70%;align-items:end}
  .pg .week i{height:50%;border-radius:999px;background:#c5d0de}
  .pg .week i.on{height:100%;background:#dc1e35}
  .pg .sw{width:74%;height:74%;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12),0 2px 6px rgba(0,0,0,.15)}
  .pg svg{width:96%;height:96%}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const E = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const isEmoji = s => /\p{Extended_Pictographic}/u.test(s);
  window.pictogram = function(spec, size=56){
    const st = `style="--s:${size}px"`;
    if (!spec) return `<span class="pg" ${st}><span class="m">🔤</span></span>`;
    if (spec.startsWith("sign:")) return `<span class="pg" ${st}><span class="sign">${E(spec.slice(5))}</span></span>`;
    if (spec === "exit") return `<span class="pg" ${st}><span class="exit">🏃<span>→</span></span></span>`;
    if (spec === "pharmacy") return `<span class="pg" ${st}><span class="cross"></span></span>`;
    if (spec.startsWith("num:")) return `<span class="pg" ${st}><span class="num" ${spec.length>7?`style="font-size:${size*.26}px"`:""}>${E(spec.slice(4))}</span></span>`;
    if (spec.startsWith("day:")) { const d = +spec.slice(4); return `<span class="pg" ${st}><span class="week">${[1,2,3,4,5,6,7].map(k=>`<i class="${k===d?"on":""}"></i>`).join("")}</span></span>`; }
    if (spec.startsWith("color:")) return `<span class="pg" ${st}><span class="sw" style="background:${E(spec.slice(6))}"></span></span>`;
    if (spec === "far" || spec === "near") {
      const x2 = spec === "far" ? 78 : 44;
      return `<span class="pg" ${st}><svg viewBox="0 0 100 100"><line x1="16" y1="70" x2="${x2}" y2="70" stroke="#7a8599" stroke-width="5" stroke-dasharray="${spec==="far"?"2 8":"2 5"}" stroke-linecap="round"/>
        <path d="M16 70c-9-12-14-19-14-26a14 14 0 0 1 28 0c0 7-5 14-14 26z" fill="#dc1e35"/><circle cx="16" cy="44" r="5" fill="#fff"/>
        <line x1="${x2}" y1="72" x2="${x2}" y2="30" stroke="#0f1d33" stroke-width="4"/><path d="M${x2} 30l18 7-18 7z" fill="#1d8a5a"/></svg></span>`;
    }
    const i = spec.indexOf("+");
    if (i > 0) {
      const main = spec.slice(0, i), badge = spec.slice(i + 1);
      return `<span class="pg" ${st}><span class="m">${E(main)}</span><span class="b ${isEmoji(badge)?"e":""}">${E(badge)}</span></span>`;
    }
    const multi = [...new Intl.Segmenter(undefined, {granularity:"grapheme"}).segment(spec)].length > 1;
    return `<span class="pg" ${st}><span class="m" ${multi?`style="font-size:${size*.46}px;letter-spacing:-.05em"`:""}>${E(spec)}</span></span>`;
  };
})();
