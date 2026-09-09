# Say It Back

A speak-out-loud language trainer. You pick the language you already speak and
the one you want to learn. A line appears, you say it, and your microphone lights
up each word in green as it hears you.

Built on the one idea that actually moves speaking ability: you don't think your
way into fluency, you speak your way into it. So the app never lets you read
silently — every line asks for your voice.

No accounts, no server, no tracking, no build step. Everything runs in the browser.

## Onboarding

Two questions: **I speak** and **I want to learn**. That's it. The language you
speak sets the interface and the translation hint under each line; the language
you're learning is what gets spoken, heard and scored. Both are changeable at any
time from the link in the header.

Currently English, Spanish and French, in any combination — nine pairs.

## Three modes, chosen at the top

| Mode | What happens |
|---|---|
| **Together** | The voice reads and you read out loud at the same time. |
| **After** | The voice reads the line first, then it's your turn. |
| **Correct me** | You say it alone with no voice, then it reads the line back correctly so you hear the difference. |

In every mode the microphone stays open through your pauses and **nothing ever
cuts you off**. You press Done when you are finished.

## Feedback

As you speak, words turn green in order, with a one-edit tolerance and a small
look-ahead so one fumbled word doesn't derail the rest. Accents are stripped
before matching, because recognition is inconsistent about them — *café* matches
*cafe*. When you finish, anything the mic didn't catch is underlined, and you get
a percentage.

A live level meter reads actual microphone amplitude, so you can see it hearing
you before you trust the score.

## Progress

XP per line with bonuses for perfect lines and streaks · a rank from Beginner to
Natural · a **daily goal ring** (20 lines) · a **day streak** counting consecutive
days · a combo multiplier · ten badges · an end-of-passage summary.

All stored in `localStorage` on the device and cleared by "Reset progress".

## Content

Five levels, two passages each, built from sentence length, tense, contractions
and idiom — Getting started, Every day, Real conversation, Work and opinion,
Fluent. Every line exists in all three languages at once, so any pair works
without new content.

A level unlocks when you finish every passage in the one before it. You can also
paste your own text and practise that instead.

All practice text is original and written for this app.

## Running it

```bash
cd say-it-back
python3 -m http.server 8000
# open http://localhost:8000
```

Use `http://localhost` or an `https://` URL. Browsers only grant microphone
access on a secure origin, so opening `index.html` as a `file://` path gives you
the voice but not the scoring.

## Browser support

| | Voice | Microphone scoring |
|---|---|---|
| Chrome (desktop) | yes | yes |
| Edge | yes | yes |
| Safari | yes | partial — coarse word timing |
| Firefox | yes | no speech recognition |

The app detects what's missing and degrades: without recognition you keep the
read-along and the levels, and mark each line yourself.

**Wear headphones.** In Together and After modes the microphone hears the app's
own voice as well as yours, which flatters your score. Correct me has no such
problem — nothing is playing while you speak.

## Adding a language

Add its code to `languages` in `assets/content.js`, add a `ui` block, and add one
string per line. Nothing else changes — the voice and recognition pick up the new
`speech` code automatically.

## Layout

```
index.html              markup
manifest.webmanifest    add-to-home-screen metadata
assets/styles.css       design tokens, light and dark
assets/app.js           speech, recognition, scoring, progress
assets/content.js       languages, interface strings, passages
```

Deliberately dependency-free and framework-free, so it wraps cleanly into a
native shell later.

## Licence

Personal project. Practice text © its author.
