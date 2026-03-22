# viral-content-engine

[![npm version](https://img.shields.io/npm/v/viral-content-engine.svg)](https://www.npmjs.com/package/viral-content-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

**One topic in -> 30+ ready-to-post images -> all platforms -> zero cost.**

A local-first CLI that turns a single prompt into a full batch of platform-optimized social images. Runs entirely on your machine using Ollama for text generation and Playwright for rendering — no API keys, no subscriptions, no data leaving your system.

---



## 🎬 Examples

All images auto-generated from topic: **"being a developer"**

### Relatable Cards
| | | |
|:---:|:---:|:---:|
| ![r0](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/relatable-0_tiktok.png) | ![r1](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/relatable-1_tiktok.png) | ![r2](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/relatable-2_tiktok.png) |

### Hot Takes
| | | |
|:---:|:---:|:---:|
| ![h0](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/hot-take-0_tiktok.png) | ![h1](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/hot-take-1_tiktok.png) | ![h2](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/hot-take-2_tiktok.png) |

### Comparisons
| | |
|:---:|:---:|
| ![c0](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/comparison-0_tiktok.png) | ![c1](https://github.com/SergiuPogor/viral-content-engine/releases/download/v1.0.2-examples/comparison-1_tiktok.png) |

> Generated with: `viral generate "being a developer" --platform tiktok --niche developers`

## Table of Contents

- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Formats](#formats)
- [Themes](#themes)
- [Configuration](#configuration)
- [Content Strategy](#content-strategy)
- [Stack](#stack)
- [License](#license)

---

## Quick Start

Five commands to go from zero to a full content batch:

```bash
npm install -g viral-content-engine
ollama pull llama3.2
viral init
viral generate "productivity habits for software engineers"
viral preview
```

`viral init` creates a `viral.config.yaml` in the current directory with sensible defaults. Edit it before your first real run to set your niche, preferred formats, and output directory.

---

## CLI Commands

### `viral generate <topic>`

Generate a full image batch from a topic string. This is the primary command.

```bash
viral generate "morning routines that double your output"
viral generate "why most developers never get promoted" --formats hot-take,list-card,quote-card
viral generate "remote work myths" --theme neon --count 10
viral generate "TypeScript tips" --niche "senior engineers" --output ./drops/ts-tips
```

**Options:**

| Flag | Description | Default |
|---|---|---|
| `--formats <list>` | Comma-separated format names | all enabled in config |
| `--theme <name>` | Override the active theme | config value |
| `--count <n>` | Images per format | config value |
| `--niche <string>` | Audience context passed to the model | config value |
| `--output <dir>` | Output directory | `./output` |
| `--dry-run` | Print generated copy without rendering images | false |

---

### `viral batch <file>`

Run multiple topics from a plain text file, one topic per line. Produces a separate dated folder per topic.

```bash
viral batch topics.txt
viral batch campaigns/q2.txt --theme light-clean --output ./batch-out
```

`topics.txt` format:

```
react performance anti-patterns
the hidden cost of technical debt
5 signs your standup is broken
habits of engineers who get promoted fast
```

---

### `viral preview`

Open the most recently generated batch in a local browser gallery. Shows all images with their format label, dimensions, and file size.

```bash
viral preview
viral preview --dir ./output/2026-03-22_productivity-habits
viral preview --port 4200
```

---

### `viral themes`

List all available themes with a one-line description of each. Use `--show <name>` to render a sample card in the terminal.

```bash
viral themes
viral themes --show neon
viral themes --show warm
```

---

### `viral formats`

List all available content formats with descriptions and example output copy.

```bash
viral formats
viral formats --show hot-take
viral formats --show fake-tweet
```

---

### `viral init`

Scaffold a `viral.config.yaml` in the current working directory. Safe to re-run — will not overwrite an existing config unless `--force` is passed.

```bash
viral init
viral init --force
viral init --output ./my-project
```

---

### `viral doctor`

Check that all runtime dependencies are installed and reachable: Node.js version, Ollama daemon, the required model, Playwright browser binaries, and write access to the output directory.

```bash
viral doctor
```

Example output:

```
[ok] Node.js v20.14.0
[ok] Ollama daemon reachable at http://127.0.0.1:11434
[ok] Model llama3.2 available
[ok] Playwright chromium binary found
[ok] Output directory ./output is writable
```

---

### `viral last`

Print the path to the most recently generated output directory and a summary of what was produced.

```bash
viral last
```

Example output:

```
Last run: 2026-03-22T09:14:02Z
Topic:    "productivity habits for software engineers"
Output:   /home/user/projects/content/output/2026-03-22_productivity-habits
Images:   32 files  (8 formats x 4 variations)
Theme:    dark-minimal
```

---

## Formats

Eight content formats are built in. Each maps to a distinct visual layout and generates copy suited to that format's native context on social platforms.

### `relatable`

A two-part card structured around a shared frustration or experience. Opens with a situation the audience recognizes, then delivers a payoff that confirms it. High share rate because readers tag other people who "need to see this."

```
Top text:  "That feeling when you fix the bug but have no idea why it works"
Bottom text: "Ship it and pretend you planned it that way."
```

---

### `hot-take`

A single bold, opinionated statement designed to provoke a response. The copy is intentionally polarizing but defensible. Generates comments from people who agree and people who don't — both outcomes drive reach.

```
"Estimates are a ritual that makes managers feel safe. They tell you nothing about when the work will be done."
```

---

### `comparison`

A side-by-side layout contrasting two approaches, mindsets, or outcomes. One column is labeled negatively (or naively), the other positively (or advanced). Performs well as a save-to-revisit post.

```
Column A — Junior mindset:   "I'll fix it when someone complains"
Column B — Senior mindset:   "I'll add an alert before anyone notices"
```

---

### `fake-tweet`

A rendered mock of a tweet-style post with a fabricated but plausible username, handle, avatar placeholder, and like/retweet counts. Used to surface an insight in a format that feels native to Twitter/X even when posted on Instagram or LinkedIn. All content is clearly fictional.

```
@thoughtfuldev
"Spent 3 hours debugging. The issue was a trailing space in a .env file.
I need a walk."
[1.2k likes  |  847 retweets]
```

---

### `fake-text`

A rendered iMessage-style conversation between two contacts. Presents a scenario as a dialogue — commonly used for humor, contrast, or to dramatize a point through back-and-forth. Contact names are generic (e.g., "Recruiter", "Dev", "Manager").

```
Manager:  "Can we add this one small feature before launch?"
Dev:      "Sure. When is launch?"
Manager:  "Tomorrow."
Dev:       [seen 9:41 AM]
```

---

### `list-card`

A numbered or bulleted list with a strong headline. Clean vertical layout, high information density. Works well as a "save this" post and performs across LinkedIn, Instagram carousels, and Pinterest.

```
5 things senior engineers do differently

1. They ask why before they ask how.
2. They write the rollback plan first.
3. They say "I don't know" without apologizing.
4. They make the next developer's job easier.
5. They treat boredom as a signal, not a problem.
```

---

### `quote-card`

A single attributed quote centered on the card. Minimal layout — the text is the entire message. Used for inspirational, philosophical, or provocative statements. The attribution can be a real name, a role, or a made-up persona consistent with the niche.

```
"The best code you can write is the code you don't have to maintain."
— Anonymous senior engineer
```

---

### `roast`

A pointed, humorous critique of a common bad practice, tool, or attitude within the target niche. Tone is satirical rather than mean-spirited. Performs well in communities where people share in-jokes about their own industry.

```
"Daily standups: a ceremony where everyone describes what they did
on Slack yesterday, out loud, to people who weren't listening."
```

---

## Themes

Seven visual themes are available. Each theme defines a color palette, typography scale, border style, and background treatment applied consistently across all formats in a batch.

### `dark-minimal`

Near-black background (`#0d0d0d`), off-white text, single-weight sans-serif, no decorative elements. Maximum contrast, zero noise. The default theme. Works well for hot-takes, quote cards, and relatable formats.

### `light-clean`

White or very light grey background, dark text, generous padding, subtle drop shadow on the card container. Professional and readable. Performs well on LinkedIn and Pinterest where clean aesthetics outperform high-contrast dark cards.

### `neon`

Dark background with vivid accent colors — electric blue, acid green, or hot pink depending on the content type. High visual energy. Best suited for tech, gaming, and developer niches posting to Instagram or Twitter/X.

### `mono`

Strict monochrome — everything in black, white, and mid-greys. Uses a monospaced typeface throughout. Signals technical credibility. Works particularly well for fake-tweet, fake-text, and list-card formats targeted at developer audiences.

### `warm`

Warm off-white or cream background, earth tones for accents, a humanist serif or rounded sans-serif for headlines. Approachable and personal. Best for self-improvement, productivity, and lifestyle niches.

### `gradient`

Full-bleed gradient backgrounds ranging from deep purple to cobalt, or burnt orange to rose. High visual stopping power in feeds. Best reserved for quote cards and hot-takes where the text is short enough not to compete with the background.

### `paper`

Simulated paper or parchment texture, slightly irregular margins, and a serif body font. Evokes handwritten notes or printed pages. Effective for educational content, long-form list cards, and niches where authenticity beats polish.

---

## Configuration

`viral init` creates the following file. Every key is optional — the CLI falls back to built-in defaults for anything not specified.

```yaml
# viral.config.yaml

model:
  provider: ollama
  name: llama3.2
  temperature: 0.8
  maxTokens: 512

output:
  directory: ./output
  filenamePattern: "{date}_{topic-slug}_{format}_{index}"
  formats:
    - png

image:
  width: 1080
  height: 1080
  scale: 2

theme: dark-minimal

formats:
  enabled:
    - relatable
    - hot-take
    - comparison
    - fake-tweet
    - fake-text
    - list-card
    - quote-card
    - roast
  variationsPerFormat: 4

niche: ""

content:
  tone: "direct, no fluff"
  avoidPhrases:
    - "game-changer"
    - "unlock your potential"
    - "in today's fast-paced world"
  addHashtags: false
  addWatermark: false
  watermarkText: ""

preview:
  port: 3131
  autoOpen: true
```

### Key fields

**`model.temperature`** — Controls copy creativity. `0.6` for more predictable, on-brand output. `1.0` for more varied, experimental copy. Start at `0.8`.

**`image.scale`** — Pixel density multiplier. `2` produces a 2160x2160 image from a 1080x1080 layout. Keep at `2` for retina-quality exports.

**`formats.variationsPerFormat`** — How many distinct copy variations to generate per format per run. Higher values give you more to choose from during content curation.

**`content.avoidPhrases`** — List of phrases the model is instructed never to use. Effective for keeping output on-brand and avoiding overused language.

**`niche`** — A short description of your target audience. Passed to the model as context on every generation call. Example: `"senior software engineers at Series B startups"`.

---

## Content Strategy

### 30-Day Content Calendar

Use the batch command to pre-generate a full month in a single session. Structure your topic file around this four-week arc:

**Week 1 — Establish authority**

Open with content that demonstrates you understand the audience's daily reality. Formats that perform well: `relatable`, `list-card`, `comparison`. Topics should be specific to your niche and immediately recognizable.

```
day 1:  signs your codebase has no owner
day 2:  what good PR reviews actually look like
day 3:  the real reason estimates are always wrong
day 4:  junior vs senior debugging process
day 5:  tools every backend engineer should know
```

**Week 2 — Provoke discussion**

Shift to opinionated content designed to generate comments. Formats: `hot-take`, `roast`, `fake-tweet`. Topics should be defensible positions that a portion of your audience will push back on — pushback is engagement.

```
day 8:  agile ceremonies that add no value
day 9:  the myth of the 10x developer
day 10: why your unit tests are lying to you
day 11: meetings that should be emails
day 12: overrated technologies of the last decade
```

**Week 3 — Educate and inform**

Deliver tangible value. Formats: `list-card`, `comparison`, `quote-card`. Audiences save and share practical content. Topics should be actionable, not abstract.

```
day 15: git commands you should actually memorize
day 16: how to write commit messages engineers respect
day 17: the debugging process that always works
day 18: security checks before every deployment
day 19: how to give feedback on code without being a jerk
```

**Week 4 — Build personal connection**

Humanize the account. Formats: `fake-text`, `relatable`, `roast`. Topics should acknowledge shared struggle or industry absurdity. This week typically drives the highest follower growth.

```
day 22: the interview question that tells you everything
day 23: deploying on a friday
day 24: onboarding to a codebase with no documentation
day 25: when the product manager says "just a small change"
day 26: the lifecycle of a production bug at 2am
```

---

### Niche Mode

Set the `niche` field in your config or pass `--niche` on the command line to tighten the model's output for a specific audience. The difference in output quality is significant.

Without niche:

```bash
viral generate "time management tips"
```

With niche:

```bash
viral generate "time management tips" --niche "founders running a team for the first time"
```

The niche string is injected directly into the system prompt. Be specific. `"software engineers"` is less effective than `"mid-level engineers at large tech companies dealing with slow promotion cycles"`.

---

### A/B Testing Tips

`variationsPerFormat` is your primary A/B lever. Set it to `4` or higher, then use the preview gallery to pick the strongest variation before scheduling.

**What to test:**

- **Opening line length** — Short declarative vs. longer setup
- **Tone** — Dry and factual vs. lightly sarcastic
- **Specificity** — Concrete numbers vs. relative comparisons
- **Question vs. statement** — Ending with a question increases comment rate

**Workflow:**

1. Generate with `variationsPerFormat: 6`
2. Run `viral preview` to review all variations in the browser gallery
3. Manually pick the strongest 1-2 per format
4. Schedule those; discard the rest

Track which formats consistently produce your top-performing posts per platform. After four weeks, disable underperforming formats in your config and allocate more variations to what works.

**Platform-specific notes:**

- Instagram responds best to `relatable`, `fake-text`, and `list-card`
- LinkedIn responds best to `hot-take`, `comparison`, and `list-card`
- Twitter/X responds best to `fake-tweet`, `roast`, and `hot-take`
- Pinterest responds best to `list-card`, `quote-card`, and `warm` or `light-clean` themes

---

## Stack

| Component | Library / Tool |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| CLI framework | Commander.js |
| LLM backend | Ollama with llama3.2 |
| Browser rendering | Playwright (Chromium) |
| Image processing | Sharp |
| Config loading + validation | cosmiconfig + Zod |
| Template engine | Handlebars |
| Terminal output | chalk + ora |

**Why local-first?**

Every part of the pipeline runs on your machine. Ollama handles text generation without an OpenAI key. Playwright renders HTML templates to PNG without a headless browser service. Sharp handles post-processing without a cloud image API. The result is zero ongoing cost and no vendor dependency.

---

## License

MIT — see [LICENSE](./LICENSE) for full text.

Copyright (c) 2026 [SergiuPogor](https://github.com/SergiuPogor/viral-content-engine)
