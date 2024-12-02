//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];
let wind_data_slices = [];

function preload() {
  table = loadTable("wind_direction_and_speed_2.csv", "csv", "header");
}

//grid
let columns = 4;
let rows = 4;
let colSize; let rowSize;
let grid_coordinates = [100, 300, 500, 700]
let grid_centers = [];


function setup() {
  createCanvas(800, 800);  
  get_wind_data();

  
  colSize = width/columns;
  rowSize = height/rows;
}

function get_wind_data() {
  for (let r = 0; r < table.getRowCount() - 800; r++) {
    for (let c = 0; c < table.getColumnCount() ; c++) {
      if (c == 0) {
        var wind_object = {};
        wind_object.direction = table.getString(r, c);
        // print("0: ", table.getString(r, c));
      } else if (c == 1) {
        wind_object.speed = table.getString(r, c) * 100;
        // print("1: ", table.getString(r, c));
      } else if (c == 2) {
        wind_object.time = table.getString(r, c);
        // print("2: ", table.getString(r, c));
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

var backgroundColor = "#FFFDD0"

function draw() {
    background(backgroundColor);
    stroke("#000000");
    noFill();
    strokeWeight(1);
    
    //grid
    for (let i=0; i<columns; i++) {
        for (let j=0; j<rows; j++) {
        rect (i * colSize, j * rowSize, colSize, rowSize);
        }
    }

    if (mouseIsPressed === true) {
        if (mouseX > 400) {
            startingIndex += 1
        } else if (mouseX < 400 && startingIndex > 0) {
            startingIndex -= 1;
        }
        backgroundColor = color(random(200,255),random(200,255),random(200,255));
    }

  windstrokes(startingIndex);
  animateLine = true;

}


function windstrokes(starting_index) {
    // translate(width/2, height/2); // center the lines
  translate(100, 100);
  strokeWeight(20);
//   angleMode(RADIANS);
  fill('black');

  scale(0.1);

  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;
  
  for (i=0; i<1000; i=i+5) {
    wind_data_slice = wind_data.slice(i, i+5);
    wind_data_slices.push(wind_data_slice);
  }
  
  
  grid_centers = [
        [0, 0],
        [2000, 0],
        [4000, 0],
        [6000, 0],
        [0, 2000],
        [2000, 2000],
        [4000, 2000],
        [6000, 2000],
        [0, 4000],
        [2000, 4000],
        [4000, 4000],
        [6000, 4000],
        [0, 6000],
        [2000, 6000],
        [4000, 6000],
        [6000, 6000]
    ]       

    // get an array of consecutive 16 integers, starting from the 2nd argument 
    slice_range = range(16, starting_index);

    for (i=0; i<slice_range.length; i++) {
        // if(i==2) { // HEYA: comment this out; this is for debugging purposes
        // draw_stroke(random(0,255),random(0,255),random(0,255));
        draw_type(wind_data_slices[slice_range[i]], grid_centers[i][0], grid_centers[i][1])
        // } // HEYA: comment this out; this is for debugging purposes
        print("i:", i, "wind_data_slices[slice_range[i]]: ", wind_data_slices[slice_range[i]])
    }
}

// why does javascript not have this built in?!
function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

// let's do some middle school trigonometry!! (surprisingly hard)
function get_end_coordinates(a, C) {
  angleMode(DEGREES);
  print("HEYA3, C: ", C);
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
  print("HEYA, C:", C, ", a:", a, ", A: ", A, " and c: ", c);
  print("HEYA22: sin(C): ", sin(C), "sin(A): ", sin(A), "sin(C)*a:", sin(C)*a)
  // find d, the height of the triangle
  d = c * sin(A);
  // find e, the length that the x cooridnate shortens after the rotation
  e = d / tan(A);
  f = a - e
  return ([f, d]);
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
    //   if(i==4) { // HEYA: comment out
      // when speed is bigger than 1250, draw a circle
    //   if (s> 1200) {

    //   }

    if (s >= 1000) {
        ellipse(s_x, s_y, (s * .5), (s * .5));
    }
    else if (s >= 400 && s < 800) {
        coordinates = get_end_coordinates(s, d);
        x = coordinates[0] + s_x;
        y = coordinates[1] + s_y;
        line(starting_x, starting_y, x, y);
        starting_x = x;
        starting_y = y;
    }
    // else if (s > 1000) {
    //     rect(s_x - (s/4), s_y - (s/4), s/2, s/2);
    //   }
    //   else if (s > 1000) {
    //     // cross
    //     line(s_x-(s/2), s_y, s_x+(s/2), s_y);
    //     line(s_x, s_y+(s/2), s_x, s_y-(s/2));
    //   // when speed is between 1000 and 1250, draw a cross
    //   } 
    //   else if (s > 800) {
    //     // vertical line
    //     line(s_x, s_y+(s/2), s_x, s_y-(s/2));
    //     // plus small horizontal line
    //     line(s_x-(s/2), s_y, s_x, s_y);
    // } 
    // else if (s > 600) {
    //     // horizontal line
    //     line(s_x-(s/2), s_y, s_x+(s/2), s_y);
    //     // plus small vertical line
    //     line(s_x, s_y, s_x, s_y-(s/2));
    // } 
    // else if (s == 300) {
    //     // vertical line
    //     line(s_x, s_y+(s/2), s_x, s_y-(s/2));
    // } else if (s == 200) {
    //     // horizontal line
    //     line(s_x-(s), s_y, s_x+(s), s_y);
    // } 
    else if (s <= 300) {
        // small horizontal line from center
        // rotate(d, [s_x, s_y]);
        if (d > 270) {
            line(s_x, s_y+s, s_x, s_y);
        } else if (d > 180) {
            line(s_x-s, s_y, s_x, s_y);
        } else if (d > 90) {
            line(s_x, s_y, s_x, s_y-s);
        } else if (d> 45) {
            line(s_x, );
        } else if (d > 0) {
            line(s_x, s_y, s_x+s, s_y);
        }
        // rotate(360-d, [s_x, s_y]);
    }
    // else if (s == 0) {
    //     strokeWeight(150);
    //     point(s_x, s_y);
    //     strokeWeight(50);
    // }
    else {
        print("s: ", s, "d:", d);
          coordinates = get_end_coordinates(s, d);
          x = coordinates[0] + s_x;
          y = coordinates[1] + s_y;
          if (starting_x - x > 400) {
            // starting_x = s_x;
            // if (x < starting_x) {
            //     x = 
            // }
            // x = (starting_x + x)/2;
            console.log("over!: ", s_x, s_y)
          }
          print("HEYA: ", starting_x, starting_y, x, y, s_x, s_y, s, d)
          print("HEYA2 coordinates: ", coordinates)
          line(starting_x, starting_y, x, y);
        //   strokeWeight(60);
        //   line(starting_x, starting_y,  x- 20, y-10);
          strokeWeight(90);
          point(starting_x, starting_y);
          strokeWeight(50);
          // replace the start coordinates
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