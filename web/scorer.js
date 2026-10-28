// Pronunciation similarity scorer: MFCC features + dynamic time warping.
// Compares a learner recording with reference recordings of the same phrase.
(function (root) {
  let SR = 16000, FRAME = 400, HOP = 160, NFFT = 512, NMEL = 26, NCEP = 13, FLO = 80, FHI = 7600, COS = true, BAND = 0.4, DELTA = true;

  function resample(x, sr) {
    if (sr === SR) return x;
    const ratio = sr / SR, n = Math.floor(x.length / ratio), y = new Float32Array(n);
    // simple low-pass by averaging over the ratio window, then linear pick
    for (let i = 0; i < n; i++) {
      const c = i * ratio, a = Math.floor(c), b = Math.min(x.length - 1, Math.ceil(c + ratio));
      let s = 0, k = 0;
      for (let j = a; j <= b; j++) { s += x[j]; k++; }
      y[i] = s / k;
    }
    return y;
  }

  // FFT (radix-2, in place)
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let j = 0; j < len / 2; j++) {
          const ur = re[i + j], ui = im[i + j];
          const vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci;
          const vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
          re[i + j] = ur + vr; im[i + j] = ui + vi;
          re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }

  let melBank = null, hamming = null;
  function setup() {
    if (melBank) return;
    hamming = new Float32Array(FRAME);
    for (let i = 0; i < FRAME; i++) hamming[i] = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (FRAME - 1));
    const mel = f => 2595 * Math.log10(1 + f / 700), imel = m => 700 * (Math.pow(10, m / 2595) - 1);
    const lo = mel(FLO), hi = mel(FHI), pts = [];
    for (let i = 0; i < NMEL + 2; i++) pts.push(Math.floor((NFFT + 1) * imel(lo + (hi - lo) * i / (NMEL + 1)) / SR));
    melBank = [];
    for (let m = 1; m <= NMEL; m++) {
      const f = new Float32Array(NFFT / 2 + 1);
      for (let k = pts[m - 1]; k < pts[m]; k++) f[k] = (k - pts[m - 1]) / Math.max(1, pts[m] - pts[m - 1]);
      for (let k = pts[m]; k < pts[m + 1]; k++) f[k] = (pts[m + 1] - k) / Math.max(1, pts[m + 1] - pts[m]);
      melBank.push(f);
    }
  }

  // Trim leading/trailing silence using frame energy relative to the loudest frame.
  function trim(x) {
    const n = Math.floor(x.length / HOP), e = new Float32Array(n);
    let mx = 1e-9;
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = i * HOP; j < Math.min(x.length, i * HOP + FRAME); j++) s += x[j] * x[j];
      e[i] = s; if (s > mx) mx = s;
    }
    const thr = mx * Math.pow(10, -3.5); // -35 dB
    let a = 0, b = n - 1;
    while (a < n && e[a] < thr) a++;
    while (b > a && e[b] < thr) b--;
    a = Math.max(0, a - 3); b = Math.min(n - 1, b + 3);
    return x.subarray(a * HOP, Math.min(x.length, b * HOP + FRAME));
  }

  function mfcc(samples, sr) {
    setup();
    let x = resample(samples, sr);
    x = trim(x);
    // normalise peak
    let pk = 1e-9; for (const v of x) pk = Math.max(pk, Math.abs(v));
    const n = Math.max(1, Math.floor((x.length - FRAME) / HOP) + 1), out = [];
    const re = new Float32Array(NFFT), im = new Float32Array(NFFT);
    for (let f = 0; f < n; f++) {
      re.fill(0); im.fill(0);
      for (let i = 0; i < FRAME; i++) {
        const idx = f * HOP + i;
        const cur = idx < x.length ? x[idx] / pk : 0, prev = idx > 0 && idx - 1 < x.length ? x[idx - 1] / pk : 0;
        re[i] = (cur - 0.97 * prev) * hamming[i];
      }
      fft(re, im);
      const pow = new Float32Array(NFFT / 2 + 1);
      for (let k = 0; k <= NFFT / 2; k++) pow[k] = re[k] * re[k] + im[k] * im[k];
      const logm = new Float32Array(NMEL);
      for (let m = 0; m < NMEL; m++) { let s = 0; const fb = melBank[m]; for (let k = 0; k < fb.length; k++) s += fb[k] * pow[k]; logm[m] = Math.log(s + 1e-8); }
      const c = new Float32Array(NCEP - 1);
      for (let q = 1; q < NCEP; q++) { let s = 0; for (let m = 0; m < NMEL; m++) s += logm[m] * Math.cos(Math.PI * q * (m + 0.5) / NMEL); c[q - 1] = s; }
      out.push(c);
    }
    // cepstral mean & variance normalisation (removes much of the speaker/mic colouring)
    const D = NCEP - 1, mu = new Float32Array(D), sd = new Float32Array(D);
    for (const v of out) for (let d = 0; d < D; d++) mu[d] += v[d] / out.length;
    for (const v of out) for (let d = 0; d < D; d++) sd[d] += (v[d] - mu[d]) ** 2 / out.length;
    for (const v of out) for (let d = 0; d < D; d++) v[d] = (v[d] - mu[d]) / Math.sqrt(sd[d] + 1e-6);
    if (DELTA) {
      const T = out.length, ext = [];
      for (let t = 0; t < T; t++) {
        const a = out[Math.max(0, t - 2)], b = out[Math.max(0, t - 1)], c = out[Math.min(T - 1, t + 1)], e = out[Math.min(T - 1, t + 2)];
        const v = new Float32Array(D * 2);
        for (let d = 0; d < D; d++) { v[d] = out[t][d]; v[D + d] = ((c[d] - b[d]) + 2 * (e[d] - a[d])) / 10 * 2; }
        ext.push(v);
      }
      return { feats: ext, seconds: x.length / SR };
    }
    return { feats: out, seconds: x.length / SR };
  }

  function dist(a, b) { if (COS) { let d=0,na=0,nb=0; for (let i=0;i<a.length;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];} return 1-d/Math.sqrt(na*nb+1e-9);} let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; } return Math.sqrt(s); }

  // DTW; returns mean path cost and per-reference-frame cost
  function dtw(ref, usr) {
    const n = ref.length, m = usr.length, band = Math.max(Math.abs(n - m) + 10, Math.floor(Math.max(n, m) * BAND));
    const INF = 1e18, C = new Float64Array((n + 1) * (m + 1)).fill(INF), L = new Int32Array((n + 1) * (m + 1));
    const W = m + 1; C[0] = 0;
    for (let i = 1; i <= n; i++) {
      const jc = Math.round(i * m / n), j0 = Math.max(1, jc - band), j1 = Math.min(m, jc + band);
      for (let j = j0; j <= j1; j++) {
        const d = dist(ref[i - 1], usr[j - 1]);
        let best = C[(i - 1) * W + j - 1], bl = L[(i - 1) * W + j - 1];
        if (C[(i - 1) * W + j] < best) { best = C[(i - 1) * W + j]; bl = L[(i - 1) * W + j]; }
        if (C[i * W + j - 1] < best) { best = C[i * W + j - 1]; bl = L[i * W + j - 1]; }
        C[i * W + j] = best + d; L[i * W + j] = bl + 1;
      }
    }
    const total = C[n * W + m];
    if (!isFinite(total) || total >= INF) return { mean: 99, perRef: new Float32Array(n).fill(99) };
    // backtrack for per-ref-frame cost
    const perRef = new Float32Array(n), cnt = new Float32Array(n);
    let i = n, j = m;
    while (i > 0 && j > 0) {
      perRef[i - 1] += dist(ref[i - 1], usr[j - 1]); cnt[i - 1]++;
      const a = C[(i - 1) * W + j - 1], b = C[(i - 1) * W + j], c = C[i * W + j - 1];
      if (a <= b && a <= c) { i--; j--; } else if (b <= c) i--; else j--;
    }
    for (let k = 0; k < n; k++) perRef[k] = cnt[k] ? perRef[k] / cnt[k] : 99;
    return { mean: total / L[n * W + m], perRef };
  }

  // Map a DTW distance (cosine, MFCC+delta) to 0-100. Calibrated in node on
  // cross-voice comparisons of the app's own clips: same phrase by a different
  // voice lands around 0.4-0.65; a different phrase around 0.65-0.85.
  function toScore(d) {
    const s = 100 / (1 + Math.exp((d - 0.75) / 0.07));
    return Math.max(0, Math.min(100, Math.round(s)));
  }

  const WARPS = [0.86, 0.93, 1, 1.07, 1.14]; // crude vocal-tract-length normalisation

  function bestMatch(refs, users) {
    let best = null;
    for (const r of refs) for (const u of users) {
      const res = dtw(r.feats, u.feats);
      const d = res.mean + 0.1 * Math.abs(Math.log(u.seconds / r.seconds));
      if (!best || d < best.d) best = { ...res, d, ref: r, user: u };
    }
    return best;
  }

  // refs: [{name, feats, seconds}] for the target phrase (from mfcc).
  // cohort: [{text, refs}] — other phrases used as a sanity check: if the learner's
  // audio is closer to one of them than to the target, the score is capped.
  function score(refs, samples, sr, cohort) {
    const users = WARPS.map(w => mfcc(samples, sr * w));
    if (users[2].feats.length < 8) return { error: "Recording too short or too quiet." };
    const best = bestMatch(refs, users);
    const parts = 8, pr = best.perRef, segs = [];
    for (let p = 0; p < parts; p++) {
      const a = Math.floor(p * pr.length / parts), b = Math.max(a + 1, Math.floor((p + 1) * pr.length / parts));
      let s = 0; for (let k = a; k < b; k++) s += pr[k];
      segs.push(toScore(s / (b - a)));
    }
    let sc = toScore(best.d), closerTo = null;
    if (cohort && cohort.length) {
      const few = [users[1], users[2], users[3]];
      for (const c of cohort) {
        const m = bestMatch(c.refs, few);
        if (m.d < best.d && (!closerTo || m.d < closerTo.d)) closerTo = { text: c.text, d: m.d };
      }
      if (closerTo) sc = Math.min(sc, 40);
    }
    return { score: sc, dist: best.d, closest: best.ref.name, segments: segs, tempo: users[2].seconds / best.ref.seconds, closerTo: closerTo && closerTo.text };
  }

  function config(o){ if(o.NMEL)NMEL=o.NMEL; if(o.FLO)FLO=o.FLO; if(o.FHI)FHI=o.FHI; if(o.COS!==undefined)COS=o.COS; if(o.NCEP)NCEP=o.NCEP; if(o.BAND)BAND=o.BAND; if(o.DELTA!==undefined)DELTA=o.DELTA; melBank=null; }
  const api = { mfcc, dtw, score, toScore, config };
  if (typeof module !== "undefined") module.exports = api; else root.Scorer = api;
})(typeof window !== "undefined" ? window : globalThis);
