/* =========================================================
   Dreams in Play — pure vanilla JS. No frameworks, no build.
   ========================================================= */

/* ----- 1. SVG artwork for each piece type -----
   Minimalist outline pieces on a 48x48 grid.
   Swap these path strings for your own drawings any time. */
const PIECE_PATHS = {
  pawn: `
    <circle cx="24" cy="13" r="5.5" />
    <path d="M19 18 C 16 22, 15 26, 15 30 L 33 30 C 33 26, 32 22, 29 18 Z" />
    <path d="M15 30 L 33 30 L 35 35 L 13 35 Z" />
    <path d="M12 35 L 36 35 L 38 42 L 10 42 Z" />`,
  rook: `
    <path d="M13 7 L13 12 L17 12 L17 8.5 L21 8.5 L21 12 L27 12 L27 8.5 L31 8.5 L31 12 L35 12 L35 7 Z" />
    <path d="M15 12 L 33 12 L 31 16 L 17 16 Z" />
    <path d="M17 16 L 31 16 L 32 32 L 16 32 Z" />
    <path d="M15 32 L 33 32 L 35 36 L 13 36 Z" />
    <path d="M12 36 L 36 36 L 38 42 L 10 42 Z" />`,
  bishop: `
    <circle cx="24" cy="7" r="2.5" />
    <path d="M24 10 C 16 14, 16 24, 24 29 C 32 24, 32 14, 24 10 Z" />
    <path d="M21 15 L 27 21" />
    <path d="M17 29 L 31 29 L 32 33 L 16 33 Z" />
    <path d="M13 36 L 35 36 L 37 42 L 11 42 Z" />
    <path d="M16 33 L 32 33 L 34 36 L 14 36 Z" />`,
  knight: `
    <path d="M15 42 C 14 35, 19 33, 18 28 L 13 24 C 11 21, 12 18, 16 17 L 19 11 C 22 7, 29 7, 33 11 C 36 16, 35 24, 33 30 C 32 35, 32 38, 33 42 Z" />
    <circle cx="28" cy="14" r="1.4" />
    <path d="M19 16 C 22 17, 24 19, 24 22" />`,
  queen: `
    <circle cx="11" cy="9" r="2.2" />
    <circle cx="18" cy="6.5" r="2.2" />
    <circle cx="24" cy="5.5" r="2.2" />
    <circle cx="30" cy="6.5" r="2.2" />
    <circle cx="37" cy="9" r="2.2" />
    <path d="M11 11 L 16 27 M18 8.5 L 21 27 M24 7.5 L 24 27 M30 8.5 L 27 27 M37 11 L 32 27" />
    <path d="M16 27 L 32 27 L 33 32 L 15 32 Z" />
    <path d="M15 32 L 33 32 L 35 36 L 13 36 Z" />
    <path d="M12 36 L 36 36 L 38 42 L 10 42 Z" />`,
  king: `
    <path d="M24 4 L 24 11 M20.5 7 L 27.5 7" />
    <path d="M24 12 C 18 15, 17 22, 24 26 C 31 22, 30 15, 24 12 Z" />
    <path d="M17 26 L 31 26 L 32 31 L 16 31 Z" />
    <path d="M14 31 L 34 31 L 36 36 L 12 36 Z" />
    <path d="M12 36 L 36 36 L 38 42 L 10 42 Z" />`,
};

/* Build the <svg> markup for a piece.
   White pieces are paper-filled; black pieces are ink-filled. */
function pieceSvg(type, color) {
  const fill = color === "black" ? "var(--foreground)" : "var(--card)";
  return `
    <svg viewBox="0 0 48 48" fill="${fill}" stroke="var(--foreground)"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${PIECE_PATHS[type]}
    </svg>`;
}

/* ----- 2. Story data -----
   One dream per piece. Edit the title/story freely, and set "audio"
   to a file you place in an "audio" folder next to this page. */
