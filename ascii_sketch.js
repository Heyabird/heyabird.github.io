// ASCII art code was based on coding train's video tutorial: 

let handpose;
let video;
let predictions = [];
let leaf;
let held = false;
var leafStep1, smallSplash, bigSplash, meow, hat, crash, clap;
let keyC, keyCs, keyD, keyDs, keyE, keyF, keyFs, keyG, keyGs, keyA, keyAs, keyB;
// const density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
const density = "      .:░▒▓█"
let asciiDiv;
let state = 0;
let x0, x1, y0, y1;
let videoState = 0;

//☘︎

function preload() {
  smallSplash = loadSound('ascii_assets/small_splash.mp3');
  bigSplash = loadSound('ascii_assets/big_splash.mp3');
  meow = loadSound('ascii_assets/meow.mp3');
  moo = loadSound('ascii_assets/moo.mp3');
  hat = loadSound('ascii_assets/hat.wav');
  clap = loadSound('ascii_assets/clap.wav');
  crash = loadSound('ascii_assets/crash.wav');
  scratch = loadSound('ascii_assets/scratch.mp3');
  beeps = loadSound('ascii_assets/beeps.mp3');
  click = loadSound('ascii_assets/click.mp3');
  keyboard0 = loadSound('ascii_assets/keyboard.mp3');
  keyboard1 = loadSound('ascii_assets/keyboard1.mp3');
  keyboard2 = loadSound('ascii_assets/keyboard2.mp3');
  keyboard3 = loadSound('ascii_assets/keyboard3.mp3');
  keyboard4 = loadSound('ascii_assets/keyboard4.mp3');
  keyboard5 = loadSound('ascii_assets/keyboard5.mp3');
  casetteInsert = loadSound('ascii_assets/casette-insert.mp3');
  jump = loadSound('ascii_assets/jump.mp3');
  // retro
  melody8bit1 = loadSound('ascii_assets/retro/8bit_melody1.mp3');
  melody8bit2 = loadSound('ascii_assets/retro/8bit_melody2.mp3');
  oldRing = loadSound('ascii_assets/retro/old_phone_ring.mp3');
  windowsError = loadSound('ascii_assets/retro/windows_error.mp3');
  coin = loadSound('ascii_assets/retro/coin.mp3');

  // present
  iphoneType1 = loadSound('ascii_assets/present/iphone_type1.mp3');
  iphoneType2 = loadSound('ascii_assets/present/iphone_type2.mp3');
  iphoneType3 = loadSound('ascii_assets/present/iphone_type3.mp3');
  iphoneType4 = loadSound('ascii_assets/present/iphone_type4.mp3');
  iphoneVibrate = loadSound('ascii_assets/present/iphone_vibrating.mp3');

  // future
  futureLogo1 = loadSound('ascii_assets/future/crystal-logo.mp3');
  deepScan = loadSound('ascii_assets/future/deep_scan.mp3');
  plasmaGun1 = loadSound('ascii_assets/future/plasma_gun1.mp3');
  plasmaGun2 = loadSound('ascii_assets/future/plasma_gun2.mp3');
  rocketLaunch = loadSound('ascii_assets/future/rocket_launch.mp3');
  skyMelody = loadSound('ascii_assets/future/sky_melody.mp3');
  logoCorporate = loadSound('ascii_assets/future/logo_corporate.mp3');

  dead8bit = loadSound('ascii_assets/dead_8bit.mp3');
  swoosh1 = loadSound('ascii_assets/swoosh1.mp3');
  swoosh2 = loadSound('ascii_assets/swoosh2.mp3');
  swoosh3 = loadSound('ascii_assets/swoosh3.mp3');
  // keys
  keyC = loadSound('ascii_assets/keys/C.mp3');
  keyCs = loadSound('ascii_assets/keys/Csh.mp3');
  keyD = loadSound('ascii_assets/keys/D.mp3');
  keyDs = loadSound('ascii_assets/keys/Dsh.mp3');
  keyE = loadSound('ascii_assets/keys/E.mp3');
  keyF = loadSound('ascii_assets/keys/F.mp3');
  keyFs = loadSound('ascii_assets/keys/Fsh.mp3');
  keyG = loadSound('ascii_assets/keys/G.mp3');
  keyGs = loadSound('ascii_assets/keys/Gsh.mp3');
  keyA = loadSound('ascii_assets/keys/A.mp3');
  keyAs = loadSound('ascii_assets/keys/Ash.mp3');
  keyB = loadSound('ascii_assets/keys/B.mp3');
  keyC2 = loadSound('ascii_assets/keys/C2nd.mp3');
  // chimes
  chimeC = loadSound('ascii_assets/chimes/C.mp3');
  chimeCs = loadSound('ascii_assets/chimes/Csh.mp3');
  chimeD = loadSound('ascii_assets/chimes/D.mp3');
  chimeDs = loadSound('ascii_assets/chimes/Dsh.mp3');
  chimeE = loadSound('ascii_assets/chimes/E.mp3');
  chimeF = loadSound('ascii_assets/chimes/F.mp3');
  chimeFs = loadSound('ascii_assets/chimes/Fsh.mp3');
  chimeG = loadSound('ascii_assets/chimes/G.mp3');
  chimeGs = loadSound('ascii_assets/chimes/Gsh.mp3');
  chimeA = loadSound('ascii_assets/chimes/A.mp3');
  chimeAs = loadSound('ascii_assets/chimes/Ash.mp3');
  chimeB = loadSound('ascii_assets/chimes/B.mp3');
  chimeC2 = loadSound('ascii_assets/chimes/C2nd.mp3');  
  
  cpu = createAudio('ascii_assets/cpu-working.mp3');

}

