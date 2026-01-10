//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];
let wind_data_slices = [];


function preload() {
  table = loadTable("wind_direction_and_speed_3.csv", "csv", "header");
}

//grid
let num_col = 9;
let num_row = num_col;
let colSize; let rowSize;
let grid_centers = [];
let padding = 1.5;
let scribble = new Scribble();
let show_time = false;
let range_size = 91;
let timeButtonText = "time ⏰";
let zoom_level = 0;
let extraScale = 1;
let move = 0;

function setup() {
  canvas_size = 750
  canvas = createCanvas(canvas_size, canvas_size);  
  canvas.position( (windowWidth - canvas_size)/2, 0);
  changeBackgroundColor();

  get_wind_data();

  let left_margin = 40;
  let y_start = 360;


  let timeButton = createButton(timeButtonText);
  timeButton.position(left_margin, y_start);
  timeButton.mousePressed(toggleTime);
  timeButton.size(68, 25);
  
  let zoomInButton = createButton('zoom ⬆️');
  zoomInButton.position(left_margin, y_start + 35);
  zoomInButton.mousePressed(zoomIn);
  zoomInButton.size(68, 25);

  let zoomOutButton = createButton('zoom ⬇️');
  zoomOutButton.position(left_margin, y_start + 35 * 2);
  zoomOutButton.mousePressed(zoomOut);
  zoomOutButton.size(68, 25);

  // let colorButton = createButton('color ♻️');
  // colorButton.position(left_margin, y_start + 35 * 3);
  // colorButton.mousePressed(changeBackgroundColor);
  // colorButton.size(68, 25);

  let infoButton = createButton("<b>documentation</b>");
  infoButton.position(left_margin, windowHeight - 77);
  infoButton.mousePressed(showModal);
  infoButton.size(118, 25);
  infoButton.style('background-color', 'black');
  infoButton.style('color', 'white');
  infoButton.style('border-radius', '5px');

    // print("grid_coor: ", grid_centers)

}

function get_wind_data() {
  for (let r = 0; r < table.getRowCount(); r++) {
    for (let c = 0; c < table.getColumnCount() ; c++) {
      if (c == 0) {
        var wind_object = {};
        wind_object.direction = table.getString(r, c);
      } else if (c == 1) {
        wind_object.speed = table.getString(r, c) * 100;
      } else if (c == 2) {
        wind_object.time = table.getString(r, c);
        wind_data.push(wind_object);
      }
    }
  }
}

// used for debugging
function mouseClicked() {
//   print("__________________ wind_data: ", wind_data);
//   console.log("wind_data_slices: ", wind_data_slices);
//   wind_data_slices[slice_range[1]];
    // windstrokes(mouseX);
}

let startingIndex = 0; 

var backgroundColor = "white";

function toggleTime() {
  if (show_time === true) {
    show_time = false;
    timeButtonText = 'time ❌';
  } else {
    show_time = true;
    timeButtonText = 'time ⭕️';
  }
}

function zoomIn() {
  console.log("in!");
  if (zoom_level < 2) {
    zoom_level += 1;
  }
  grid_centers =[];
} 


function zoomOut() {
  console.log("out!");
  if (zoom_level > 0) {
    zoom_level -= 1;
  }
  grid_centers =[];
} 

function info() {

}