const DREAM_SEEDS = [
  { title: "The Lighthouse That Walked", story: "The story begins in this Väärätalo. It starts with long stairs to the sky. And there is no limit to these stairs. At least it feels like it. The person who is in the story has to just go up these stairs." },
  { title: "A Staircase of Letters", story: "So you are walking up these long, long staircases, and you start to feel your feet are getting heavier and heavier. And your muscles are starting to become sore. Suddenly you fall through the stairs, and you are falling, falling, falling, falling to an absolute dark abyss. Suddenly you stop falling - you’re floating, and a cloud appears. And this cloud starts raining blood. And a cup appears in your hand, and you instinctively reach out to the cloud and start gathering the blood in the cup. And you drink and swallow, and something begins to happen to you." },
  { title: "The Quiet Orchard", story: "You drink from the cup, and once you have drunk from the cup, you realize that you are not the same person as before. Somehow, you’ve absorbed some part of the people whose blood was in the cloud originally. Instead of you being you, you are now someone who possesses a distant memory of who you used to be. And this new person that you are still kind of getting to know–or getting to grips with–starts to go around in this landscape and look for other people. And you feel alone." },
  { title: "Tide of Paper Boats", story: "A thousand small boats came in with the tide, each carrying a wish I had forgotten to make. I read them by moonlight and chose only one to keep." },
  { title: "The Room With No Corners", story: "I kept walking and the walls kept curving, and somewhere in that endless turning I stopped looking for the exit and simply lived there for a while." },
  { title: "Birds Made of Maps", story: "They unfolded as they flew, showing every place I had never been. One landed on my shoulder and refolded into the road home." },
  { title: "The Last Train Inland", story: "It ran on rails of rain. The conductor only asked for memories as fare, and the further we went, the lighter and stranger I became." },
  { title: "A Garden Under Glass", story: "Snow fell inside the dome but the flowers did not mind. They had agreed, long ago, to bloom for whoever was lonely enough to visit." },
  { title: "The Whispering Library", story: "Books read themselves aloud to anyone who sat still. I fell asleep between two shelves and woke knowing a language no one had ever spoken." },
  { title: "City of Folded Light", story: "At dusk the buildings creased like origami and tucked themselves away for the night. In the morning they unfolded, never quite the same shape twice." },
  { title: "The Well That Answered Back", story: "I dropped a question in and waited. The echo that returned was my own voice, older, telling me everything would be all right." },
  { title: "Where the Music Settles", story: "Sound fell like snow and gathered in drifts. I walked through a symphony up to my knees and came out humming a melody I will never be able to repeat." },
  { title: "The Borrowed Sky", story: "Someone had taken our sky and left a smaller one, close enough to touch. We passed it from rooftop to rooftop until everyone had held a piece of weather." },
  { title: "A Coat of Many Doors", story: "Each pocket opened onto a different room of my life. I kept reaching in, half hoping to find a door back to a person I missed." },
  { title: "The Slow Comet", story: "It crossed the sky over the length of a single afternoon, and the whole town came outside to grow old beneath it together, unhurried and unafraid." },
  { title: "Footprints Filling With Sea", story: "I walked the shore backwards, watching the water erase where I had been. By the end there was no proof I had come at all, only the calm of it." },
  { title: "The Mountain That Listened", story: "I told it the thing I had never told anyone. It did not move, but in the morning a new path had opened, leading gently down." },
  { title: "Lanterns for the Returning", story: "We hung lights for people who were lost, and one by one shapes came out of the dark, blinking, surprised to be expected." },
  { title: "The Clockmaker's Apology", story: "He gave me back the hour I had wasted, wrapped in cloth. Use it carefully, he said. They do not make this kind anymore." },
  { title: "An Ocean in the Attic", story: "Above the rafters the tide came and went. I rowed out among the old furniture and fished for the summers we had stored up there." },
  { title: "The Field of Open Windows", story: "They stood in the grass without houses, and through each one a different season was passing. I leaned through winter and felt spring on my face." },
  { title: "Where Shadows Rest", story: "At noon the shadows lay down and slept. We tiptoed past them, careful not to wake the darker, truer versions of ourselves." },
  { title: "The Bridge of Held Breath", story: "It only existed while you believed in it. Halfway across I forgot to doubt, and for one perfect moment stood on nothing at all." },
  { title: "A Choir of Empty Chairs", story: "They sang for everyone who could not come. The song was made of names, and somewhere in it I heard my own and felt forgiven." },
  { title: "The Map That Drew Itself", story: "It charted only the places I would love. I followed its ink across the dream and arrived, at last, somewhere that felt like being known." },
  { title: "Rain in Reverse", story: "The drops rose from the puddles to the clouds, and with them rose every sad thing I had let fall. The sky took it all back without complaint." },
  { title: "The House of Borrowed Time", story: "Every room ran a different hour. In the kitchen it was always the morning my grandmother was alive, so that is where I stayed." },
  { title: "Stars Kept in Jars", story: "An old woman sold them by the road. I bought the dimmest one because it looked the loneliest, and it lit my whole sleeping street." },
  { title: "The Patient Door", story: "It had waited years for me to try the handle. When I finally did, it only said: you could have come sooner, but I am glad you came." },
  { title: "A Sea of Sleeping Bells", story: "They rang once, softly, when the wind of the dream passed over them, and every sleeper for miles turned over and dreamed the same gentle thing." },
  { title: "The Color I Forgot", story: "It was not on any wheel I knew. I saw it in the dream and wept, because I understood I would never be able to bring it back with me." },
  { title: "Homecoming, Eventually", story: "The road kept lengthening, but I no longer minded. The walking had become the home, and the porch light ahead would wait as long as I needed." },
];

/* ----- 3. Build the 32 pieces with stable scattered positions ----- */

// Tiny seeded PRNG so the scatter looks random but is the same each load.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BACK_RANK = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

const TOTAL_PIECES = 32;

/* Place piece number `index` (0..31) along a gentle left-to-right
   "squiggly line" so the order is readable: the first dream sits at the
   top-left, the last at the bottom-right, with a couple of soft waves in
   between. A little seeded jitter keeps it feeling hand-scattered rather
   than mechanical. */
