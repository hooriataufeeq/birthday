# Happy Birthday, Uzair 🐱💗

A premium interactive birthday website — soft pink glassmorphism, kitten friendship theme, "Meaoo Meaoo" throughout.

## How to open it

Just double-click **index.html** to open it in any browser (Chrome/Safari/Edge). No installation needed. For the smoothest experience, use a real web server instead of the file:// protocol — e.g. in a terminal in this folder run:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000` in your browser. (This avoids any browser restrictions on loading local images/fonts.)

## Add music (optional, recommended)

The site is fully built to play background music and a soft click sound, but audio files aren't included (to respect copyright — no licensed music is bundled). To add your own:

1. Find a royalty-free birthday/ambient track (e.g. Pixabay Music, YouTube Audio Library, or your own recording).
2. Save it as `assets/music/birthday-music.mp3`.
3. Optional: add a short soft "pop"/click sound as `assets/music/click.mp3`.

The site works perfectly fine without these — it just plays silently — but adding them makes the "Music starts" moment on the final page really land.

## What's inside

- `index.html` — all 10 pages/sections (loading → welcome → gift → reveal → kittens → letter → prayer → reasons → meaoo → gallery → final celebration)
- `style.css` — the full soft pink / rose gold / lavender glassmorphism theme
- `script.js` — all interactions: gift box opening, confetti, fireworks, typewriter letter, tap-through prayers, flip cards, kitten meaoo taps, auto-sliding gallery, cursor sparkle trail, floating hearts/petals/paws
- `assets/images/uzair_portrait.jpg` — the cropped, enhanced circular portrait used throughout
- `assets/music/` — drop your own `birthday-music.mp3` and `click.mp3` here

## Notes

- Fully responsive — tested down to small mobile widths.
- Uses GSAP, canvas-confetti, Typed.js, and emoji (no external image dependencies besides Uzair's photo), loaded from CDN — so an internet connection is needed the first time it opens.
- Tap the mute icon (top right, appears once music starts) to mute/unmute.
- The **Replay** button on the final page resets the letter, gift box, prayers, and kitten taps so the whole journey can be experienced again.