function draw() {


  if (zoom_level == 1) {
    range_size = 121;
    num_col = num_row = 9;
    extraScale = 1;
    move = 200;
  } else if (zoom_level == 2) {
    range_size= 36;
    num_col = num_row = 5;
    extraScale = 1.9;
    // padding = 50;
  } else if (zoom_level == 0) {
    range_size = 286;
    num_row = num_col = 14;
    extraScale = .7;
    move = -500;
  }

  console.log("zoom_level: ", zoom_level)
  // frameRate(10);

  // noLoop();
  background(backgroundColor);
  stroke("#000000");
  noFill();
  strokeWeight(1);
  // createFibers();
  

  scale(.43);

  for (i=0; i<=(num_row-1)*2; i+=padding) {
    for (j=0; j<=(num_col-1)*2; j+=padding) {
        let grid_coordinates = [i*1000+move, j*1000+move];
        grid_centers.push(grid_coordinates);
    }
  }
  textSize(200);
  fill("black");
  // title = text("Wind Typography", -400, 100);
  console.log("grid_centers: ", grid_centers);

  

  

  windstrokes(startingIndex);

  modal = select('.modal-wrapper');
  modalButton = select('#modal-button');
  modalTitle = select('#modal-title');
  modalDescription = select('#modal-description');
  modalButton.mousePressed(modalButtonClicked);

  updateModal("Wind Typography", modalText);

//   if (mouseIsPressed === true) {
//     if (mouseX > 400) {
//         startingIndex += 1
//     } else if (mouseX < 400 && startingIndex > 0) {
//         startingIndex -= 1;
//     }
//   }

  if (keyIsPressed === true && keyCode === RIGHT_ARROW  ) {
      startingIndex += 15;
  } else if (keyIsPressed === true && keyCode === LEFT_ARROW && startingIndex > 15) {
      startingIndex -= 15;
  }
  if (keyIsPressed === true && keyCode === DOWN_ARROW  ) {
    startingIndex += 1;
  } else if (keyIsPressed === true && keyCode === UP_ARROW && startingIndex > 1) {
    startingIndex -= 1;
  }

}
// Change direction when the user scrolls the mouse wheel.
function mouseWheel(event) {
    if (event.delta <= 0 && startingIndex > 0) {
        // startingIndex -= 1;
        // changeBackgroundColor();
    } else {
        // startingIndex += 1;
        // changeBackgroundColor();
    }
}

function keyPressed() {
    // if (key === "ArrowUp" && startingIndex > 0) {
    //     startingIndex -= 1;
    // }
    // else if (key === "ArrowDown") {
    //     startingIndex += 1;
    // }
}

function mousePressed() {
    if (mouseX < 400 && startingIndex > 0) {
        // startingIndex -= 1;
        // changeBackgroundColor();
    } else if (mouseX > 400) {
        // startingIndex += 1;
        // changeBackgroundColor();
    } 
}

function changeBackgroundColor() {
    // backgroundColor = color(random(200,255),random(200,255),random(200,255));
}
// if (keyIsPressed === true && keyCode === UP_ARROW  && startingIndex > 0) {
//     startingIndex -= 1;
// } else if (keyIsPressed === true && keyCode === DOWN_ARROW) {
//     startingIndex += 1;
//     backgroundColor = color(random(200,255),random(200,255),random(200,255));
// }

function windstrokes(starting_index) {
    // translate(width/2, height/2); // center the lines
  translate(118, 120);
  strokeWeight(20);
  fill('black');
  scale(0.1);
  scale(extraScale);
  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;

  // how many wind strokes to include in one "letter"
  num_strokes = 5;
  for (i=0; i<wind_data.length; i=i+5) {
    wind_data_slice = wind_data.slice(i, i+num_strokes);
    wind_data_slices.push(wind_data_slice);
  }   

    // get an array of consecutive 100 integers, starting from the 2nd argument 
    slice_range = range(range_size, starting_index);

    for (i=0; i<slice_range.length; i++) {
        // if(i==2) { // HEYA: comment this out; this is for debugging purposes
        draw_type(wind_data_slices[slice_range[i]], grid_centers[i][0], grid_centers[i][1])
        // } // HEYA: comment this out; this is for debugging purposes
        if(i==0 && show_time === true) {
          fill('gray');
          textSize(300);
          date = time.slice(0,10) + " (UTC)";
          text(date, -600 + move , -500 + move);  
        }
    }

    // scale(1/extraScale);

}

