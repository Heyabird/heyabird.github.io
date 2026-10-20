// Leaf map: leaves land on the page where they come from.
// Puebla, Mexico leaves collect lower left. Espoo, Finland leaves collect upper right.
// Positions use real latitude/longitude, cropped to a window around the two places.
// Leaf PNGs live in /assets named A.png ... Z.png

const LEAF_SIZE = 80;
const SYMBOL_SIZE = LEAF_SIZE * 0.7;
const MARGIN = 60;
const GROW_MS = 450;
const FALL_MS = 700;
const SPREAD = 110;        // how far leaves scatter around their city (pixels)
const SHOW_LABELS = true;  // small place names in the corners

// The visible slice of the world map (degrees)
const MAP = { lonMin: -135, lonMax: 60, latMin: 8, latMax: 72 };

const PLACES = {
  mexico:  { name: 'Puebla, Mexico', lon: -98.2, lat: 19.04, letters: 'QWERTASDFZXCV' },
  finland: { name: 'Espoo, Finland', lon: 24.66, lat: 60.2,  letters: 'YUIOPGHJKLBNM' },
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let leafImages = {};
let originOf = {};   // 'Q' -> 'mexico'
let items = [];
let dying = [];

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

function preload() {
  for (const L of LETTERS) {
    leafImages[L] = loadImage(
      `assets/${L}.png`,
      () => {},
      () => { leafImages[L] = null; }
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
}

// Where a place sits on the page right now
function anchorOf(placeKey) {
  if (!placeKey) return { x: width / 2, y: height / 2 };
  const p = PLACES[placeKey];
  return {
    x: ((p.lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * width,
    y: ((MAP.latMax - p.lat) / (MAP.latMax - MAP.latMin)) * height,
  };
}

function posOf(it) {
  const a = anchorOf(it.place);
  return {
    x: constrain(a.x + it.ox, MARGIN, width - MARGIN),
    y: constrain(a.y + it.oy, MARGIN, height - MARGIN),
  };
}

function lastLeafPlace() {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].type === 'leaf') return items[i].place;
  }
  return null;
}

function keyPressed(event) {
  // let browser shortcuts through (AltGr counts as ctrl+alt, so allow that)
  if (event && (event.ctrlKey || event.metaKey) && !event.altKey) return;

  initAudio();

  if (keyCode === BACKSPACE) {
    playRustle(0.6, 0.2);
    eraseLast();
    return false;
  }
  if (key === ' ' || keyCode === ENTER || keyCode === RETURN) {
    return false;   // no text line in this version
  }
  if (keyCode >= 65 && keyCode <= 90) {
    const letter = String.fromCharCode(keyCode);
    // Finland's leaves crunch a bit brighter, Mexico's a bit softer
    playRustle(random(0.85, 1.15), (originOf[letter] === 'finland' ? 0.55 : 0.1) + random(0, 0.35));
    items.push({
      type: 'leaf',
      letter,
      place: originOf[letter],
      ox: randomGaussian(0, SPREAD),
      oy: randomGaussian(0, SPREAD),
      rot: random(-PI, PI),
      scl: random(0.85, 1.15),
      seed: random(1000),
      born: millis(),
    });
    return false;
  }
  // symbols land beside the most recent leaf, in plain Times New Roman, and stay still
  if (key && key.length === 1) {
    playRustle(0.6, 0.7);
    items.push({
      type: 'symbol',
      char: key,
      place: lastLeafPlace(),
      ox: randomGaussian(0, SPREAD),
      oy: randomGaussian(0, SPREAD),
    });
    return false;
  }
}

function eraseLast() {
  const it = items.pop();
  if (it && it.type === 'leaf') {
    const p = posOf(it);
    it.fx = p.x;
    it.fy = p.y;
    it.died = millis();
    it.driftX = random(-40, 40);
    dying.push(it);
  }
}

function draw() {
  background(250, 248, 242);
  const now = millis();

  if (SHOW_LABELS) drawLabels();

  for (const it of items) {
    const p = posOf(it);
    if (it.type === 'symbol') {
      push();
      noStroke();
      fill(30);
      textFont('Times New Roman');
      textSize(SYMBOL_SIZE);
      textAlign(CENTER, CENTER);
      text(it.char, p.x, p.y);
      pop();
      continue;
    }
    const t = constrain((now - it.born) / GROW_MS, 0, 1);
    const grow = 1 - pow(1 - t, 3);
    const sway = sin(now / 1200 + it.seed) * 0.04;
    drawLeaf(it, p.x, p.y, it.rot + sway, it.scl * grow, 255);
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
      it.rot + e * 2.5,
      it.scl,
      255 * (1 - t)
    );
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

function drawLabels() {
  push();
  noStroke();
  fill(0, 0, 0, 70);
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
    // placeholder until the PNG exists
    noStroke();
    if (it.place === 'mexico') fill(90, 140, 70, alpha);
    else fill(60, 110, 120, alpha);
    ellipse(0, 0, LEAF_SIZE * 0.5 * scl, LEAF_SIZE * scl);
    rotate(-rot);
    fill(255, alpha);
    textAlign(CENTER, CENTER);
    textSize(16 * scl);
    text(it.letter, 0, 0);
  }
  pop();
}
