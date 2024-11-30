//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];
let startingIndex = 10;

function preload() {
  table = loadTable("wind_direction_and_speed_2.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 800);  
  get_wind_data();
  // setTimeout(test, 2000);
  // background('white');
  // setTimeout(background('red'), 100000);
}

function test() {
}

function get_wind_data() {
  for (let r = 0; r < table.getRowCount(); r++) {
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
  print("__________________ wind_data: ", wind_data);
}

var backgroundColor = "#FFFDD0"

function draw() {
  if (mouseIsPressed === true) {
    if (mouseX > 400) {
        startingIndex += 1
    } else if (mouseX < 400 && startingIndex > 0) {
        startingIndex -= 1;
    }
    backgroundColor = color(random(200,255),random(200,255),random(200,255));
    percentage = 0;
  }

  background(backgroundColor);
  stroke("#000000");
  translate(width/2, height/2); // center the lines
  strokeWeight(20);
  angleMode(RADIANS);
    
  test = wind_data.slice(startingIndex,startingIndex+5);
  print("test: ", test)

  // setTimeout(
  draw_type();
  
}

function draw_type() {
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;
  
  for (let i = 0; i < test.length; i++) {
    co
    t = test[i];
    s = t["speed"];
    d = t["direction"]; 
    
    draw_stroke();
    }
}

function draw_stroke() {
  // when speed is bigger than 1250, draw a circle
  if (s > 1300) {
    noFill();
    ellipse(0, 0, (s * .5), (s * .5));
  // when speed is between 1000 and 1250, draw a cross
  } else if (s > 1000) {
    line(-400, 0, +400, 0);
    line(0, 400, 0, -400);
  } else {
      coordinates = get_end_coordinates(s, d);
      x = coordinates[0];
      y = coordinates[1];


      draw_point();
      draw_line();
      // replace the start coordinates
      starting_x = x;
      starting_y = y;
    }
}

function draw_line(){
  strokeWeight(60);
  animate_line(starting_x, starting_y, x, y);
}

function draw_point() {
  strokeWeight(90);
  point(starting_x, starting_y);
}

let percentage = 0;
var mid;

function animate_line(x, y, x2, y2){
    start = createVector(x, y);
    end = createVector(x2, y2);
    
    // https://p5js.org/reference/p5/lerp/
    mid = p5.Vector.lerp(start,end,percentage);
    line(start.x, start.y, mid.x, mid.y);
    if (percentage < 1) {
      percentage += 0.001;
    }
}



function get_end_coordinates(a, C) {
  // find A, the angle of the other two points in the triangle
  A = (180 - C) / 2;
  // find c, the length of the other side of the triangle
  c = sin(C) * a / sin(A);
  // find d, the height of the triangle
  d = c * sin(A);
  // find e, the length that the x cooridnate shortens after the rotation
  e = d / tan(A);
  f = a - e
  return ([f, d]);
}

