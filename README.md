# Say It Back

An English speaking trainer. A voice reads a line out loud; you read it **at the
same time**; your microphone follows along and lights up each word in green as it
hears you say it.

Built on the one idea that actually moves speaking ability: you don't think your
way into fluency, you speak your way into it. So the app never lets you sit and
read silently — every line asks for your voice.

No accounts, no server, no tracking. Everything runs in the browser.

## How it works

1. **Read together.** The voice reads a line at 0.8× speed and you read along out
   loud. Each word lights up as the voice reaches it.
2. **Watch the words turn green.** Speech recognition follows your voice and marks
   each word it hears, in order. A small look-ahead means one fluffed word doesn't
   derail the rest of the line.
3. **Take as long as you want.** Nothing interrupts you. The microphone stays open
   through your pauses — you press **Done** when *you* are finished, not on a timer.
   Anything the mic didn't catch gets underlined.

Turn **Together** off if you'd rather hear the whole line first and repeat it after.

## Content

Five levels, four passages each, twenty passages in total. Difficulty is built
from sentence length, tense, contractions, and idiom:

| Level | Name | What it drills |
|---|---|---|
| 1 | Getting started | Short present-tense lines |
| 2 | Every day | Past tense, joining two ideas |
| 3 | Real conversation | Contractions and phrasal verbs |
| 4 | Work and opinion | Interviews, meetings, disagreeing politely |
| 5 | Fluent | Long sentences, idiom, rhythm |

A level unlocks when you finish every passage in the one before it. You can also
paste your own text — an email, a script, something you have to say on Monday —
and practise that instead.

All practice text is original and written for this app.

## Progress

XP per line (bonus for a perfect line and for streaks), a rank that climbs from
Beginner to Natural, a **day streak** that counts consecutive days practised, and
an end-of-passage summary with lines, accuracy and XP earned. Stored in
`localStorage` on the device, and cleared by the "Reset progress" link.

## Running it

It's a static site — no build step, no dependencies.

```bash
cd say-it-back
python3 -m http.server 8000
# then open http://localhost:8000
```

Open it over `http://localhost` or an `https://` URL. Browsers only grant
microphone access on a secure origin, so opening `index.html` as a `file://` path
will give you the voice but not the scoring.

## Browser support

| | Voice reads to you | Microphone scoring |
|---|---|---|
| Chrome (desktop) | yes | yes |
| Edge | yes | yes |
| Safari | yes | partial — word timing is coarse |
| Firefox | yes | no speech recognition |

The app detects what's missing and degrades: without recognition it keeps the
read-along and the levels, and you mark each line yourself.

**Wear headphones.** In Together mode the microphone hears the app's own voice as
well as yours, which flatters your score. Headphones fix it completely.

## Layout

```
index.html          markup
assets/styles.css   design tokens, light and dark
assets/app.js       speech, recognition, scoring, progress
assets/content.js   the twenty passages
```

## Licence

Personal project. Practice text © its author.