function draw_type(wind_data, s_x, s_y) {
  noFill();
  // stroke('black');
  if (color === true) {
    // alert('hi')
    stroke(strokeColor);
  }
  starting_x = s_x;
  starting_y = s_y;
 for (let i = 0; i < wind_data.length; i++) {
   
    t = wind_data[i];
    s = t["speed"];
    d = t["direction"]; 
    time = t["time"];

    strokeWeight(55);


  if (s == 1000 || s == 1200 || s == 1400 || s == 1600 || s == 1800 || s == 2000) {
      if (s == 1000) {
          if (d > 270) {
              // ellipse(s_x +(s/3), s_y +(s/3), (s/3), (s/3));
              scribble.scribbleEllipse(s_x +(s/3), s_y +(s/3), (s/3), (s/3));
          } else if (d > 180) {
              // ellipse(s_x -(s/3), s_y +(s/3), (s/3), (s/3));
              scribble.scribbleEllipse(s_x -(s/3), s_y +(s/3), (s/3), (s/3));
          } else if (d > 90) {
              // ellipse(s_x -(s/3), s_y -(s/3), (s/3), (s/3));
              scribble.scribbleEllipse(s_x -(s/3), s_y -(s/3), (s/3), (s/3));
          } else if (d > 0) {
              // ellipse(s_x + (s/3), s_y -(s/3), (s/3), (s/3));
              scribble.scribbleEllipse(s_x + (s/3), s_y -(s/3), (s/3), (s/3));
          }
      } else if (s == 1800 || s == 2000) {
        scribble.scribbleRect(s_x, s_y, (s/2), (s/2));
      }
      else {
        // ellipse(s_x, s_y, (s/2), (s/2));
        scribble.scribbleEllipse(s_x, s_y, (s/2), (s/2));
      }
  } else if (s == 300) {
      // stroke('red');
      if (d >= 180) {
          // horizontal line
          // line(s_x-(s*2), s_y, s_x+(s*2), s_y);
          // print("s2: ", s);
          scribble.scribbleLine(s_x-(s*2), s_y, s_x+(s*2), s_y);
      } else {
          // vertical line
          // line(s_x, s_y-(s*2), s_x, s_y+(s*2));
          scribble.scribbleLine(s_x, s_y-(s*2), s_x, s_y+(s*2));
      }
      // stroke('black');
  }
  else if (s == 100 || s == 200) {
      if (d > 270) {
          // line(s_x, s_y+s*3, s_x, s_y);
          scribble.scribbleLine(s_x, s_y+s*3, s_x, s_y);
      } else if (d > 180) {
          // line(s_x-s*3, s_y, s_x, s_y);
          scribble.scribbleLine(s_x-s*3, s_y, s_x, s_y);
      } else if (d > 90) {
          // line(s_x, s_y, s_x, s_y-s*3);
          scribble.scribbleLine(s_x, s_y, s_x, s_y-s*3);
      } else if (d> 45) {
          // line(s_x, s_y);
          scribble.scribbleLine(s_x, s_y);
      } else if (d > 0) {
          scribble.scribbleLine(s_x, s_y, s_x+s*3, s_y);
          // line(s_x, s_y, s_x+s*3, s_y);
      }
  } else if (s == 0) {
      // skip
  }
  else {
      coordinates = get_end_coordinates(s, d);
      x = coordinates[0] + s_x;
      y = coordinates[1] + s_y;
      // line(starting_x, starting_y, x, y);
      scribble.scribbleLine(starting_x, starting_y, x, y);
      starting_x = x;
      starting_y = y;
    }
    strokeWeight(5);
    textSize(120);
    // because each square shows 5 different brush strokes / wind stroke, let's only record the first timestamp
    if (i==0 && show_time === true) {
      fill('gray');
      textSize(180);

      newTime = time.slice(10,20);
      // print("oldDate:", oldDate);
      // print("date: ", date);
      // if (oldDate != date) {
      //     // ellipse(100, 100, 500, 500);
      //     text(date, s_x-400, s_y+700);
      // }
      text(newTime, s_x-320, s_y+750);
      // oldDate = date;
      noFill();
    } else {
      // nothing
    }
  //   console.log("i:", i, "time: ", time);
  //   } // HEYA: comment out
  }
}