function pathPosition(index, rand) {
  const t = index / (TOTAL_PIECES - 1); // 0 -> 1 along the trail

  // Sweep gently from left to right.
  const x = 10 + t * 78;

  // Drift downward overall while waving up and down ~2.5 times.
  // Starts below the header so the first dreams don't sit under the title.
  const baseY = 30 + t * 50;
  const wave = Math.sin(t * Math.PI * 2.5) * 15;

  // Soft random jitter so the line breathes.
  const jitterX = (rand() - 0.5) * 6;
  const jitterY = (rand() - 0.5) * 6;

  return {
    x: Math.max(2, Math.min(92, x + jitterX)),
    y: Math.max(4, Math.min(90, baseY + wave + jitterY)),
  };
}

function buildPieces() {
  const rand = mulberry32(20260624);
  const pieces = [];
  let seedIndex = 0;

  for (const color of ["white", "black"]) {
    BACK_RANK.forEach((type, i) => {
      const seed = DREAM_SEEDS[seedIndex % DREAM_SEEDS.length];
      const pos = pathPosition(seedIndex, rand);
      pieces.push({
        id: `${color}-${type}-${i}`,
        type,
        color,
        x: pos.x,
        y: pos.y,
        title: seed.title,
        story: seed.story,
        audio: `audio/${i+1}.m4a`
        // audio: `audio/${color}-${type}-${i}.mp3`,
      });
      seedIndex++;
    });
    for (let i = 0; i < 8; i++) {
      const seed = DREAM_SEEDS[seedIndex % DREAM_SEEDS.length];
      const pos = pathPosition(seedIndex, rand);
      pieces.push({
        id: `${color}-pawn-${i}`,
        type: "pawn",
        color,
        x: pos.x,
        y: pos.y,
        title: seed.title,
        story: seed.story,
        audio: `audio/${color}-pawn-${i}.mp3`,
      });
      seedIndex++;
    }
  }
  return pieces;
}

const PIECES = buildPieces();

/* ----- 4. Render pieces onto the board ----- */

const board = document.getElementById("board");
const byId = {};

PIECES.forEach((piece) => {
  byId[piece.id] = piece;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "piece";
  btn.dataset.id = piece.id;
  btn.style.left = piece.x + "%";
  btn.style.top = piece.y + "%";
  btn.setAttribute("aria-label", `${piece.color} ${piece.type}: ${piece.title}`);
  btn.innerHTML = pieceSvg(piece.type, piece.color);
  board.appendChild(btn);
});

/* ----- 5. Drag + click handling -----
   A short press that doesn't move is a "click" (opens the story).
   Moving past a small threshold becomes a drag instead. */

const DRAG_THRESHOLD = 5; // px
let topZ = 10; // bring the most recently touched piece to the front
let drag = null;

board.addEventListener("pointerdown", (e) => {
  const btn = e.target.closest(".piece");
  if (!btn) return;
  e.preventDefault();
  btn.setPointerCapture(e.pointerId);

  const piece = byId[btn.dataset.id];
  topZ += 1;
  btn.style.zIndex = String(topZ);

  drag = {
    btn,
    id: piece.id,
    startX: piece.x,
    startY: piece.y,
    pointerStartX: e.clientX,
    pointerStartY: e.clientY,
    moved: false,
  };
});

board.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.pointerStartX;
  const dy = e.clientY - drag.pointerStartY;

  if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
    drag.moved = true;
    drag.btn.classList.add("is-active");
    drag.btn.style.zIndex = "50";
  }
  if (!drag.moved) return;

  const rect = board.getBoundingClientRect();
  const piece = byId[drag.id];
  piece.x = Math.max(0, Math.min(94, drag.startX + (dx / rect.width) * 100));
  piece.y = Math.max(0, Math.min(92, drag.startY + (dy / rect.height) * 100));
  drag.btn.style.left = piece.x + "%";
  drag.btn.style.top = piece.y + "%";
});

function endDrag(e) {
  if (!drag) return;
  const finished = drag;
  drag = null;
  finished.btn.classList.remove("is-active");
  try {
    finished.btn.releasePointerCapture(e.pointerId);
  } catch (_) {
    /* ignore */
  }
  // No movement => treat as a tap and open the story.
  if (!finished.moved) {
    openStory(byId[finished.id]);
  }
}

board.addEventListener("pointerup", endDrag);
board.addEventListener("pointercancel", endDrag);

/* ----- 6. Side panel ----- */

const panel = document.getElementById("panel");
const panelIcon = document.getElementById("panel-icon");
const panelKind = document.getElementById("panel-kind");
const panelTitle = document.getElementById("panel-title");
const panelStory = document.getElementById("panel-story");
const panelAudio = document.getElementById("panel-audio");
const panelClose = document.getElementById("panel-close");

function openStory(piece) {
  panelIcon.innerHTML = pieceSvg(piece.type, piece.color);
  panelKind.textContent = `${piece.color} ${piece.type}`;
  panelTitle.textContent = piece.title;
  panelStory.textContent = piece.story;
  panelAudio.src = piece.audio;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
}

function closeStory() {
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  panelAudio.pause();
}

panelClose.addEventListener("click", closeStory);

// Escape closes the panel for an easy return to the full board.
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStory();
});
