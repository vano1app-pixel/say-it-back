/* Say It Back — speak-along English trainer.
   Runs entirely in the browser. Nothing is uploaded: the microphone audio is
   handled by the browser's own speech engine and progress lives in localStorage. */
(function () {
  "use strict";

  var LEVELS = window.LEVELS || [];
  var STORE = "sayitback.v3";

  var RANKS = [
    { at: 0,    name: "Beginner" },
    { at: 120,  name: "Getting going" },
    { at: 350,  name: "Speaker" },
    { at: 800,  name: "Confident" },
    { at: 1600, name: "Fluent" },
    { at: 3000, name: "Natural" }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var railEl = $("rail"), levelNameEl = $("levelname"), progEl = $("prog"),
      eyebrowEl = $("eyebrow"), lineEl = $("line"), heardEl = $("heard"),
      meterEl = $("meter"), meterFill = $("meterfill"), meterCap = $("metercap"),
      goBtn = $("go"), goTxt = $("gotxt"), replayBtn = $("replay"), skipBtn = $("skip"),
      togetherBtn = $("together"), micBtn = $("micbtn"), rateEl = $("rate"),
      rateV = $("ratev"), voiceSel = $("voice"), xpEl = $("xp"), dayEl = $("day"),
      streakEl = $("streak"), bestEl = $("best"), rankEl = $("rank"),
      summaryEl = $("summary"), sumLines = $("sumlines"), sumAcc = $("sumacc"),
      sumXp = $("sumxp"), noticeEl = $("notice"), noticeTxt = $("noticetxt"),
      micAskBtn = $("micask"), resetBtn = $("reset"), ta = $("ta"), loadBtn = $("load");

  var synth = window.speechSynthesis;
  var canSpeak = !!synth && typeof SpeechSynthesisUtterance === "function";
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micPossible = !!SR;

  var S = {
    lv: 0, set: 0, i: 0,
    lines: null,                 // set when practising your own text
    xp: 0, streak: 0, best: 0,
    dayStreak: 0, lastDay: null,
    cleared: {}, unlocked: 1,
    rate: 0.8, voiceURI: null,
    together: true,
    mic: micPossible,
    phase: "idle",               // idle | listening | speaking | scored | finished
    session: { lines: 0, acc: 0, xp: 0, perfect: 0 }
  };

  /* ── storage ─────────────────────────────────────── */
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        xp: S.xp, best: S.best, dayStreak: S.dayStreak, lastDay: S.lastDay,
        cleared: S.cleared, unlocked: S.unlocked, rate: S.rate,
        voiceURI: S.voiceURI, together: S.together, mic: S.mic, lv: S.lv, set: S.set
      }));
    } catch (e) {}
  }
  function restore() {
    var r = null;
    try { r = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) {}
    if (!r) return;
    if (typeof r.xp === "number") S.xp = r.xp;
    if (typeof r.best === "number") S.best = r.best;
    if (typeof r.dayStreak === "number") S.dayStreak = r.dayStreak;
    if (typeof r.lastDay === "string") S.lastDay = r.lastDay;
    if (r.cleared && typeof r.cleared === "object") S.cleared = r.cleared;
    if (typeof r.unlocked === "number") S.unlocked = Math.max(1, Math.min(LEVELS.length, r.unlocked));
    if (typeof r.rate === "number") S.rate = r.rate;
    if (typeof r.voiceURI === "string") S.voiceURI = r.voiceURI;
    if (typeof r.together === "boolean") S.together = r.together;
    if (typeof r.mic === "boolean") S.mic = r.mic && micPossible;
    if (typeof r.lv === "number" && r.lv < S.unlocked) S.lv = r.lv;
    if (typeof r.set === "number") S.set = r.set;
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function yesterday() {
    var d = new Date(Date.now() - 864e5);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function touchDay() {
    var t = today();
    if (S.lastDay === t) return;
    S.dayStreak = (S.lastDay === yesterday()) ? S.dayStreak + 1 : 1;
    S.lastDay = t;
  }

  /* ── material ────────────────────────────────────── */
  function lines() { return S.lines ? S.lines : LEVELS[S.lv].sets[S.set].lines; }
  function currentLine() { return lines()[S.i] || ""; }
  function setTitle() { return S.lines ? "Your own text" : LEVELS[S.lv].sets[S.set].title; }

  function levelCleared(i) {
    for (var s = 0; s < LEVELS[i].sets.length; s++) if (!S.cleared[i + "-" + s]) return false;
    return true;
  }
  function levelDone(i) {
    var n = 0;
    for (var s = 0; s < LEVELS[i].sets.length; s++) if (S.cleared[i + "-" + s]) n++;
    return n / LEVELS[i].sets.length;
  }
  function firstUncleared(i) {
    for (var s = 0; s < LEVELS[i].sets.length; s++) if (!S.cleared[i + "-" + s]) return s;
    return 0;
  }

  /* ── rail ────────────────────────────────────────── */
  function buildRail() {
    railEl.textContent = "";
    LEVELS.forEach(function (L, i) {
      var b = document.createElement("button");
      b.className = "lv"; b.type = "button";
      var locked = i >= S.unlocked;
      if (locked) b.classList.add("locked");
      if (i === S.lv && !S.lines) b.classList.add("on");
      if (levelCleared(i)) b.classList.add("cleared");
      b.disabled = locked;
      b.setAttribute("aria-label", "Level " + (i + 1) + ": " + L.name + (locked ? " (locked)" : ""));
      var seg = document.createElement("span"); seg.className = "seg";
      var fill = document.createElement("i");
      fill.style.right = (100 - Math.round(levelDone(i) * 100)) + "%";
      seg.appendChild(fill);
      var n = document.createElement("span"); n.className = "n";
      n.textContent = locked ? "Locked" : "Level " + (i + 1);
      b.appendChild(seg); b.appendChild(n);
      b.addEventListener("click", function () { if (!locked) goToLevel(i); });
      railEl.appendChild(b);
    });
  }

  function goToLevel(i) {
    stopAll();
    S.lines = null; S.lv = i; S.set = firstUncleared(i); S.i = 0; S.phase = "idle";
    resetSession(); save(); renderAll();
  }
  function resetSession() { S.session = { lines: 0, acc: 0, xp: 0, perfect: 0 }; }

  /* ── render ──────────────────────────────────────── */
  function renderAll() {
    buildRail();
    if (S.lines) {
      levelNameEl.innerHTML = "<b>Your own text</b> — " + S.lines.length + " lines.";
    } else {
      var L = LEVELS[S.lv];
      levelNameEl.innerHTML = "<b>" + L.name + "</b> — " + L.hint +
        " &nbsp;·&nbsp; " + L.sets[S.set].title + " (" + (S.set + 1) + " of " + L.sets.length + ")";
    }
    summaryEl.hidden = true;
    renderProgress(); renderLine(); renderStats();
    setPhase("idle");
  }

  var perfectMap = {};
  function renderProgress() {
    progEl.textContent = "";
    var n = lines().length;
    for (var k = 0; k < n; k++) {
      var i = document.createElement("i");
      if (k < S.i) i.className = perfectMap[k] ? "fill perfect" : "fill";
      progEl.appendChild(i);
    }
  }

  var wordSpans = [], wordOffsets = [];
  function renderLine() {
    lineEl.textContent = "";
    lineEl.classList.remove("whole");
    wordSpans = []; wordOffsets = [];
    var txt = currentLine(), re = /\S+/g, m, last = 0;
    while ((m = re.exec(txt)) !== null) {
      if (m.index > last) lineEl.appendChild(document.createTextNode(txt.slice(last, m.index)));
      var sp = document.createElement("span");
      sp.className = "w"; sp.textContent = m[0];
      lineEl.appendChild(sp);
      wordSpans.push(sp);
      wordOffsets.push({ a: m.index, b: m.index + m[0].length });
      last = m.index + m[0].length;
    }
    if (last < txt.length) lineEl.appendChild(document.createTextNode(txt.slice(last)));
    heardEl.textContent = "";
  }

  function clearMarks() {
    lineEl.classList.remove("whole");
    wordSpans.forEach(function (w) { w.className = "w"; });
  }

  function rankFor(xp) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].at) r = RANKS[i];
    return r;
  }
  function renderStats() {
    xpEl.textContent = String(S.xp);
    dayEl.textContent = String(S.dayStreak);
    streakEl.textContent = String(S.streak);
    bestEl.textContent = String(S.best);
    var r = rankFor(S.xp), next = null;
    for (var i = 0; i < RANKS.length; i++) if (RANKS[i].at > S.xp) { next = RANKS[i]; break; }
    rankEl.innerHTML = next
      ? "<b>" + r.name + "</b> · " + (next.at - S.xp) + " XP to " + next.name
      : "<b>" + r.name + "</b> · top rank";
  }

  /* ── phases ──────────────────────────────────────── */
  function setPhase(p) {
    S.phase = p;
    eyebrowEl.className = "eyebrow";
    meterEl.classList.toggle("on", p === "speaking");
    if (p === "idle") {
      eyebrowEl.textContent = S.i === 0
        ? setTitle() + " — press Start"
        : "Line " + (S.i + 1) + " of " + lines().length;
      goTxt.textContent = S.i === 0 ? "Start" : "Next";
      goBtn.className = "primary"; goBtn.disabled = !canSpeak;
      replayBtn.disabled = false; skipBtn.disabled = false;
    } else if (p === "listening") {
      eyebrowEl.textContent = "Listen"; eyebrowEl.classList.add("live");
      goTxt.textContent = "Reading…"; goBtn.className = "primary"; goBtn.disabled = true;
      replayBtn.disabled = true; skipBtn.disabled = false;
    } else if (p === "speaking") {
      eyebrowEl.textContent = S.together
        ? (S.mic ? "Read out loud with the voice — take your time" : "Read out loud with the voice")
        : (S.mic ? "Your turn — take your time" : "Your turn — say it out loud");
      eyebrowEl.classList.add("live");
      goTxt.textContent = "Done";
      goBtn.className = "primary"; goBtn.disabled = false;   // never cut the learner off
      replayBtn.disabled = false; skipBtn.disabled = false;
    } else if (p === "scored") {
      goTxt.textContent = S.i >= lines().length - 1 ? "Finish" : "Next line";
      goBtn.className = "primary green"; goBtn.disabled = false;
      replayBtn.disabled = false; skipBtn.disabled = true;
    } else if (p === "finished") {
      goTxt.textContent = S.lines ? "Start again" : "Next passage";
      goBtn.className = "primary"; goBtn.disabled = false;
      replayBtn.disabled = true; skipBtn.disabled = true;
    }
  }

  /* ── voices ──────────────────────────────────────── */
  var voices = [];
  function pickVoice() {
    if (!voices.length) return null;
    for (var i = 0; i < voices.length; i++) if (voices[i].voiceURI === S.voiceURI) return voices[i];
    return voices[0];
  }
  function fillVoices() {
    if (!canSpeak) return;
    var all = synth.getVoices() || [];
    voices = all.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    if (!voices.length) voices = all;
    if (!voices.length) return;
    if (!S.voiceURI) {
      var pref = ["Samantha", "Google US English", "Ava", "Serena", "Daniel", "Karen"], best = null;
      for (var p = 0; p < pref.length && !best; p++)
        for (var i = 0; i < voices.length; i++)
          if (voices[i].name.indexOf(pref[p]) === 0) { best = voices[i]; break; }
      S.voiceURI = (best || voices[0]).voiceURI;
    }
    voiceSel.textContent = "";
    voices.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.voiceURI;
      o.textContent = v.name.replace(/\s*\(.*?\)\s*/g, " ").trim() + " · " + v.lang;
      voiceSel.appendChild(o);
    });
    var pv = pickVoice(); if (pv) voiceSel.value = pv.voiceURI;
  }

  /* ── text to speech ──────────────────────────────── */
  var utter = null, sawBoundary = false;

  function readLine(then) {
    if (!canSpeak) { then && then(); return; }
    var txt = currentLine();
    var u = new SpeechSynthesisUtterance(txt);
    u.rate = S.rate;
    var v = pickVoice();
    u.lang = v ? v.lang : "en-US";
    if (v) u.voice = v;
    sawBoundary = false;

    u.onboundary = function (ev) {
      if (utter !== u) return;
      if (ev.name && ev.name !== "word") return;
      sawBoundary = true;
      var ci = ev.charIndex;
      for (var i = 0; i < wordOffsets.length; i++) {
        // never overwrite a word the microphone already credited
        if (wordSpans[i].classList.contains("said")) continue;
        wordSpans[i].classList.toggle("lit", ci >= wordOffsets[i].a && ci < wordOffsets[i].b);
      }
    };
    u.onstart = function () {
      setTimeout(function () {
        if (utter === u && !sawBoundary) lineEl.classList.add("whole");
      }, 300);
    };
    u.onend = function () {
      if (utter !== u) return;
      utter = null;
      lineEl.classList.remove("whole");
      wordSpans.forEach(function (w) { w.classList.remove("lit"); });
      then && then();
    };
    u.onerror = function () {
      if (utter !== u) return;
      utter = null; then && then();
    };
    utter = u;
    try { synth.speak(u); } catch (e) { then && then(); }
  }

  /* ── microphone level meter ──────────────────────── */
  var audioCtx = null, analyser = null, micStream = null, meterRAF = null;

  function startMeter() {
    if (!analyser) return;
    var buf = new Uint8Array(analyser.fftSize);
    var tick = function () {
      analyser.getByteTimeDomainData(buf);
      var sum = 0;
      for (var i = 0; i < buf.length; i++) { var d = (buf[i] - 128) / 128; sum += d * d; }
      var rms = Math.sqrt(sum / buf.length);
      var pct = Math.min(100, Math.round(rms * 320));
      meterFill.style.width = pct + "%";
      meterRAF = requestAnimationFrame(tick);
    };
    meterEl.classList.remove("idlepulse");
    tick();
  }
  function stopMeter() {
    if (meterRAF) { cancelAnimationFrame(meterRAF); meterRAF = null; }
    meterFill.style.width = "0%";
  }

  function askMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.reject(new Error("unsupported"));
    }
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micStream = stream;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        var src = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        src.connect(analyser);
      } catch (e) { analyser = null; }
      return true;
    });
  }

  function showNotice(msg, withButton) {
    noticeTxt.textContent = msg;
    micAskBtn.hidden = !withButton;
    noticeEl.hidden = false;
  }
  function hideNotice() { noticeEl.hidden = true; }

  /* ── speech recognition + live matching ──────────── */
  var rec = null, recFinal = "", recActive = false, liveIdx = 0;

  function norm(s) {
    return String(s).toLowerCase().replace(/[’']/g, "'")
      .replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function targetWords() {
    return wordSpans.map(function (sp) { return norm(sp.textContent).replace(/ /g, ""); });
  }
  // one edit apart is close enough — recognition wobbles on endings
  function near(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length < 4 || b.length < 4) return false;
    var i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }

  // Light up words in green as the microphone hears them, in order,
  // allowing a small look-ahead so one missed word doesn't derail the rest.
  function liveMatch(transcript) {
    var said = norm(transcript).split(" ").filter(Boolean);
    var tgt = targetWords();
    var p = 0;
    for (var s = 0; s < said.length; s++) {
      for (var k = p; k < Math.min(p + 3, tgt.length); k++) {
        if (near(said[s], tgt[k])) { p = k + 1; break; }
      }
    }
    if (p > liveIdx) {
      for (var i = liveIdx; i < p; i++) {
        wordSpans[i].classList.remove("lit");
        wordSpans[i].classList.add("said");
      }
      liveIdx = p;
    }
    return p;
  }

  function stopRec() {
    recActive = false;
    if (rec) {
      try { rec.onend = null; rec.onresult = null; rec.onerror = null; rec.stop(); } catch (e) {}
      rec = null;
    }
    stopMeter();
  }

  // Returns true only if recognition actually started.
  function startRec(onDone) {
    if (!S.mic || !micPossible) return false;
    try { rec = new SR(); }
    catch (e) { micFailed("This browser blocked the microphone."); return false; }

    var v = pickVoice();
    rec.lang = v ? v.lang : "en-US";
    rec.interimResults = true;
    rec.continuous = true;            // keep listening through your pauses
    rec.maxAlternatives = 1;
    recFinal = ""; recActive = true; liveIdx = 0;

    rec.onresult = function (e) {
      var interim = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var t = e.results[i][0].transcript;
        if (e.results[i].isFinal) recFinal += t + " "; else interim += t;
      }
      var all = (recFinal + " " + interim).trim();
      liveMatch(all);
      heardEl.innerHTML = "Heard: <b></b>";
      heardEl.querySelector("b").textContent = all;
    };
    rec.onerror = function (ev) {
      var err = ev && ev.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        recActive = false;
        micFailed("The microphone is blocked. Allow it in the address bar, then reload.");
        setPhase("speaking");
      } else if (err === "no-speech" || err === "aborted") {
        /* keep waiting — the learner decides when they are done */
      } else {
        recActive = false;
        onDone((recFinal || "").trim());
      }
    };
    rec.onend = function () {
      if (!recActive) return;
      recActive = false;
      onDone((recFinal || "").trim());
    };
    try { rec.start(); }
    catch (e) { micFailed("Could not start the microphone."); return false; }
    startMeter();
    return true;
  }

  function micFailed(msg) {
    S.mic = false;
    micBtn.classList.remove("on");
    stopMeter();
    showNotice(msg + " You can still practise — mark each line yourself.", true);
    save();
  }

  /* ── scoring ─────────────────────────────────────── */
  function score(said) {
    var a = norm(said).split(" ").filter(Boolean);
    var b = targetWords();
    if (!b.length) return { pct: 0, matched: [] };
    var m = a.length, n = b.length, i, j;
    var dp = [];
    for (i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++)
        dp[i][j] = near(a[i - 1], b[j - 1])
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    var matched = new Array(n).fill(false);
    i = m; j = n;
    while (i > 0 && j > 0) {
      if (near(a[i - 1], b[j - 1])) { matched[j - 1] = true; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    return { pct: dp[m][n] / n, matched: matched };
  }

  var awarded = false;
  function showScore(said) {
    var r = score(said || "");
    var pct = Math.round(r.pct * 100);
    clearMarks();
    r.matched.forEach(function (ok, k) {
      if (wordSpans[k]) wordSpans[k].classList.add(ok ? "hit" : "miss");
    });
    var pass = r.pct >= 0.7, perfect = r.pct >= 0.95;
    perfectMap[S.i] = perfect;
    eyebrowEl.className = "eyebrow " + (pass ? "ok" : "live");
    eyebrowEl.textContent = perfect ? "Perfect — " + pct + "%"
      : pass ? "Good — " + pct + "%"
      : "Close — " + pct + "%. The underlined words didn't come through.";
    heardEl.innerHTML = "Heard: <b></b>";
    heardEl.querySelector("b").textContent = said || "nothing";
    award(pass, r.pct, perfect);
    setPhase("scored");
  }

  function showSelfMark() {
    clearMarks();
    perfectMap[S.i] = false;
    eyebrowEl.className = "eyebrow ok";
    eyebrowEl.textContent = "Counted — press Next line.";
    award(true, 0.9, false);
    setPhase("scored");
  }

  function award(pass, ratio, perfect) {
    if (awarded) return;
    awarded = true;
    touchDay();
    var gain;
    if (pass) {
      S.streak++;
      if (S.streak > S.best) S.best = S.streak;
      gain = 10 + (perfect ? 5 : 0) + Math.min(10, Math.floor(S.streak / 3) * 2);
    } else {
      S.streak = 0;
      gain = 3;                     // showing up still counts
    }
    S.xp += gain;
    S.session.lines++;
    S.session.acc += ratio;
    S.session.xp += gain;
    if (perfect) S.session.perfect++;
    renderStats(); save();
  }

  /* ── the loop ────────────────────────────────────── */
  var settled = false, finishLine = null;

  function stopAll() {
    utter = null;
    try { synth && synth.cancel(); } catch (e) {}
    stopRec();
    meterEl.classList.remove("on", "idlepulse");
  }

  function runLine() {
    if (S.phase === "listening" || S.phase === "speaking") return;   // no re-entry
    awarded = false; settled = false;
    clearMarks();
    hideNotice();

    finishLine = function (said) {
      if (settled) return;
      settled = true;
      stopRec();
      meterEl.classList.remove("on", "idlepulse");
      if (said === null) showSelfMark(); else showScore(said);
    };

    var openMic = function () {
      var started = startRec(finishLine);
      setPhase("speaking");
      if (!started) meterEl.classList.add("idlepulse");
      meterCap.textContent = started ? "Listening" : "Your turn";
    };

    if (S.together) {
      // Voice and learner read at the same time. The mic opens first so it
      // catches your first word, and only the Done button closes it.
      openMic();
      readLine(function () { /* voice finished — you may still be talking */ });
    } else {
      setPhase("listening");
      readLine(function () { if (S.phase === "listening") openMic(); });
    }
  }

  // You decide when you're finished. Nothing here ever interrupts you.
  function done() {
    try { synth && synth.cancel(); } catch (e) {}
    utter = null;
    if (S.mic && recActive && rec) {
      try { rec.stop(); return; } catch (e) {}   // onend delivers the transcript
    }
    if (finishLine) finishLine(S.mic ? (recFinal || "").trim() : null);
  }

  function nextLine() {
    if (S.i >= lines().length - 1) return finishPassage();
    S.i++;
    renderProgress(); renderLine(); setPhase("idle");
    runLine();
  }

  function finishPassage() {
    stopAll();
    S.phase = "finished";
    if (!S.lines) {
      S.cleared[S.lv + "-" + S.set] = true;
      if (levelCleared(S.lv) && S.unlocked < S.lv + 2) {
        S.unlocked = Math.min(LEVELS.length, S.lv + 2);
      }
      save();
    }
    buildRail(); renderProgress(); clearMarks();

    var justUnlocked = !S.lines && levelCleared(S.lv) && S.lv + 1 < LEVELS.length;
    eyebrowEl.className = "eyebrow ok";
    eyebrowEl.textContent = "Passage complete";
    lineEl.textContent = justUnlocked
      ? "Level " + (S.lv + 2) + " is open: " + LEVELS[S.lv + 1].name + "."
      : "Nicely done. Keep the streak going tomorrow.";
    heardEl.textContent = "";

    var n = Math.max(1, S.session.lines);
    sumLines.textContent = String(S.session.lines);
    sumAcc.textContent = Math.round((S.session.acc / n) * 100) + "%";
    sumXp.textContent = "+" + S.session.xp;
    summaryEl.hidden = false;
    setPhase("finished");
  }

  function advancePassage() {
    resetSession(); perfectMap = {};
    if (S.lines) { S.i = 0; renderAll(); return; }
    var L = LEVELS[S.lv], next = -1;
    for (var s = 0; s < L.sets.length; s++) if (!S.cleared[S.lv + "-" + s]) { next = s; break; }
    if (next === -1) {
      if (S.lv + 1 < LEVELS.length && S.unlocked > S.lv + 1) { goToLevel(S.lv + 1); return; }
      next = (S.set + 1) % L.sets.length;      // everything cleared — cycle for revision
    }
    S.set = next; S.i = 0; save(); renderAll();
  }

  /* ── wiring ──────────────────────────────────────── */
  goBtn.addEventListener("click", function () {
    if (S.phase === "idle") runLine();
    else if (S.phase === "speaking") done();
    else if (S.phase === "scored") nextLine();
    else if (S.phase === "finished") advancePassage();
  });

  replayBtn.addEventListener("click", function () {
    var back = S.phase;
    try { synth && synth.cancel(); } catch (e) {}
    utter = null;
    readLine(function () { if (S.phase !== back) setPhase(back); });
  });

  skipBtn.addEventListener("click", function () {
    stopAll();
    S.streak = 0; renderStats(); save();
    if (S.i >= lines().length - 1) finishPassage();
    else { S.i++; renderProgress(); renderLine(); setPhase("idle"); }
  });

  togetherBtn.addEventListener("click", function () {
    S.together = !S.together;
    togetherBtn.classList.toggle("on", S.together);
    togetherBtn.setAttribute("aria-pressed", String(S.together));
    togetherBtn.textContent = S.together ? "Together" : "After";
    togetherBtn.title = S.together
      ? "Reading at the same time as the voice"
      : "The voice reads first, then you repeat it";
    save();
    if (S.phase === "listening" || S.phase === "speaking") { stopAll(); setPhase("idle"); }
  });

  micBtn.addEventListener("click", function () {
    if (!micPossible) return;
    S.mic = !S.mic;
    micBtn.classList.toggle("on", S.mic);
    micBtn.setAttribute("aria-pressed", String(S.mic));
    save();
    if (S.mic) {
      askMic().then(hideNotice).catch(function () {
        micFailed("The microphone is blocked. Allow it in the address bar, then reload.");
      });
    } else {
      hideNotice();
    }
    if (S.phase === "listening" || S.phase === "speaking") { stopAll(); setPhase("idle"); }
  });

  micAskBtn.addEventListener("click", function () {
    askMic().then(function () {
      S.mic = true;
      micBtn.classList.add("on");
      hideNotice(); save();
    }).catch(function () {
      showNotice("Still blocked. Click the padlock in the address bar, allow the microphone, then reload.", false);
    });
  });

  rateEl.addEventListener("input", function () {
    S.rate = parseFloat(rateEl.value);
    rateV.textContent = S.rate.toFixed(2) + "×";
  });
  rateEl.addEventListener("change", save);
  voiceSel.addEventListener("change", function () { S.voiceURI = voiceSel.value; save(); });

  loadBtn.addEventListener("click", function () {
    var t = ta.value.trim();
    if (!t) return;
    stopAll();
    var out = [];
    t.split(/\n+/).forEach(function (para) {
      var body = para.replace(/\s+/g, " ").trim();
      if (!body) return;
      var re = /[^.!?…]+(?:[.!?…]+["'”’)]*|$)/g, m;
      while ((m = re.exec(body)) !== null) { var s = m[0].trim(); if (s) out.push(s); }
    });
    if (!out.length) return;
    S.lines = out; S.i = 0; S.phase = "idle";
    resetSession(); perfectMap = {};
    renderAll();
    document.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetBtn.addEventListener("click", function () {
    stopAll();
    S.xp = 0; S.streak = 0; S.best = 0; S.dayStreak = 0; S.lastDay = null;
    S.cleared = {}; S.unlocked = 1; S.lv = 0; S.set = 0; S.i = 0; S.lines = null;
    S.phase = "idle"; resetSession(); perfectMap = {};
    save(); renderAll();
  });

  document.addEventListener("keydown", function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === " ") { e.preventDefault(); if (!goBtn.disabled) goBtn.click(); }
    else if (e.key === "r" || e.key === "R") { if (!replayBtn.disabled) replayBtn.click(); }
    else if (e.key === "s" || e.key === "S") { if (!skipBtn.disabled) skipBtn.click(); }
  });

  window.addEventListener("beforeunload", function () {
    try { synth && synth.cancel(); } catch (e) {}
    if (micStream) micStream.getTracks().forEach(function (t) { t.stop(); });
  });

  /* ── start ───────────────────────────────────────── */
  restore();
  rateEl.value = String(S.rate);
  rateV.textContent = S.rate.toFixed(2) + "×";
  micBtn.classList.toggle("on", S.mic);
  micBtn.setAttribute("aria-pressed", String(S.mic));
  togetherBtn.classList.toggle("on", S.together);
  togetherBtn.setAttribute("aria-pressed", String(S.together));
  togetherBtn.textContent = S.together ? "Together" : "After";

  if (!micPossible) {
    micBtn.disabled = true;
    micBtn.classList.remove("on");
    micBtn.title = "This browser has no speech recognition";
    showNotice("This browser can't score your speaking — Chrome can. You can still practise and mark each line yourself.", false);
  } else if (S.mic) {
    showNotice("Turn the microphone on so the words light up green as you say them.", true);
  }

  renderAll();

  if (canSpeak) {
    fillVoices();
    if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = fillVoices;
    setTimeout(fillVoices, 400);          // Chrome often returns an empty list first
  } else {
    goBtn.disabled = true;
    eyebrowEl.textContent = "This browser has no built-in voice — try Chrome or Safari.";
  }
})();
