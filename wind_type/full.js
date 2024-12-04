//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];
let wind_data_slices = [];

function preload() {
  table = loadTable("wind_direction_and_speed_2.csv", "csv", "header");
}

//grid
let num_col = 6;
let num_row = 13;
let colSize; let rowSize;
let grid_centers = [];
let padding = 1.5;
let scribble = new Scribble();

function setup() {
  canvas = createCanvas(windowWidth, windowHeight + 2000);  
  canvas.position( 0, 0);
  changeBackgroundColor();

  get_wind_data();


    for (i=0; i<=(num_row-1)*2; i+=padding) {
        for (j=0; j<=(num_col-1)*2; j+=padding) {
            let grid_coordinates = [j*1000, i*1000];
            grid_centers.push(grid_coordinates);
        }
    }

    print("grid_coor: ", grid_centers)

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
}

let startingIndex = 0; 

var backgroundColor = "#FFFDD0";

function draw() {
    // frameRate(10);
    createFibers();

    // noLoop();
    background(backgroundColor);
    stroke("#000000");
    noFill();
    strokeWeight(1);
    scale(.95);

    
    
    //grid
    // for (let i=0; i<num_col; i++) {
        // for (let j=0; j<num_row; j++) {
        // rect (i * colSize, j * rowSize, colSize, rowSize);
        // }
    // }

    if (mouseIsPressed === true) {

        if (mouseY < (windowHeight / 2) && startingIndex > 0) {
            startingIndex -= 1;
            // changeBackgroundColor();
        } else if (mouseY > (windowHeight / 2)) {
            startingIndex += 1;
            // changeBackgroundColor();
        } 
    }



  windstrokes(startingIndex);
//   animateLine = true;
}

function changeBackgroundColor() {
    backgroundColor = color(random(200,255),random(200,255),random(200,255));
}

function windstrokes(starting_index) {
    // translate(width/2, height/2); // center the lines
  translate(118, 120);
  strokeWeight(20);
  fill('black');
  scale(0.1);
  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;

  // how many wind strokes to include in one "letter"
  num_strokes = 5;
  for (i=0; i<1000; i=i+5) {
    wind_data_slice = wind_data.slice(i, i+num_strokes);
    wind_data_slices.push(wind_data_slice);
  }   

    // get an array of consecutive 100 integers, starting from the 2nd argument 
    slice_range = range(91, starting_index); // [0, 1, 2, ... 155]

    for (i=0; i<slice_range.length; i++) {
        // if(i==2) { // HEYA: comment this out; this is for debugging purposes
        draw_type(wind_data_slices[slice_range[i]], grid_centers[i][0], grid_centers[i][1])
        // } // HEYA: comment this out; this is for debugging purposes
    }
}

function draw_type(wind_data, s_x, s_y) {
    noFill();
    starting_x = s_x;
    starting_y = s_y;
   for (let i = 0; i < wind_data.length; i++) {

      t = wind_data[i];
      s = t["speed"];
      d = t["direction"]; 
      time = t["time"];

      strokeWeight(50);


    if (s == 1000 || s == 1200 || s == 1400 || s == 1600 || s == 1800) {
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
        } else {
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
      if (i==0) {
        text(time, s_x-690, s_y+900);
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



