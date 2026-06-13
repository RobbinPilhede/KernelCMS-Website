# Demo videos

`demo.webm` and `walkthrough.webm` here are **generated** from an animated, on-brand
scene (`tools/demo-scene.html`) and recorded with a headless browser. The homepage hero
autoplays `demo.webm` (muted, looping); the "Watch the walkthrough" section plays
`walkthrough.webm` on click.

## Regenerate them
With the dev server running (`npx serve . -l 4321`):

```bash
node tools/record-demo.mjs        # re-records both .webm files from the scene
```

Edit the scene first if you want to change the story, copy, or timing:
`tools/demo-scene.html` (acts: AI-generated site → config → API + admin → edit → live).

## Replace with real screen recordings
Prefer real footage of the actual admin? Drop your own files in next to these:

| File | Where it appears | Suggested content |
| --- | --- | --- |
| `demo.mp4` / `demo.webm` | Hero (autoplay loop) | 60-90s: define content, see the admin, edit live. |
| `walkthrough.mp4` / `walkthrough.webm` | "Watch the walkthrough" | Longer: take a real/AI-generated site and give it a backend. |

The player lists `.webm` first, then `.mp4`, so either format works. Keep them lean
(1080p, a few MB). No build step: drop the files in and refresh.
