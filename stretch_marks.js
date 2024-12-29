let H, x, y;
let pt = 10;
let stringToLetter;


function preload() {
  A = a = loadImage("times/A.png");
  B = b = loadImage("times/B.png");
  C = c = loadImage("times/C.png");
  D = d = loadImage("times/D.png");
  E = e = loadImage("times/E.png");
  F = f = loadImage("times/F.png");
  G = g = loadImage("times/G.png");
  H = h = loadImage("times/H.png");
  I = i = loadImage("times/I.png");
  J = j = loadImage("times/J.png");
  K = k = loadImage("times/K.png");
  L = l = loadImage("times/L.png");
  M = m = loadImage("times/M.png");
  N = n = loadImage("times/N.png");
  O = o = loadImage("times/O.png");
  P = p = loadImage("times/P.png");
  Q = q = loadImage("times/Q.png");
  R = r = loadImage("times/R.png");
  S = s = loadImage("times/S.png");
  T = t = loadImage("times/T.png");
  U = u = loadImage("times/U.png");
  V = v = loadImage("times/V.png");
  W = w = loadImage("times/W.png");
  X = x = loadImage("times/X.png");
  Y = y = loadImage("times/Y.png");
  Z = z = loadImage("times/Z.png");
  dot   = loadImage("times/a_period.png");
  hyphen  = loadImage("times/a_dash.png");
  exclm = loadImage("times/a_exclamation.png");
  comma = loadImage("times/a_comma.png");
  question = loadImage("times/a_question.png");
  underscore = loadImage("times/a_underscore.png");
  colon = loadImage("times/a_colon.png");
  
  stringToLetter = {
    'a': A, 'A': A,
    'b': B, 'B': B,
    'c': C, 'C': C,
    'd': D, 'D': D,
    'e': E, 'E': E,
    'f': F, 'F': F,
    'g': G, 'G': G,
    'h': H, 'H': H,
    'i': I, 'I': I,
    'j': J, 'J': J,
    'k': K, 'K': K,
    'l': L, 'L': L,
    'm': M, 'M': M,
    'n': N, 'N': N,
    'o': O, 'O': O,
    'p': P, 'P': P,
    'q': Q, 'Q': Q,
    'r': R, 'R': R,
    's': S, 'S': S,
    't': T, 'T': T,
    'u': U, 'U': U,
    'v': V, 'V': V,
    'w': W, 'W': W,
    'x': X, 'X': X,
    'y': Y, 'Y': Y,
    'z': Z, 'Z': Z,
    '.': dot,
    ',': comma,
    '-': hyphen,
    '?': question,
    '!': exclm,
    '_': underscore,
    ':': colon
  }
}

function setup() {
  var myCanvas = createCanvas(800, 600);
  myCanvas.parent("container");
  background('#fdfff0');
}

function draw() {
  // add some margin
  translate(10, 30);
}

var output = ""
var pressed = {};

window.onkeydown = function(e) {
  if ( pressed[e.which] ) return;
  pressed[e.which] = e.timeStamp;
  // console.log(e)
};
    
window.onkeyup = function(e) {
  if ( !pressed[e.which] ) return;
  var duration = ( e.timeStamp - pressed[e.which] ) * 0.3;
  stretchType(duration, e.key, e.which)
    pressed[e.which] = 0;
};

function stretchType(duration, keyString, which) {
  letter = stringToLetter[keyString]
  // add space
  if(keyString == ' ') {
    pt+= 25;
    return;
  // ignore unknown letters
  } else if (letter == null) {
    return;
  }
  pt += (duration);
  getCoordinates(pt, duration);

  letter.resize(duration, 50);
  image(letter, x, y);  
}


// let's start a new line when the letters go out of the borders
function getCoordinates(pt, duration) {
  x = (pt%750) - (duration / 2)
  y = floor(pt/750) * 50 
}

