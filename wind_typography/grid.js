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
  print("__________________ wind_data: ", wind_data);
  console.log("wind_data_slices: ", wind_data_slices);


}

function draw() {

  background("#FFFDD0");
  stroke("#000000");
  noFill();
  strokeWeight(1);
  
  //grid
  for (let i=0; i<columns; i++) {
    for (let j=0; j<rows; j++) {
      rect (i * colSize, j * rowSize, colSize, rowSize);
    }
  }
  
  // translate(width/2, height/2); // center the lines
  translate(100, 100);
  strokeWeight(20);
  angleMode(RADIANS);


  scale(0.1);

  
  // starting point coordinates
  starting_x = 0;
  starting_y = 0;
  
  for (i=0; i<1000; i=i+5) {
    wind_data_slice = wind_data.slice(i, i+5);
    wind_data_slices.push(wind_data_slice);
  }
  
  strokeWeight(50);
  
  slice_range = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  
  // for (i=0; i<rows.length; i++) {
  //   grid_center_x, grid_center_y = 0, 0;
  //   grid_centers.push([grid_center_x, grid_center_y]);
  //   grid_
  // }
  
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

  for (i=0; i<slice_range.length; i++) {
    // print("i: ", i);
    draw_type(wind_data_slices[slice_range[i]], grid_centers[i][0], grid_centers[i][1]);
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

function draw_type(wind_data, s_x, s_y) {
    starting_x = s_x;
    starting_y = s_y;
   for (let i = 0; i < wind_data.length; i++) {

      t = wind_data[i];
      s = t["speed"];
      d = t["direction"]; 

      // when speed is 1000, draw a horizontal line
      if (s == 1000) {
          line(s_x-300, s_y, s_x+300, s_y);
          starting_x = s_x;
          starting_y = s_y;
      // when speed is 1500, draw a cross
      } else if (s == 1500) {
          line(s_x-400, s_y, s_x+400, s_y);
          line(s_x, s_y+400, s_x, s_y-400)
      // when speed is 2000, draw a circle
      } else if (s == 2000) {
          noFill();
          circle(s_x,s_y,300);
      // when speed is >2000, draw a swirl
      } else if (s > 2000) {
          // spiral?
      } else {
          coordinates = get_end_coordinates(s, d);
          x = coordinates[0] + s_x;
          y = coordinates[1] + s_y;
          line(starting_x, starting_y, x, y);
          // replace the start coordinates
          starting_x = x;
          starting_y = y;
      }
    }
}