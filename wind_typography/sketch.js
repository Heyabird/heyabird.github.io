//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
let months;
let old_x;
let old_y;
var wind_data = [];

function preload() {
  table = loadTable("wind_direction_and_speed_2.csv", "csv", "header");
}


function setup() {
  createCanvas(800, 800);
  let row1 = table.getRow(0);
//   console.log("hi1", row1.get("speed"));
//   console.log("hi1", row1.get("direction"));
//   console.log("hi2", row1.get("created_at"));
  
  months = [90, 135, 157, 180, 202, 225, 270, 335, 360, 45];
  
  get_wind_data();
}

function get_wind_data() {
  for (let r = 0; r < table.getRowCount() / 100; r++) {
    for (let c = 0; c < table.getColumnCount() ; c++) {
      // print('c: ', c)
      // print("1!");
      // wind_object.speed = 
      // wind_data.push('');
      if (c == 0) {
        var wind_object = {};
        wind_object.direction = table.getString(r, c);
        print("0: ", table.getString(r, c));
        print("wind_object.direction: ", wind_object.direction);
      } else if (c == 1) {
        wind_object.speed = table.getString(r, c) * 100;
        print("1: ", table.getString(r, c));
      } else if (c == 2) {
        wind_object.time = table.getString(r, c);
        print("2: ", table.getString(r, c));
        wind_data.push(wind_object);
      }
        print("2 - wind object: ", wind_object);

    }
    // print(table.getColumn('name'));
    // print("__________________ wind_data: ");
  }
}

function mouseClicked() {
  print("__________________ wind_data: ", wind_data);
}


function draw() {
  angleMode(RADIANS);

  background(0);
  translate(width/2, height/2); // center the lines
  // scale(0.5);
  strokeWeight(20);
  
//   show_grid();
  
  
  // test = [{speed: 300, degree: 22}, {speed: 200, degree: 225}, {speed: 1500, degree: 300}, {speed: 200, degree: 135}, {speed: 2000, degree: 43}]
  
  test = wind_data.slice(65,70);
  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;
  
  for (let i = 0; i < test.length; i++) {
    t = test[i];
    s = t["speed"];
    d = t["direction"]; 
    
    // when speed is 1000, draw a horizontal line
      if (s == 1000) {
        stroke("#E91E63");
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
        // spiral
      } else {
        coordinates = get_end_coordinates(s, d);
        x = coordinates[0];
        y = coordinates[1];
        stroke("#4CAF50");
        line(starting_x, starting_y, x, y);
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

function show_grid() {
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0,0,100);
  fill(255);
  noStroke();
  text("0°", 54, 0);
  
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 300);
  fill(255);
  noStroke();
  text("1°", 154, 0);
  
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 500);
  
  for (let i=0; i< months.length; i++) {
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(24);
    let angle = map(i, 0, months.length, 0, TWO_PI);
    push();
    let x = 250 * cos(angle);
    let y = 250 * sin(angle);
    translate(x,y);
    rotate(angle + PI/2);
    text(months[i], 0, 0);
    pop();
  }
}