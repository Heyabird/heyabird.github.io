// Leaflets: every key places a leaf. Two ways of seeing the same writing:
//   'text' - the leaves line up like a line of text
//   'map'  - the leaves gather where they come from (Puebla lower left, Espoo upper right)
// Leaf PNGs live in /assets named A.png ... Z.png

const LEAF_SIZE = 80;                 // height of a leaf in pixels
const MARGIN = 60;
const ADVANCE = LEAF_SIZE * 0.75;     // text mode: horizontal space a leaf takes
const SPACE_ADVANCE = LEAF_SIZE * 0.5;
const LINE_HEIGHT = LEAF_SIZE * 1.0;
const SYMBOL_SIZE = LEAF_SIZE * 0.7;  // size of typed symbols (Times New Roman)
const GROW_MS = 450;
const FALL_MS = 700;
const SPREAD = 110;                   // map mode: how far leaves scatter around their city (pixels)
const GLIDE = 0.14;                   // how quickly leaves glide between layouts (0 to 1 per frame)
const SHOW_LABELS = true;             // map mode: small place names in the corners
const BG = 255;                       // background (255 = white)

// The visible slice of the world map (degrees)
const MAP = { lonMin: -135, lonMax: 60, latMin: 8, latMax: 72 };

const PLACES = {
  mexico:  { name: 'Puebla, Mexico', lon: -98.2, lat: 19.04, letters: 'QWERTASDFZXCV' },
  finland: { name: 'Espoo, Finland', lon: 24.66, lat: 60.2,  letters: 'YUIOPGHJKLBNM' },
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let leafImages = {};   // 'A' -> p5.Image (or null if missing)
let originOf = {};     // 'Q' -> 'mexico'
let items = [];        // everything typed: leaves, symbols, spaces, newlines
let dying = [];        // leaves that were erased and are falling away

let mode = 'text';     // 'text' or 'map'
let viewBlend = 1;     // 1 = text view, 0 = map view (eases when you switch)

// Switch between the two layouts (called by the toggle buttons in index.html)
window.setMode = function (m) {
  if (m === 'text' || m === 'map') mode = m;
};

// Scrolling (text mode only) switches on once the writing is taller than the window
let scrollTarget = 0;  // where the page wants to be (pixels from the top)
let scrollShown = 0;   // what is drawn right now (eases toward the target)
let maxScroll = 0;     // 0 while everything still fits on one screen
let followEnd = false; // after typing, jump to the newest line

// ---------- Leaf rustle sound (synthesized, no audio files needed) ----------
const SOUND_ON = true;
const VOLUME = 0.5;          // 0 to 1
let audioCtx = null;
let noiseBuffer = null;

// Browsers only allow audio after a key press or click, so this runs on the first key press
function initAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  // one second of white noise, reused by every rustle
  const len = audioCtx.sampleRate;
  noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
}

// A dry-leaf crunch: a soft swish plus a burst of tiny crackles.
// strength: loudness multiplier. tone: 0 (duller) to 1 (brighter).
function playRustle(strength = 1, tone = 0.5) {
  if (!SOUND_ON || !audioCtx || !noiseBuffer) return;
  const t0 = audioCtx.currentTime;

  const master = audioCtx.createGain();
  master.gain.value = VOLUME * strength;
  master.connect(audioCtx.destination);

  // soft swish underneath
  const swish = audioCtx.createBufferSource();
  swish.buffer = noiseBuffer;
  const swishFilter = audioCtx.createBiquadFilter();
  swishFilter.type = 'bandpass';
  swishFilter.frequency.value = 1200 + tone * 1200;
  swishFilter.Q.value = 0.7;
  const swishGain = audioCtx.createGain();
  swishGain.gain.setValueAtTime(0.0001, t0);
  swishGain.gain.linearRampToValueAtTime(0.18, t0 + 0.04);
  swishGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
  swish.connect(swishFilter);
  swishFilter.connect(swishGain);
  swishGain.connect(master);
  swish.start(t0, Math.random() * 0.7, 0.25);

  // crackles: many very short filtered clicks at random moments
  const crackles = 7 + Math.floor(Math.random() * 8);
  for (let i = 0; i < crackles; i++) {
    const t = t0 + Math.random() * 0.2;
    const dur = 0.008 + Math.random() * 0.03;
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuffer;
    const f = audioCtx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = (2200 + tone * 1500) + Math.random() * 3500;
    f.Q.value = 1.2 + Math.random() * 2;
    const g = audioCtx.createGain();
    const amp = 0.25 + Math.random() * 0.6;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start(t, Math.random() * 0.8, dur + 0.01);
  }
}

