/* Say It Back — speak-along language trainer.
   Everything runs in the browser: the voice and the speech recognition are the
   browser's own, and progress lives in localStorage. Nothing is uploaded. */
(function () {
  "use strict";

  var C = window.COURSE || { languages: [], ui: {}, levels: [] };
  var LEVELS = C.levels, LANGS = C.languages;
  var STORE = "sayitback.v4";
  var DAILY_GOAL = 20;

  var RANKS = [
    { at: 0, en: "Beginner", es: "Principiante", fr: "Débutant" },
    { at: 120, en: "Getting going", es: "En marcha", fr: "En route" },
    { at: 350, en: "Speaker", es: "Hablante", fr: "Locuteur" },
    { at: 800, en: "Confident", es: "Con confianza", fr: "Confiant" },
    { at: 1600, en: "Fluent", es: "Fluido", fr: "Aisance" },
    { at: 3000, en: "Natural", es: "Natural", fr: "Naturel" }
  ];

  var BADGES = [
    { id: "first",   en: ["First words", "Say your first line"], es: ["Primeras palabras", "Di tu primera frase"], fr: ["Premiers mots", "Dites votre première phrase"] },
    { id: "perfect", en: ["Word perfect", "Score 100% on a line"], es: ["Palabra por palabra", "Consigue el 100% en una frase"], fr: ["Sans faute", "Obtenez 100% sur une phrase"] },
    { id: "combo5",  en: ["On a roll", "Five correct in a row"], es: ["En racha", "Cinco seguidas"], fr: ["En série", "Cinq d'affilée"] },
    { id: "combo10", en: ["Unstoppable", "Ten correct in a row"], es: ["Imparable", "Diez seguidas"], fr: ["Imparable", "Dix d'affilée"] },
    { id: "passage", en: ["First passage", "Finish a whole passage"], es: ["Primer texto", "Termina un texto entero"], fr: ["Premier texte", "Terminez un texte entier"] },
    { id: "level2",  en: ["Level up", "Unlock level 2"], es: ["Subes de nivel", "Desbloquea el nivel 2"], fr: ["Niveau supérieur", "Débloquez le niveau 2"] },
    { id: "goal",    en: ["Daily goal", "Hit your goal for a day"], es: ["Meta diaria", "Cumple tu meta de un día"], fr: ["Objectif du jour", "Atteignez votre objectif"] },
    { id: "day3",    en: ["Three days", "Practise three days running"], es: ["Tres días", "Practica tres días seguidos"], fr: ["Trois jours", "Trois jours de suite"] },
    { id: "day7",    en: ["A full week", "Practise seven days running"], es: ["Una semana", "Practica siete días seguidos"], fr: ["Une semaine", "Sept jours de suite"] },
    { id: "hundred", en: ["One hundred", "Speak a hundred lines"], es: ["Cien frases", "Di cien frases"], fr: ["Cent phrases", "Dites cent phrases"] }
  ];

  var $ = function (id) { return document.getElementById(id); };

  var S = {
    speak: null, learn: null,          // language codes
    mode: "together",                  // together | after | correct
    lv: 0, set: 0, i: 0,
    lines: null,                       // your own text
    xp: 0, streak: 0, best: 0, total: 0,
    dayStreak: 0, lastDay: null, todayCount: 0, todayDate: null,
    cleared: {}, unlocked: 1, badges: {},
    rate: 0.8, voiceURI: null,
    mic: true, sound: true,
    phase: "idle",
    session: { lines: 0, acc: 0, xp: 0 }
  };

  var synth = window.speechSynthesis;
  var canSpeak = !!synth && typeof SpeechSynthesisUtterance === "function";
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micPossible = !!SR;

  /* ── i18n ────────────────────────────────────────── */
  function t(k) {
    var pack = C.ui[S.speak] || C.ui.en || {};
    return pack[k] !== undefined ? pack[k] : (C.ui.en && C.ui.en[k]) || k;
  }
  function loc(obj) {
    if (!obj) return "";
    return obj[S.speak] || obj.en || "";
  }
  function langByCode(c) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === c) return LANGS[i];
    return LANGS[0];
  }

  /* ── storage ─────────────────────────────────────── */
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        speak: S.speak, learn: S.learn, mode: S.mode,
        xp: S.xp, best: S.best, total: S.total,
        dayStreak: S.dayStreak, lastDay: S.lastDay,
        todayCount: S.todayCount, todayDate: S.todayDate,
        cleared: S.cleared, unlocked: S.unlocked, badges: S.badges,
        rate: S.rate, voiceURI: S.voiceURI, mic: S.mic, sound: S.sound,
        lv: S.lv, set: S.set
      }));
    } catch (e) {}
  }
  function restore() {
    var r = null;
    try { r = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) {}
    if (!r) return;
    ["speak", "learn", "mode", "lastDay", "todayDate", "voiceURI"].forEach(function (k) {
      if (typeof r[k] === "string") S[k] = r[k];
    });
    ["xp", "best", "total", "dayStreak", "todayCount", "unlocked", "rate", "lv", "set"].forEach(function (k) {
      if (typeof r[k] === "number") S[k] = r[k];
    });
    ["mic", "sound"].forEach(function (k) { if (typeof r[k] === "boolean") S[k] = r[k]; });
    if (r.cleared && typeof r.cleared === "object") S.cleared = r.cleared;
    if (r.badges && typeof r.badges === "object") S.badges = r.badges;
    S.unlocked = Math.max(1, Math.min(LEVELS.length, S.unlocked));
    if (S.lv >= S.unlocked) S.lv = 0;
    if (!micPossible) S.mic = false;
  }

  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function touchDay() {
    var k = dayKey();
    if (S.todayDate !== k) { S.todayDate = k; S.todayCount = 0; }
    if (S.lastDay !== k) {
      S.dayStreak = (S.lastDay === dayKey(new Date(Date.now() - 864e5))) ? S.dayStreak + 1 : 1;
      S.lastDay = k;
    }
  }

  /* ── material ────────────────────────────────────── */
  function setLines() {
    if (S.lines) return S.lines;
    return LEVELS[S.lv].sets[S.set].lines;
  }
  function lineCount() { return setLines().length; }
  function targetText() {
    var l = setLines()[S.i];
    if (!l) return "";
    return typeof l === "string" ? l : (l[S.learn] || l.en || "");
  }
  function nativeText() {
    var l = setLines()[S.i];
    if (!l || typeof l === "string") return "";
    return l[S.speak] || "";
  }
  function setTitle() { return S.lines ? t("ownText") : loc(LEVELS[S.lv].sets[S.set].title); }

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

  /* ── sound ───────────────────────────────────────── */
  var sfx = null;
  function beep(kind) {
    if (!S.sound) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!sfx) sfx = new AC();
      if (sfx.state === "suspended") sfx.resume();
      var seq = kind === "perfect" ? [[659, 0], [880, .08], [1175, .16]]
              : kind === "good"    ? [[587, 0], [880, .09]]
              : kind === "level"   ? [[523, 0], [659, .1], [784, .2], [1047, .32]]
              : kind === "badge"   ? [[784, 0], [1047, .1]]
              :                      [[330, 0]];
      seq.forEach(function (n) {
        var o = sfx.createOscillator(), g = sfx.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        var t0 = sfx.currentTime + n[1];
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(.1, t0 + .012);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + .2);
        o.connect(g); g.connect(sfx.destination);
        o.start(t0); o.stop(t0 + .22);
      });
    } catch (e) {}
  }

  /* ── badges ──────────────────────────────────────── */
  function badgeName(b) { return (b[S.speak] || b.en)[0]; }
  function badgeHow(b) { return (b[S.speak] || b.en)[1]; }

  function grant(id) {
    if (S.badges[id]) return;
    var b = null;
    for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) b = BADGES[i];
    if (!b) return;
    S.badges[id] = true;
    save(); renderBadges();
    showBanner(badgeName(b), badgeHow(b));
    beep("badge");
  }
  function checkBadges(ctx) {
    if (S.total >= 1) grant("first");
    if (ctx && ctx.perfect) grant("perfect");
    if (S.streak >= 5) grant("combo5");
    if (S.streak >= 10) grant("combo10");
    if (S.todayCount >= DAILY_GOAL) grant("goal");
    if (S.dayStreak >= 3) grant("day3");
    if (S.dayStreak >= 7) grant("day7");
    if (S.total >= 100) grant("hundred");
    if (S.unlocked >= 2) grant("level2");
  }

  var bannerTimer = null;
  function showBanner(title, text) {
    $("bantitle").textContent = title;
    $("bantext").textContent = text;
    $("banner").hidden = false;
    if (bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { $("banner").hidden = true; }, 4200);
  }

  function renderBadges() {
    var wrap = $("badges");
    wrap.textContent = "";
    var got = 0;
    BADGES.forEach(function (b) {
      var has = !!S.badges[b.id];
      if (has) got++;
      var el = document.createElement("div");
      el.className = "badge" + (has ? " got" : "");
      var dot = document.createElement("span"); dot.className = "dot";
      var txt = document.createElement("span");
      var nm = document.createElement("b"); nm.textContent = badgeName(b);
      var hw = document.createElement("span"); hw.textContent = badgeHow(b);
      txt.appendChild(nm); txt.appendChild(hw);
      el.appendChild(dot); el.appendChild(txt);
      wrap.appendChild(el);
    });
    $("badgecount").textContent = got + " / " + BADGES.length;
  }

  /* ── rail ────────────────────────────────────────── */
  function buildRail() {
    var railEl = $("rail");
    railEl.textContent = "";
    LEVELS.forEach(function (L, i) {
      var b = document.createElement("button");
      b.className = "lv"; b.type = "button";
      var locked = i >= S.unlocked;
      if (locked) b.classList.add("locked");
      if (i === S.lv && !S.lines) b.classList.add("on");
      if (levelCleared(i)) b.classList.add("cleared");
      b.disabled = locked;
      b.setAttribute("aria-label", t("level") + " " + (i + 1) + ": " + loc(L.name));
      var seg = document.createElement("span"); seg.className = "seg";
      var fill = document.createElement("i");
      fill.style.right = (100 - Math.round(levelDone(i) * 100)) + "%";
      seg.appendChild(fill);
      var n = document.createElement("span"); n.className = "n";
      n.textContent = locked ? t("locked") : t("level") + " " + (i + 1);
      b.appendChild(seg); b.appendChild(n);
      b.addEventListener("click", function () { if (!locked) goToLevel(i); });
      railEl.appendChild(b);
    });
  }
  function goToLevel(i) {
    stopAll();
    S.lines = null; S.lv = i; S.set = firstUncleared(i); S.i = 0; S.phase = "idle";
    S.session = { lines: 0, acc: 0, xp: 0 }; perfectMap = {};
    save(); renderAll();
  }

  /* ── render ──────────────────────────────────────── */
  var perfectMap = {};

  function renderAll() {
    applyStrings();
    buildRail();
    if (S.lines) {
      $("levelname").innerHTML = "<b>" + t("ownText") + "</b> — " + S.lines.length;
    } else {
      var L = LEVELS[S.lv];
      $("levelname").innerHTML = "<b>" + loc(L.name) + "</b> — " + loc(L.hint) +
        " &nbsp;·&nbsp; " + setTitle() + " (" + (S.set + 1) + "/" + L.sets.length + ")";
    }
    $("summary").hidden = true;
    renderProgress(); renderLine(); renderStats(); renderBadges();
    setPhase("idle");
  }

  function renderProgress() {
    var progEl = $("prog");
    progEl.textContent = "";
    for (var k = 0; k < lineCount(); k++) {
      var i = document.createElement("i");
      if (k < S.i) i.className = perfectMap[k] ? "fill perfect" : "fill";
      progEl.appendChild(i);
    }
  }

  var wordSpans = [], wordOffsets = [];
  function renderLine() {
    var lineEl = $("line");
    lineEl.textContent = "";
    lineEl.classList.remove("whole");
    wordSpans = []; wordOffsets = [];
    var txt = targetText(), re = /\S+/g, m, last = 0;
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
    $("translation").textContent = nativeText();
    $("heard").textContent = "";
  }

  function clearMarks() {
    $("line").classList.remove("whole");
    wordSpans.forEach(function (w) { w.className = "w"; });
  }

  function rankFor(xp) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].at) r = RANKS[i];
    return r;
  }

  function renderStats() {
    $("xp").textContent = String(S.xp);
    $("day").textContent = String(S.dayStreak);
    var r = rankFor(S.xp), next = null;
    for (var i = 0; i < RANKS.length; i++) if (RANKS[i].at > S.xp) { next = RANKS[i]; break; }
    var rn = r[S.speak] || r.en;
    $("rank").innerHTML = next
      ? "<b>" + rn + "</b> · " + (next.at - S.xp) + " XP → " + (next[S.speak] || next.en)
      : "<b>" + rn + "</b>";

    if (S.todayDate !== dayKey()) { S.todayDate = dayKey(); S.todayCount = 0; }
    var pct = Math.min(1, S.todayCount / DAILY_GOAL);
    var circ = 2 * Math.PI * 16;
    $("goalring").style.strokeDasharray = circ;
    $("goalring").style.strokeDashoffset = circ * (1 - pct);
    $("goalnum").textContent = String(S.todayCount);
    $("goalwrap").classList.toggle("met", S.todayCount >= DAILY_GOAL);
    $("goalwrap").title = S.todayCount + " / " + DAILY_GOAL;

    $("metatxt").innerHTML = t("streak") + " <b>" + S.streak + "</b> · " +
      t("best") + " <b>" + S.best + "</b> · " + t("lines") + " <b>" + S.total + "</b>";

    var comboOn = S.streak >= 2;
    $("combo").classList.toggle("on", comboOn);
    $("combotxt").textContent = "×" + S.streak;
    $("combofill").style.width = Math.min(100, (S.streak / 10) * 100) + "%";
  }

  function floatXp(n) {
    var el = $("xpfloat");
    el.textContent = "+" + n;
    el.classList.remove("go");
    void el.offsetWidth;
    el.classList.add("go");
  }

  /* ── strings on the page ─────────────────────────── */
  function applyStrings() {
    var L1 = langByCode(S.speak), L2 = langByCode(S.learn);
    $("langpair").textContent = L1.own + " → " + L2.own;
    $("changelang").textContent = t("settings");
    $("m-together").textContent = t("modeTogether");
    $("m-after").textContent = t("modeAfter");
    $("m-correct").textContent = ({ en: "Correct me", es: "Corrígeme", fr: "Corrige-moi" })[S.speak] || "Correct me";
    $("modehint").textContent = S.mode === "together" ? t("modeHintTogether")
      : S.mode === "after" ? t("modeHintAfter")
      : ({ en: "You say it first, then the voice reads it back correctly.",
           es: "Lo dices tú primero y luego la voz te lo lee bien.",
           fr: "Vous le dites d'abord, puis la voix vous le relit correctement." })[S.speak];
    $("lbday").textContent = t("dayStreak");
    $("lbxp").textContent = t("xp");
    $("replay").textContent = t("replay");
    $("skip").textContent = t("skip");
    $("micbtn").textContent = t("mic");
    $("soundbtn").textContent = t("sound");
    $("lbspeed").textContent = t("speed");
    $("lbvoice").textContent = t("voice");
    $("lblines").textContent = t("lines");
    $("lbacc").textContent = t("accuracy");
    $("lbxpe").textContent = t("xpEarned");
    $("reset").textContent = t("reset");
    $("lbbadges").textContent = t("badges");
    $("lbown").textContent = t("ownText");
    $("load").textContent = t("practiseThis");
    $("micask").textContent = t("micOn");
    ["together", "after", "correct"].forEach(function (m) {
      $("m-" + m).classList.toggle("on", S.mode === m);
    });

    var how = {
      en: [["Pick your two languages", "The one you speak decides the hints. The one you're learning is what you say out loud."],
           ["Say the line", "The words turn green as the microphone hears them. Nothing ever cuts you off — press Done when you're finished."],
           ["Three ways to practise", "Together reads with you. After reads first. Correct lets you try alone, then reads it back properly."]],
      es: [["Elige tus dos idiomas", "El que hablas da las traducciones. El que aprendes es el que dices en voz alta."],
           ["Di la frase", "Las palabras se ponen verdes cuando el micrófono las oye. Nada te corta — pulsa Listo cuando acabes."],
           ["Tres formas de practicar", "Juntos lee contigo. Después lee primero. Corrígeme te deja intentarlo solo y luego te lo lee bien."]],
      fr: [["Choisissez vos deux langues", "Celle que vous parlez donne les traductions. Celle que vous apprenez est celle que vous dites."],
           ["Dites la phrase", "Les mots deviennent verts quand le micro les entend. Rien ne vous coupe — appuyez sur Terminé quand vous avez fini."],
           ["Trois façons de pratiquer", "Ensemble lit avec vous. Après lit d'abord. Corrige-moi vous laisse essayer seul, puis relit correctement."]]
    }[S.speak];
    var ol = $("steps");
    ol.textContent = "";
    how.forEach(function (row) {
      var li = document.createElement("li");
      var b = document.createElement("strong"); b.textContent = row[0];
      var s = document.createElement("span"); s.textContent = row[1];
      li.appendChild(b); li.appendChild(s); ol.appendChild(li);
    });
    $("lbhow").textContent = { en: "How this works", es: "Cómo funciona", fr: "Comment ça marche" }[S.speak];
    $("warntxt").textContent = {
      en: "You already know more than you can say. The gap between knowing and speaking only closes one way — your own voice, out loud, every day.",
      es: "Ya sabes más de lo que puedes decir. La distancia entre saber y hablar solo se cierra de una forma: con tu propia voz, en voz alta, cada día.",
      fr: "Vous en savez déjà plus que vous ne pouvez dire. L'écart entre savoir et parler ne se comble que d'une façon : votre propre voix, à voix haute, chaque jour."
    }[S.speak];
    $("notetxt").textContent = {
      en: "Wear headphones — otherwise the microphone hears the app's own voice as well as yours. Everything stays on this device. Works best in Chrome.",
      es: "Usa auriculares — si no, el micrófono oye también la voz de la app. Todo se queda en este dispositivo. Funciona mejor en Chrome.",
      fr: "Utilisez un casque — sinon le micro entend aussi la voix de l'application. Tout reste sur cet appareil. Fonctionne mieux dans Chrome."
    }[S.speak];
    $("ta").placeholder = {
      en: "Paste any text in the language you're learning.",
      es: "Pega cualquier texto en el idioma que estás aprendiendo.",
      fr: "Collez n'importe quel texte dans la langue que vous apprenez."
    }[S.speak];
  }

  /* ── phases ──────────────────────────────────────── */
  function setPhase(p) {
    S.phase = p;
    var eyebrowEl = $("eyebrow"), goTxt = $("gotxt"), goBtn = $("go");
    eyebrowEl.className = "eyebrow";
    $("meter").classList.toggle("on", p === "speaking");
    if (p === "idle") {
      eyebrowEl.textContent = S.i === 0
        ? setTitle() + " — " + t("pressStart")
        : t("line") + " " + (S.i + 1) + " " + t("of") + " " + lineCount();
      goTxt.textContent = S.i === 0 ? t("startBtn") : t("nextBtn");
      goBtn.className = "primary"; goBtn.disabled = !canSpeak && S.mode !== "correct";
      $("replay").disabled = false; $("skip").disabled = false;
    } else if (p === "listening") {
      eyebrowEl.textContent = t("listen"); eyebrowEl.classList.add("live");
      goTxt.textContent = t("reading"); goBtn.className = "primary"; goBtn.disabled = true;
      $("replay").disabled = true; $("skip").disabled = false;
    } else if (p === "speaking") {
      eyebrowEl.textContent = S.mode === "together" ? t("readAlong") : t("yourTurn");
      eyebrowEl.classList.add("live");
      goTxt.textContent = t("doneBtn");
      goBtn.className = "primary"; goBtn.disabled = false;    // never cut the learner off
      $("replay").disabled = false; $("skip").disabled = false;
    } else if (p === "scored") {
      goTxt.textContent = S.i >= lineCount() - 1 ? t("finishBtn") : t("nextBtn");
      goBtn.className = "primary green"; goBtn.disabled = false;
      $("replay").disabled = false; $("skip").disabled = true;
    } else if (p === "finished") {
      goTxt.textContent = S.lines ? t("again") : t("nextPassage");
      goBtn.className = "primary"; goBtn.disabled = false;
      $("replay").disabled = true; $("skip").disabled = true;
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
    var code = S.learn || "en";
    voices = all.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(code) === 0; });
    if (!voices.length) voices = all;
    if (!voices.length) return;
    if (!pickVoice() || pickVoice().lang.toLowerCase().indexOf(code) !== 0) S.voiceURI = voices[0].voiceURI;
    var sel = $("voice");
    sel.textContent = "";
    voices.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.voiceURI;
      // Voice names arrive as "Eddy (Spanish (Spain))" — drop every bracketed part.
      o.textContent = v.name.replace(/\([^()]*\)/g, "").replace(/[()]/g, "")
        .replace(/\s+/g, " ").trim() + " · " + v.lang;
      sel.appendChild(o);
    });
    var pv = pickVoice(); if (pv) sel.value = pv.voiceURI;
  }

  /* ── text to speech ──────────────────────────────── */
  var utter = null, sawBoundary = false;

  function readLine(then, markWords) {
    if (!canSpeak) { then && then(); return; }
    var txt = targetText();
    var u = new SpeechSynthesisUtterance(txt);
    u.rate = S.rate;
    var v = pickVoice();
    u.lang = v ? v.lang : langByCode(S.learn).speech;
    if (v) u.voice = v;
    sawBoundary = false;

    if (markWords !== false) {
      u.onboundary = function (ev) {
        if (utter !== u) return;
        if (ev.name && ev.name !== "word") return;
        sawBoundary = true;
        var ci = ev.charIndex;
        for (var i = 0; i < wordOffsets.length; i++) {
          if (wordSpans[i].classList.contains("said")) continue;
          wordSpans[i].classList.toggle("lit", ci >= wordOffsets[i].a && ci < wordOffsets[i].b);
        }
      };
      u.onstart = function () {
        setTimeout(function () {
          if (utter === u && !sawBoundary) $("line").classList.add("whole");
        }, 300);
      };
    }
    u.onend = function () {
      if (utter !== u) return;
      utter = null;
      $("line").classList.remove("whole");
      wordSpans.forEach(function (w) { w.classList.remove("lit"); });
      then && then();
    };
    u.onerror = function () { if (utter !== u) return; utter = null; then && then(); };
    utter = u;
    try { synth.speak(u); } catch (e) { then && then(); }
  }

  /* ── mic meter ───────────────────────────────────── */
  var audioCtx = null, analyser = null, micStream = null, meterRAF = null;
  function startMeter() {
    if (!analyser) return;
    var buf = new Uint8Array(analyser.fftSize);
    (function tick() {
      analyser.getByteTimeDomainData(buf);
      var sum = 0;
      for (var i = 0; i < buf.length; i++) { var d = (buf[i] - 128) / 128; sum += d * d; }
      $("meterfill").style.width = Math.min(100, Math.round(Math.sqrt(sum / buf.length) * 320)) + "%";
      meterRAF = requestAnimationFrame(tick);
    })();
    $("meter").classList.remove("idlepulse");
  }
  function stopMeter() {
    if (meterRAF) { cancelAnimationFrame(meterRAF); meterRAF = null; }
    $("meterfill").style.width = "0%";
  }
  function askMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
      return Promise.reject(new Error("unsupported"));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micStream = stream;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        audioCtx.createMediaStreamSource(stream).connect(analyser);
      } catch (e) { analyser = null; }
      return true;
    });
  }
  function showNotice(msg, withButton) {
    $("noticetxt").textContent = msg;
    $("micask").hidden = !withButton;
    $("notice").hidden = false;
  }
  function hideNotice() { $("notice").hidden = true; }

  /* ── recognition + live matching ─────────────────── */
  var rec = null, recFinal = "", recActive = false, liveIdx = 0;

  // Lowercase, straighten quotes, strip accents so "café" matches "cafe",
  // then drop punctuation. Accent-stripping matters: recognition is inconsistent
  // about diacritics in Spanish and French.
  function norm(s) {
    s = String(s).toLowerCase().replace(/[‘’']/g, "'");
    if (String.prototype.normalize) {
      s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    return s.replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function targetWords() {
    return wordSpans.map(function (sp) { return norm(sp.textContent).replace(/ /g, ""); });
  }
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
  function liveMatch(transcript) {
    var said = norm(transcript).split(" ").filter(Boolean), tgt = targetWords(), p = 0;
    for (var s = 0; s < said.length; s++)
      for (var k = p; k < Math.min(p + 3, tgt.length); k++)
        if (near(said[s], tgt[k])) { p = k + 1; break; }
    if (p > liveIdx) {
      for (var i = liveIdx; i < p; i++) {
        wordSpans[i].classList.remove("lit");
        wordSpans[i].classList.add("said");
      }
      liveIdx = p;
    }
  }
  function stopRec() {
    recActive = false;
    if (rec) {
      try { rec.onend = null; rec.onresult = null; rec.onerror = null; rec.stop(); } catch (e) {}
      rec = null;
    }
    stopMeter();
  }
  function startRec(onDone) {
    if (!S.mic || !micPossible) return false;
    try { rec = new SR(); } catch (e) { micFailed(t("micBlocked")); return false; }
    rec.lang = langByCode(S.learn).speech;
    rec.interimResults = true;
    rec.continuous = true;                 // listen through your pauses
    rec.maxAlternatives = 1;
    recFinal = ""; recActive = true; liveIdx = 0;

    rec.onresult = function (e) {
      var interim = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) recFinal += tr + " "; else interim += tr;
      }
      var all = (recFinal + " " + interim).trim();
      liveMatch(all);
      $("heard").innerHTML = t("heard") + ": <b></b>";
      $("heard").querySelector("b").textContent = all;
    };
    rec.onerror = function (ev) {
      var err = ev && ev.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        recActive = false; micFailed(t("micBlocked")); setPhase("speaking");
      } else if (err !== "no-speech" && err !== "aborted") {
        recActive = false; onDone((recFinal || "").trim());
      }
    };
    rec.onend = function () {
      if (!recActive) return;
      recActive = false;
      onDone((recFinal || "").trim());
    };
    try { rec.start(); } catch (e) { micFailed(t("micBlocked")); return false; }
    startMeter();
    return true;
  }
  function micFailed(msg) {
    S.mic = false;
    $("micbtn").classList.remove("on");
    stopMeter();
    showNotice(msg, true);
    save();
  }

  /* ── scoring ─────────────────────────────────────── */
  function score(said) {
    var a = norm(said).split(" ").filter(Boolean), b = targetWords();
    if (!b.length) return { pct: 0, matched: [] };
    var m = a.length, n = b.length, i, j, dp = [];
    for (i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++)
        dp[i][j] = near(a[i - 1], b[j - 1]) ? dp[i - 1][j - 1] + 1
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
    var r = score(said || ""), pct = Math.round(r.pct * 100);
    clearMarks();
    r.matched.forEach(function (ok, k) {
      if (wordSpans[k]) wordSpans[k].classList.add(ok ? "hit" : "miss");
    });
    var pass = r.pct >= 0.7, perfect = r.pct >= 0.95;
    perfectMap[S.i] = perfect;
    $("eyebrow").className = "eyebrow " + (pass ? "ok" : "live");
    $("eyebrow").textContent = perfect ? t("perfect") + " — " + pct + "%"
      : pass ? t("good") + " — " + pct + "%"
      : t("close") + " — " + pct + "%. " + t("missWords");
    $("heard").innerHTML = t("heard") + ": <b></b>";
    $("heard").querySelector("b").textContent = said || "—";
    award(pass, r.pct, perfect);
    beep(perfect ? "perfect" : pass ? "good" : "miss");
    setPhase("scored");
    // Correct mode: hear the line done properly, right after your attempt.
    if (S.mode === "correct") setTimeout(function () { readLine(null, false); }, 420);
  }

  function showSelfMark() {
    clearMarks();
    perfectMap[S.i] = false;
    $("eyebrow").className = "eyebrow ok";
    $("eyebrow").textContent = t("counted");
    award(true, 0.9, false);
    beep("good");
    setPhase("scored");
    if (S.mode === "correct") setTimeout(function () { readLine(null, false); }, 420);
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
    } else { S.streak = 0; gain = 3; }
    S.xp += gain; S.total++; S.todayCount++;
    S.session.lines++; S.session.acc += ratio; S.session.xp += gain;
    floatXp(gain);
    renderStats(); save();
    checkBadges({ perfect: perfect });
  }

  /* ── loop ────────────────────────────────────────── */
  var settled = false, finishLine = null;

  function stopAll() {
    utter = null;
    try { synth && synth.cancel(); } catch (e) {}
    stopRec();
    $("meter").classList.remove("on", "idlepulse");
  }

  function runLine() {
    if (S.phase === "listening" || S.phase === "speaking") return;
    awarded = false; settled = false;
    clearMarks(); hideNotice();

    finishLine = function (said) {
      if (settled) return;
      settled = true;
      stopRec();
      $("meter").classList.remove("on", "idlepulse");
      if (said === null) showSelfMark(); else showScore(said);
    };

    var openMic = function () {
      var started = startRec(finishLine);
      setPhase("speaking");
      if (!started) $("meter").classList.add("idlepulse");
      $("metercap").textContent = started ? t("listening") : t("yourTurn");
    };

    if (S.mode === "together") {
      openMic();
      readLine(function () { /* voice done — you may still be talking */ });
    } else if (S.mode === "after") {
      setPhase("listening");
      readLine(function () { if (S.phase === "listening") openMic(); });
    } else {                       // correct: you go first, alone
      openMic();
    }
  }

  function done() {
    try { synth && synth.cancel(); } catch (e) {}
    utter = null;
    if (S.mic && recActive && rec) { try { rec.stop(); return; } catch (e) {} }
    if (finishLine) finishLine(S.mic ? (recFinal || "").trim() : null);
  }

  function nextLine() {
    if (S.i >= lineCount() - 1) return finishPassage();
    S.i++;
    renderProgress(); renderLine(); setPhase("idle");
    runLine();
  }

  function finishPassage() {
    stopAll();
    S.phase = "finished";
    var leveledUp = false;
    if (!S.lines) {
      S.cleared[S.lv + "-" + S.set] = true;
      if (levelCleared(S.lv) && S.unlocked < S.lv + 2) {
        S.unlocked = Math.min(LEVELS.length, S.lv + 2);
        leveledUp = S.lv + 1 < LEVELS.length;
      }
      save();
    }
    grant("passage");
    buildRail(); renderProgress(); clearMarks();
    $("translation").textContent = "";
    $("eyebrow").className = "eyebrow ok";
    $("eyebrow").textContent = t("complete");
    $("line").textContent = leveledUp
      ? t("level") + " " + (S.lv + 2) + " " + t("unlocked")
      : t("keepGoing");
    $("heard").textContent = "";
    beep(leveledUp ? "level" : "good");
    if (leveledUp) grant("level2");

    var n = Math.max(1, S.session.lines);
    $("sumlines").textContent = String(S.session.lines);
    $("sumacc").textContent = Math.round((S.session.acc / n) * 100) + "%";
    $("sumxp").textContent = "+" + S.session.xp;
    $("summary").hidden = false;
    setPhase("finished");
  }

  function advancePassage() {
    S.session = { lines: 0, acc: 0, xp: 0 }; perfectMap = {};
    if (S.lines) { S.i = 0; renderAll(); return; }
    var L = LEVELS[S.lv], next = -1;
    for (var s = 0; s < L.sets.length; s++) if (!S.cleared[S.lv + "-" + s]) { next = s; break; }
    if (next === -1) {
      if (S.lv + 1 < LEVELS.length && S.unlocked > S.lv + 1) { goToLevel(S.lv + 1); return; }
      next = (S.set + 1) % L.sets.length;
    }
    S.set = next; S.i = 0; save(); renderAll();
  }

  /* ── onboarding ──────────────────────────────────── */
  function fillLangSelects() {
    [$("obspeak"), $("oblearn")].forEach(function (sel, idx) {
      sel.textContent = "";
      LANGS.forEach(function (L) {
        var o = document.createElement("option");
        o.value = L.code;
        o.textContent = idx === 0 ? L.own : L.label + " · " + L.own;
        sel.appendChild(o);
      });
    });
    $("obspeak").value = "en";
    $("oblearn").value = "es";
  }
  function showOnboard() {
    $("onboard").hidden = false;
    $("app").hidden = true;
    fillLangSelects();
    if (S.speak) $("obspeak").value = S.speak;
    if (S.learn) $("oblearn").value = S.learn;
    syncOnboardStrings();
  }
  function syncOnboardStrings() {
    var code = $("obspeak").value;
    var pack = C.ui[code] || C.ui.en;
    $("obtitle").textContent = pack.onboardTitle;
    $("obbody").textContent = pack.onboardBody;
    $("oblabspeak").textContent = pack.iSpeak;
    $("oblablearn").textContent = pack.iLearn;
    $("obgo").textContent = pack.start;
  }
  function startApp() {
    $("onboard").hidden = true;
    $("app").hidden = false;
    document.documentElement.lang = S.speak;
    fillVoices();
    renderAll();
    if (!micPossible) {
      $("micbtn").disabled = true;
      $("micbtn").classList.remove("on");
      showNotice(t("noSR"), false);
    } else if (S.mic) {
      showNotice(t("micAsk"), true);
    }
  }

  /* ── wiring ──────────────────────────────────────── */
  $("obspeak").addEventListener("change", syncOnboardStrings);
  $("obgo").addEventListener("click", function () {
    var a = $("obspeak").value, b = $("oblearn").value;
    if (a === b) { $("obwarn").hidden = false; return; }
    $("obwarn").hidden = true;
    S.speak = a; S.learn = b; S.voiceURI = null;
    S.lv = 0; S.set = 0; S.i = 0; S.lines = null;
    save(); startApp();
  });
  $("changelang").addEventListener("click", function () { stopAll(); showOnboard(); });

  ["together", "after", "correct"].forEach(function (m) {
    $("m-" + m).addEventListener("click", function () {
      S.mode = m; save();
      if (S.phase === "listening" || S.phase === "speaking") { stopAll(); setPhase("idle"); }
      applyStrings();
    });
  });

  $("go").addEventListener("click", function () {
    if (S.phase === "idle") runLine();
    else if (S.phase === "speaking") done();
    else if (S.phase === "scored") nextLine();
    else if (S.phase === "finished") advancePassage();
  });
  $("replay").addEventListener("click", function () {
    var back = S.phase;
    try { synth && synth.cancel(); } catch (e) {}
    utter = null;
    readLine(function () { if (S.phase !== back) setPhase(back); });
  });
  $("skip").addEventListener("click", function () {
    stopAll();
    S.streak = 0; renderStats(); save();
    if (S.i >= lineCount() - 1) finishPassage();
    else { S.i++; renderProgress(); renderLine(); setPhase("idle"); }
  });
  $("micbtn").addEventListener("click", function () {
    if (!micPossible) return;
    S.mic = !S.mic;
    $("micbtn").classList.toggle("on", S.mic);
    save();
    if (S.mic) askMic().then(hideNotice).catch(function () { micFailed(t("micBlocked")); });
    else hideNotice();
    if (S.phase === "listening" || S.phase === "speaking") { stopAll(); setPhase("idle"); }
  });
  $("soundbtn").addEventListener("click", function () {
    S.sound = !S.sound;
    $("soundbtn").classList.toggle("on", S.sound);
    save();
    if (S.sound) beep("good");
  });
  $("micask").addEventListener("click", function () {
    askMic().then(function () {
      S.mic = true; $("micbtn").classList.add("on"); hideNotice(); save();
    }).catch(function () { showNotice(t("micBlocked"), false); });
  });
  $("rate").addEventListener("input", function () {
    S.rate = parseFloat($("rate").value);
    $("ratev").textContent = S.rate.toFixed(2) + "×";
  });
  $("rate").addEventListener("change", save);
  $("voice").addEventListener("change", function () { S.voiceURI = $("voice").value; save(); });
  $("load").addEventListener("click", function () {
    var txt = $("ta").value.trim();
    if (!txt) return;
    stopAll();
    var out = [];
    txt.split(/\n+/).forEach(function (para) {
      var body = para.replace(/\s+/g, " ").trim();
      if (!body) return;
      var re = /[^.!?…]+(?:[.!?…]+["'”’)]*|$)/g, m;
      while ((m = re.exec(body)) !== null) {
        var s = m[0].trim();
        if (s) { var o = {}; o[S.learn] = s; out.push(o); }
      }
    });
    if (!out.length) return;
    S.lines = out; S.i = 0; S.phase = "idle";
    S.session = { lines: 0, acc: 0, xp: 0 }; perfectMap = {};
    renderAll();
    document.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("reset").addEventListener("click", function () {
    stopAll();
    S.xp = 0; S.streak = 0; S.best = 0; S.total = 0; S.dayStreak = 0; S.lastDay = null;
    S.todayCount = 0; S.cleared = {}; S.badges = {}; S.unlocked = 1;
    S.lv = 0; S.set = 0; S.i = 0; S.lines = null; S.phase = "idle";
    S.session = { lines: 0, acc: 0, xp: 0 }; perfectMap = {};
    save(); renderAll();
  });

  document.addEventListener("keydown", function (e) {
    if ($("onboard").hidden === false) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === " ") { e.preventDefault(); if (!$("go").disabled) $("go").click(); }
    else if (e.key === "r" || e.key === "R") { if (!$("replay").disabled) $("replay").click(); }
    else if (e.key === "s" || e.key === "S") { if (!$("skip").disabled) $("skip").click(); }
  });
  window.addEventListener("beforeunload", function () {
    try { synth && synth.cancel(); } catch (e) {}
    if (micStream) micStream.getTracks().forEach(function (tr) { tr.stop(); });
  });

  /* ── start ───────────────────────────────────────── */
  restore();
  $("rate").value = String(S.rate);
  $("ratev").textContent = S.rate.toFixed(2) + "×";
  $("micbtn").classList.toggle("on", S.mic);
  $("soundbtn").classList.toggle("on", S.sound);

  if (canSpeak) {
    fillVoices();
    if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = fillVoices;
    setTimeout(fillVoices, 400);
  }

  if (S.speak && S.learn) startApp(); else showOnboard();
})();