function createTexture(){
    const NUM_DOTS = 400;
      for(let i = 0; i < NUM_DOTS; i++) {
        let x = random() * width;
        let y = random() * height;
        let r = random(5,15)
        ellipse(x, y, r);
      }
  }
  
  // https://editor.p5js.org/lzmunch/sketches/Xnp94GpqN
  function createFibers(){
    let numFibers = 3000;
    for (let i=0; i<numFibers; i++){
      let x1 = random() * width;
      let y1 = random() * height;
      let theta = random() * 2 * Math.PI;
      let segmentLength = random() * 5 + 2;
      let x2 = cos(theta) * segmentLength + x1;
      let y2 = sin(theta) * segmentLength + y1;
      stroke(
        15,
        10-random() * 5,
        100-random() * 8,
        random() * 10 + 75
      )
      line(x1, y1, x2, y2);
    }
    console.log("created fibers")
  }

// why does javascript not have this built in?!
function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

// let's do some middle school trigonometry!! (surprisingly hard)
function get_end_coordinates(a, C) {
  angleMode(DEGREES);
  // find A, the angle of the other two points in the triangle
  let sign = "positive";
  if (C < 0) {
    sign = "negative";
    C = Math.abs(C);
  }

  if (C > 180) {
    // C = 180 - C;
  }
  if (C > 90) {
    // C = 90 - C;
  }

  A = (180 - C) / 2;
  // find c, the length of the other side of the triangle
  c = (sin(C) * a / sin(A));
  // find d, the height of the triangle
  d = c * sin(A);
  // find e, the length that the x cooridnate shortens after the rotation
  e = d / tan(A);
  f = a - e
  return ([f, d]);
}

function modalButtonClicked() {
  hideModal()
}

function updateModal(title, description) {
modalTitle.elt.innerHTML = title;
modalDescription.elt.innerHTML = description

}

function showModal() {
isModalVisible = true;
modal.elt.style.display = 'flex'
}

function hideModal() {
isModalVisible = false;  
modal.elt.style.display = 'none'
}


const modalText = "<p>Wind Typography is a <b>visualization of wind data based on imagined typographic rules</b>. The <b>speeds</b> and <b>directions</b> of winds were collected from Aalto University (Espoo, Finland), on the balconies of Marsio (15 to 16 November) and Väre building (6 to 7 December). They were then <b>converted into typographic shapes</b> using codes inspired by my first written language, <b>Hangul (한글)</b> -- the writing system of Korea. The resulting designs are illegible yet mimic text, evoking a sense of hidden meaning.</p><p><br/> <b>Codes/Rules</b>: </p> <ul><li>For a wind with speed 0 kph, draw nothing.</li><li>For a wind with speed 1 or 2 kph, draw a short and straight stroke that starts from the center of the grid and points towards the wind direction (direction is quantized into 1 of 4 directions).</li> <li>For a wind with speed 3 kph, draw a long and straight stroke that is centered on the grid (stroke is quantized into 1 of 4 wind directions).</li> <li>For a wind with speed that is even-numbered and bigger than 10 kph but less than 16 kph, draw a circle. If the speed is exactly 10kph, put a small circle positioned towards the angle of the wind direction. For all other circles, place the circle in the center of the grid and make its size dependent on its speed.</li> <li>For a wind with speed 18 kph or 20 kph, draw a rectangle. Rectangle is always positioned in the middle and its size reflects the speed.</li> <li><b>For all other winds</b>, draw a stroke that starts from the previous ending point (if it is the first stroke of its unit, start from the center of the grid). <b>The stroke’s length reflects the wind speed while the angle reflects the wind direction.</b></li> <li>Combine 5 different winds to create one unit. This is similar to how Hangul works, where 5 separate letters (represented by lines, circles, squares, etc.) combine into a single syllabic unit. Those syllabic units are then combined into words.</li></ul><br/><p>🔗 <b>Full Documentation: </b> <a href='https://heya.world/wind_typography/about' target='_blank'>https://heya.world/wind_typography/about</a></p></div>"