// ---------- Setup ----------
function preload() {
  for (const L of LETTERS) {
    leafImages[L] = loadImage(
      `assets/${L}.png`,
      () => {},
      () => { leafImages[L] = null; }   // missing file -> placeholder
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (const key in PLACES) {
    for (const L of PLACES[key].letters) originOf[L] = key;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}

// ---------- Where things go ----------

// Map mode: where a place sits on the page right now
function anchorOf(placeKey) {
  if (!placeKey) return { x: width / 2, y: height / 2 };
  const p = PLACES[placeKey];
  return {
    x: ((p.lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * width,
    y: ((MAP.latMax - p.lat) / (MAP.latMax - MAP.latMin)) * height,
  };
}

function mapPosOf(it) {
  const a = anchorOf(it.place);
  return {
    x: constrain(a.x + it.ox, MARGIN, width - MARGIN),
    y: constrain(a.y + it.oy, MARGIN, height - MARGIN),
  };
}

// Where an item wants to be in the current mode
function targetOf(it) {
  if (mode === 'map') {
    const p = mapPosOf(it);
    return { x: p.x, y: p.y, r: it.rotMap };
  }
  return { x: it.x, y: it.y + it.yOff, r: it.rotText };
}

// A brand new item starts at its target instead of gliding in from the corner
function snapToTarget(it) {
  const t = targetOf(it);
  it.cx = t.x;
  it.cy = t.y;
  it.cr = t.r;
}

function lastLeafPlace() {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].type === 'leaf') return items[i].place;
  }
  return null;
}

// ---------- Typing ----------
function keyPressed(event) {
  // let browser shortcuts (Ctrl/Cmd+R, etc.) through. AltGr counts as ctrl+alt, so allow that.
  if (event && (event.ctrlKey || event.metaKey) && !event.altKey) return;
  if (window.infoOpen) return;   // the About panel is open: don't type behind it

  initAudio();
  followEnd = true;   // typing brings the newest line into view (only matters once the page is full)

  if (keyCode === BACKSPACE) {
    playRustle(0.6, 0.2);
    eraseLast();
    return false;
  }
  if (keyCode === ENTER || keyCode === RETURN) {
    if (mode === 'text') {   // the map has no lines
      playRustle(0.7, 0.5);
      items.push({ type: 'newline' });
      layout();
    }
    return false;
  }
  if (key === ' ') {
    if (mode === 'text') {
      playRustle(0.5, 0.5);
      items.push({ type: 'space' });
      layout();
    }
    return false;
  }
  if (keyCode >= 65 && keyCode <= 90) {
    const letter = String.fromCharCode(keyCode);
    if (mode === 'map') {
      // Finland's leaves crunch a bit brighter, Mexico's a bit softer
      playRustle(random(0.85, 1.15), (originOf[letter] === 'finland' ? 0.55 : 0.1) + random(0, 0.35));
    } else {
      playRustle(random(0.85, 1.15), (keyCode - 65) / 25);   // each letter sounds a little different
    }
    const it = {
      type: 'leaf',
      letter,
      place: originOf[letter],
      scl: random(0.85, 1.15),
      seed: random(1000),
      born: millis(),
      // text layout
      rotText: random(-0.5, 0.5),    // each placement is tilted differently
      yOff: random(-8, 8),
      x: 0, y: 0,
      // map layout
      rotMap: random(-PI, PI),
      ox: randomGaussian(0, SPREAD),
      oy: randomGaussian(0, SPREAD),
      cx: 0, cy: 0, cr: 0,
    };
    items.push(it);
    layout();
    snapToTarget(it);
    return false;
  }
  // any other single printable character (. , ! @ # $ ? ä ö ...) -> still Times New Roman.
  // In map mode it lands beside the most recent leaf.
  if (key && key.length === 1) {
    playRustle(0.6, 0.7);
    const it = {
      type: 'symbol',
      char: key,
      place: lastLeafPlace(),
      yOff: 0,
      rotText: 0, rotMap: 0,
      x: 0, y: 0,
      ox: randomGaussian(0, SPREAD),
      oy: randomGaussian(0, SPREAD),
      cx: 0, cy: 0, cr: 0,
    };
    items.push(it);
    layout();
    snapToTarget(it);
    return false;
  }
}

function eraseLast() {
  let idx = items.length - 1;
  if (mode === 'map') {
    // spaces and line breaks are invisible on the map, so skip past them to the last leaf or symbol
    while (idx >= 0 && items[idx].type !== 'leaf' && items[idx].type !== 'symbol') idx--;
  }
  if (idx < 0) return;
  const it = items.splice(idx, 1)[0];
  if (it.type === 'leaf') {
    it.fx = it.cx;
    it.fy = it.cy;
    it.died = millis();
    it.driftX = random(-40, 40);
    dying.push(it);
  }
  layout();
}

// ---------- Text layout (also works out how far the page can scroll) ----------
function layout() {
  textFont('Times New Roman');
  textSize(SYMBOL_SIZE);
  let x = MARGIN;
  let y = MARGIN + LEAF_SIZE / 2;
  for (const it of items) {
    if (it.type === 'newline') {
      x = MARGIN;
      y += LINE_HEIGHT;
      continue;
    }
    let adv = ADVANCE;
    if (it.type === 'space') adv = SPACE_ADVANCE;
    if (it.type === 'symbol') {
      adv = max(textWidth(it.char), SYMBOL_SIZE * 0.3) + SYMBOL_SIZE * 0.15;
    }
    if (x + adv > width - MARGIN) {
      x = MARGIN;
      y += LINE_HEIGHT;
    }
    if (it.type === 'leaf' || it.type === 'symbol') {
      it.x = x + adv / 2;
      it.y = y;
    }
    x += adv;
  }

  // How far can the page scroll? Only as far as the writing runs past the bottom of the window.
  const contentBottom = y + LEAF_SIZE / 2 + MARGIN;
  maxScroll = max(0, contentBottom - height);
  if (followEnd) {
    scrollTarget = maxScroll;
    followEnd = false;
  }
  scrollTarget = constrain(scrollTarget, 0, maxScroll);
  scrollShown = constrain(scrollShown, 0, maxScroll);
}

// Mouse wheel / trackpad scrolls, but only in text mode and only when the page is full
function mouseWheel(event) {
  if (window.infoOpen) return;   // let the About panel scroll normally
  if (mode === 'text' && maxScroll > 0) {
    scrollTarget = constrain(scrollTarget + event.delta, 0, maxScroll);
  }
  return false;   // never scroll the browser page itself
}

// ---------- Drawing ----------
function draw() {
  background(BG);
  const now = millis();

  // ease between the two views and through the scroll
  viewBlend += ((mode === 'text' ? 1 : 0) - viewBlend) * 0.15;
  if (abs((mode === 'text' ? 1 : 0) - viewBlend) < 0.005) viewBlend = mode === 'text' ? 1 : 0;
  scrollShown += (scrollTarget - scrollShown) * 0.2;   // smooth scrolling
  if (abs(scrollTarget - scrollShown) < 0.5) scrollShown = scrollTarget;

  if (SHOW_LABELS) drawLabels(70 * (1 - viewBlend));

  push();
  translate(0, -scrollShown * viewBlend);

  for (const it of items) {
    if (it.type !== 'leaf' && it.type !== 'symbol') continue;

    // glide toward where this item belongs in the current layout
    const tg = targetOf(it);
    it.cx += (tg.x - it.cx) * GLIDE;
    it.cy += (tg.y - it.cy) * GLIDE;
    it.cr += (tg.r - it.cr) * GLIDE;

    if (it.type === 'symbol') {
      // static: no animation, no rotation
      push();
      noStroke();
      fill(30);
      textFont('Times New Roman');
      textSize(SYMBOL_SIZE);
      textAlign(CENTER, CENTER);
      text(it.char, it.cx, it.cy);
      pop();
      continue;
    }
    const t = constrain((now - it.born) / GROW_MS, 0, 1);
    const grow = 1 - pow(1 - t, 3);                    // ease out
    const sway = sin(now / 1200 + it.seed) * 0.04;    // gentle breeze
    drawLeaf(it, it.cx, it.cy, it.cr + sway, it.scl * grow, 255);
  }

  for (let i = dying.length - 1; i >= 0; i--) {
    const it = dying[i];
    const t = (now - it.died) / FALL_MS;
    if (t >= 1) { dying.splice(i, 1); continue; }
    const e = t * t;
    drawLeaf(
      it,
      it.fx + it.driftX * e,
      it.fy + e * 220,
      it.cr + e * 2.5,
      it.scl,
      255 * (1 - t)
    );
  }
  pop();   // end of the scrolling layer

  // slim scroll indicator, only visible when there is something to scroll
  if (maxScroll > 0 && viewBlend > 0.01) {
    const barH = max(30, height * height / (height + maxScroll));
    const barY = (scrollShown / maxScroll) * (height - barH);
    noStroke();
    fill(0, 0, 0, 40 * viewBlend);
    rect(width - 8, barY, 4, barH, 2);
  }

  if (items.length === 0 && dying.length === 0) {
    push();
    fill(150);
    noStroke();
    textFont('Times New Roman');
    textAlign(CENTER, CENTER);
    textSize(18);
    text('type something', width / 2, height / 2);
    pop();
  }
}

function drawLabels(alpha) {
  if (alpha < 1) return;
  push();
  noStroke();
  fill(0, 0, 0, alpha);
  textFont('Times New Roman');
  textSize(15);
  textAlign(LEFT, BOTTOM);
  text(PLACES.mexico.name, 24, height - 20);
  textAlign(RIGHT, TOP);
  text(PLACES.finland.name, width - 24, 20);
  pop();
}

function drawLeaf(it, x, y, rot, scl, alpha) {
  const img = leafImages[it.letter];
  push();
  translate(x, y);
  rotate(rot);
  imageMode(CENTER);
  if (img) {
    tint(255, alpha);
    const h = LEAF_SIZE * scl;
    const w = h * (img.width / img.height);
    image(img, 0, 0, w, h);
  } else {
    // placeholder until the PNG exists (green for Puebla, blue-green for Espoo)
    noStroke();
    if (it.place === 'finland') fill(60, 110, 120, alpha);
    else fill(90, 140, 70, alpha);
    ellipse(0, 0, LEAF_SIZE * 0.5 * scl, LEAF_SIZE * scl);
    rotate(-rot);
    fill(255, alpha);
    textFont('Times New Roman');
    textAlign(CENTER, CENTER);
    textSize(16 * scl);
    text(it.letter, 0, 0);
  }
  pop();
}
