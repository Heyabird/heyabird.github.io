//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];

function preload() {
  table = loadTable("wind_direction_and_speed_2.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 800);  
  get_wind_data();
}

function get_wind_data() {
  for (let r = 0; r < table.getRowCount() / 100; r++) {
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

function draw() {
  background("#FFFDD0");
  stroke("#000000");
  translate(width/2, height/2); // center the lines
  strokeWeight(20);
  angleMode(RADIANS);
    
  test = wind_data.slice(40,45);
  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;
  
  for (let i = 0; i < test.length; i++) {
    t = test[i];
    s = t["speed"];
    d = t["direction"]; 
    
    // when speed is 1000, draw a horizontal line
    if (s == 1000) {
        line(-300, 0, 300, 0);
        starting_x = 0;
        starting_y = 0;
    // when speed is 1500, draw a cross
    } else if (s == 1500) {
        line(-300, 0, 300, 0);
        line(0, 300, 0, -300)
    // when speed is 2000, draw a circle
    } else if (s == 2000) {
        noFill();
        circle(0,0,300);
    // when speed is >2000, draw a swirl
    } else if (s > 2000) {
        // spiral?
    } else {
        coordinates = get_end_coordinates(s, d);
        x = coordinates[0];
        y = coordinates[1];
        line(starting_x, starting_y, x, y);
        strokeWeight(100);
        point(starting_x, starting_y, x, y);
        strokeWeight(50);

        // replace the start coordinates
        starting_x = x;
        starting_y = y;
    }
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
