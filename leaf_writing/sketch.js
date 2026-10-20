// Leaf typewriter: every letter key places a different leaf PNG.
// Put your 26 cutouts in /assets named A.png ... Z.png

const LEAF_SIZE = 80;          // height of a leaf in pixels
const MARGIN = 60;
const ADVANCE = LEAF_SIZE * 0.75;   // horizontal space a leaf takes
const SPACE_ADVANCE = LEAF_SIZE * 0.5;
const LINE_HEIGHT = LEAF_SIZE * 1.0;
const SYMBOL_SIZE = LEAF_SIZE * 0.7;   // size of typed symbols (Times New Roman)
const GROW_MS = 450;
const FALL_MS = 700;

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let leafImages = {};   // 'A' -> p5.Image (or null if missing)
let items = [];        // everything typed: leaves, spaces, newlines
let dying = [];        // leaves that were erased and are falling away

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
      () => { leafImages[L] = null; }   // missing file -> placeholder
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}

function keyPressed(event) {
  // let browser shortcuts (Ctrl/Cmd+R, etc.) through. AltGr counts as ctrl+alt, so allow that.
  if (event && (event.ctrlKey || event.metaKey) && !event.altKey) return;

  initAudio();

  if (keyCode === BACKSPACE) {
    playRustle(0.6, 0.2);
    eraseLast();
    return false;
  }
  if (keyCode === ENTER || keyCode === RETURN) {
    playRustle(0.7, 0.5);
    items.push({ type: 'newline' });
    layout();
    return false;
  }
  if (key === ' ') {
    playRustle(0.5, 0.5);
    items.push({ type: 'space' });
    layout();
    return false;
  }
  if (keyCode >= 65 && keyCode <= 90) {
    const letter = String.fromCharCode(keyCode);
    playRustle(random(0.85, 1.15), (keyCode - 65) / 25);   // each letter sounds a little different
    items.push({
      type: 'leaf',
      letter,
      rot: random(-0.5, 0.5),        // each placement is tilted differently
      scl: random(0.85, 1.15),
      yOff: random(-8, 8),
      seed: random(1000),
      born: millis(),
      x: 0, y: 0,
    });
    layout();
    return false;
  }
  // any other single printable character (. , ! @ # $ ? ä ö ...) -> still Times New Roman
  if (key && key.length === 1) {
    playRustle(0.6, 0.7);
    items.push({ type: 'symbol', char: key, x: 0, y: 0 });
    layout();
    return false;
  }
}

function eraseLast() {
  const it = items.pop();
  if (it && it.type === 'leaf') {
    it.died = millis();
    it.driftX = random(-40, 40);
    dying.push(it);
  }
  layout();
}

// Recalculate every item's position (handles wrapping, backspace, resizing)
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
}

function draw() {
  background(250, 248, 242);
  const now = millis();

  for (const it of items) {
    if (it.type === 'symbol') {
      // static: no animation, no rotation
      push();
      noStroke();
      fill(30);
      textFont('Times New Roman');
      textSize(SYMBOL_SIZE);
      textAlign(CENTER, BASELINE);
      text(it.char, it.x, it.y + SYMBOL_SIZE * 0.35);
      pop();
      continue;
    }
    if (it.type !== 'leaf') continue;
    const t = constrain((now - it.born) / GROW_MS, 0, 1);
    const grow = 1 - pow(1 - t, 3);                    // ease out
    const sway = sin(now / 1200 + it.seed) * 0.04;    // gentle breeze
    drawLeaf(it, it.x, it.y + it.yOff, it.rot + sway, it.scl * grow, 255);
  }

  for (let i = dying.length - 1; i >= 0; i--) {
    const it = dying[i];
    const t = (now - it.died) / FALL_MS;
    if (t >= 1) { dying.splice(i, 1); continue; }
    const e = t * t;
    drawLeaf(
      it,
      it.x + it.driftX * e,
      it.y + it.yOff + e * 220,
      it.rot + e * 2.5,
      it.scl,
      255 * (1 - t)
    );
  }

  if (items.length === 0 && dying.length === 0) {
    fill(150);
    noStroke();
    textSize(18);
    text('type something', width / 2, height / 2);
  }
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
    fill(90, 140, 70, alpha);
    ellipse(0, 0, LEAF_SIZE * 0.5 * scl, LEAF_SIZE * scl);
    fill(255, alpha);
    textSize(16 * scl);
    text(it.letter, 0, 0);
  }
  pop();
}