function setup() {
  // createCanvas(640, 480);
  noCanvas();
  video = createCapture(VIDEO);
  video.size(64, 48);
  asciiDiv = createDiv();

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    // console.log("predictions: ", predictions[0].landmarks)
  });

  // Hide the video element, and just show the canvas
  // video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

var range = (start, stop, step=1) => {
    const length = Math.ceil((stop - start) / step);
    return Array.from({length}, (_, i) => (i * step) + start);
}

function draw() {
  
  video.loadPixels();
  let asciiImage = "";
  for (let j = 0; j < video.height; j++) {
    for (let i = video.width; i > -2; i--) {
        if (range(0,7).includes(j) && range(-1,8).includes(i)) {
            asciiImage += "♣";
        } else if (range(41,48).includes(j) && range(-1,8).includes(i)) {
            asciiImage += "♦";
        } else if (range(0,7).includes(j) && range(56,65).includes(i)) {
            asciiImage += "♥";
        } else if (range(41,48).includes(j) && range(56,65).includes(i)) {
            asciiImage += "♠";
        } else if (range(42,46).includes(j) && [17,18,19,23,24,25,29,30,31,38,39,40,44,45,46].includes(i)) {
            asciiImage += "█"
        } else if ((i <= 6 || i >= 57 || j >= 42 || j <= 6) && ([1,2,4,5].includes(state))) {
            if (state == 1) asciiImage += randomize(["✧", "-"]);
            if (state == 2) asciiImage += randomize(["♫", "♪"]);
            if (state == 4) asciiImage += "←";
            if (state == 5) asciiImage += "➔";
        } else if (i > 6 && i < 57 && j < 42 &&  j > 5) {
            const pixelIndex = (i + j * video.width) * 4;
            const r = video.pixels[pixelIndex + 0];
            const g = video.pixels[pixelIndex + 1];
            const b = video.pixels[pixelIndex + 2];
            const avg = (r + g + b) / 3;
            const len = density.length;
            const charIndex = floor(map(avg, 0, 255, 0, len));
            const c = density.charAt(charIndex);
            if (c == " ") {
              asciiImage += "<span class='space'>&nbsp;</span>";
            } else {
              switch(state) {
                case 1:
                  sym = randomize(["✧", "-"]);
                  break;
                case 2:
                  sym = randomize(['♫', '♪']);
                  break;
                case 3:
                  sym = randomize('loliykykhahahaha ....,!?@#$%^&*()-=+1234567890'.split(''));
                  break;
                case 4:
                  sym = '←';
                  break;
                case 5:
                  sym = '➔';
                  break;
                case 6:
                  sym = '!';
                  break;
                case 7:
                  sym = '█';
                  break;
                case 8:
                  sym = randomize('moo');
                  break;
                default:
                  sym = c;
                }
              asciiImage += sym;
            }
         } else {
            if (state == 4) {
              asciiImage += "~";
            } else {
              asciiImage += "-"; //ꕀ
            }
         }
      }
    asciiImage += '<br/>';
  }
  // console.log("asciiImage", asciiImage);
  state = 0;
  asciiDiv.html(asciiImage);
  // image(video, width/2, height/2, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // const soundArray = [keyboard, casetteInsert, click]
  const keyboardArray = [keyboard0, keyboard1, keyboard2, keyboard3, keyboard4, keyboard5];
  const clickArray = [casetteInsert, click];
  const swooshArray = [swoosh1, swoosh2, swoosh3];
  const iphoneArray = [iphoneType1, iphoneType2, iphoneType3, iphoneType4];

  if (predictions.length > 0) {
    cpu.volume(0.2);
    cpu.play();
    
    let index = predictions[0].landmarks[5];
    xSpeed = Math.abs(index[0] - x0);
    ySpeed = Math.abs(index[1] - y0);


    if (index[1] > 400 && index[0] < 80) {
      state = 6;
      hat.play();
    } else if (index[1] > 400 && index[0] > 520) {
      state = 6;
      clap.play();
    } else if (index[1] < 190 && index[0] > 500) {
      state = 6;
      crash.play();
    } else if (index[0] < 90 && index[1] < 160) {
      state = 8;
      moo.play();
    // keyboards
    } else if (index[1] > 450) {
      state = 2;
      if (index[0] > 420 && index[0] < 500) {
        keyC.play();
      } else if (index[0] > 400) {
        keyCs.play();
      } else if (index[0] > 380) {
        keyD.play();
      } else if (index[0] > 360) {
        keyDs.play();
      } else if (index[0] > 340) {
        keyE.play();
      } else if (index[0] > 320) {
        keyF.play();
      } else if (index[0] > 295) {
        keyFs.play(); 
      } else if (index[0] > 250) {
        keyG.play();
      } else if (index[0] > 220) {
        keyGs.play();
      } else if (index[0] > 200) {
        keyA.play();
      } else if (index[0] > 175) {
        keyAs.play();
      } else if (index[0] < 175) {
        keyB.play();
      } else if (index[0] < 155) {
        keyC2.play();
      }
    } else if (index[1] < 160) {
      state = 1;
      if (index[0] > 420 && index[0] < 500) {
        chimeC.play();
      } else if (index[0] > 400 && index[0] < 420) {
        chimeCs.play();
      } else if (index[0] > 380) {
        chimeD.play();
      } else if (index[0] > 360) {
        chimeDs.play();
      } else if (index[0] > 340) {
        chimeE.play();
      } else if (index[0] > 320) {
        chimeF.play();
      } else if (index[0] > 295) {
        chimeFs.play(); 
      } else if (index[0] > 250) {
        chimeG.play();
      } else if (index[0] > 220) {
        chimeGs.play();
      } else if (index[0] > 200) {
        chimeA.play();
      } else if (index[0] > 175) {
        chimeAs.play();
      } else if (index[0] > 155) {
        chimeB.play();
      } else if (index[0] < 155) {
        chimeC2.play();
      }
    } else if (index[0] > 540) {
      state = 4;
      if (xSpeed > 10 || ySpeed > 10) {
        randomize([melody8bit1, oldRing, windowsError, coin]).play();
      }
    } else if (index[0] < 100) {
      state = 5;
      if (xSpeed > 10 || ySpeed > 10) {
        randomize([futureLogo1, deepScan, plasmaGun1, plasmaGun2, rocketLaunch, skyMelody, logoCorporate]).play();
      }
    } else {
      if (xSpeed > 200 && xSpeed < 250|| ySpeed > 200 && ySpeed < 250) {
        iphoneVibrate.play();
        state = 7;
      }
      else if (xSpeed > 120 || ySpeed > 120) {
        randomize(swooshArray).play();
        state = 7;
      }
      else if (xSpeed > 20 ) {
        randomize(keyboardArray).play();
        state = 3;
      } else if (ySpeed > 20) {
        randomize(clickArray).play();
        state = 3;
      } else if (xSpeed > 5 || ySpeed > 5) {
        randomize(iphoneArray).play();
        state = 3;
      }
      x0 = index[0];
      y0 = index[1];
    }
   console.log("index[0]: ", index[0], "index[1]: ", index[1]);
    
  }
}

function randomize(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function mousePressed() {
    if (videoState == 1) {
        video.stop();
        videoState = 0;
    } else {
        video.play();
        videoState = 1;
    }
  console.log('video:', video);
  console.log('state :', state);
  document.getElementsByClassName("space").innerHTML = '!';
}
