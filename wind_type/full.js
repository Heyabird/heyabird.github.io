//coding train tutorial: https://www.youtube.com/watch?v=rVBTxnRyOuE

let table;
var wind_data = [];
let wind_data_slices = [];
let startingIndex = 0; 
let show_time = false;
let zoom_out = false;
let range_size = 91;
let extraScale = 1;
let color1 = false;

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
let oldDate = "";
let zoom_level = 5;

function setup() {
    width = 1080;
    height = 1920;
    canvas = createCanvas(width, height);  
    canvas.position( 0, 0);
    // changeBackgroundColor();

    get_wind_data();
}

// go through csv and create a list of objects with speed, direction, and time
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


let buttonX = 1080 - 200; 
let buttonY = 1920 - 120;
let buttonSize = 170;

// used for debugging
function mousePressed() {
    let distToCenterClock = dist(mouseX, mouseY, buttonX + 65, buttonY - 210);
    // print("distToCenterClock: ", distToCenterClock);
    let distToCenterInfo = dist(mouseX, mouseY, buttonX + 65, buttonY - 20);
    // print("distToCenterInfo: ", distToCenterInfo);
    let distToCenterMinus = dist(mouseX, mouseY, buttonX + 110, buttonY - 345);
    let distToCenterPlus = dist(mouseX, mouseY, buttonX + 110, buttonY - 410);
    let distToCenterColor = dist(mouseX, mouseY, buttonX + 110, buttonY - 475);

    let distToCenterDown = dist(mouseX, mouseY, buttonX + 110, buttonY - 525);
    let distToCenterUp = dist(mouseX, mouseY, buttonX + 110, buttonY - 475);
    
    print("distToCenterPlus: ", distToCenterPlus);
    print("distToCenterMinus: ", distToCenterMinus);


    if (distToCenterClock < buttonSize / 2) {
        show_time = !show_time;
        // alert("zoom_out: ", show_time.toString());
    } else if (distToCenterInfo < buttonSize / 2) {
        showModal();
    } else if (distToCenterPlus < buttonSize / 8) {
        if (zoom_level < 6) {
          zoom_level += 1;
          // num_col += 1;
          num_col -= .5;
          range_size = 91;
        }
        // alert("zoom_out: ", zoom_out.toString());
        grid_centers =[];
    } else if (distToCenterMinus < buttonSize / 8) {
      if (zoom_level > 0) {
        zoom_level -= 1;
        // num_col += 1;
        num_col += .5;
        range_size = 121;
      }
      // alert("zoom_out: ", zoom_out.toString());
      grid_centers =[];
    } 
    // else if (distToCenterColor < buttonSize / 8) {
    //   changeBackgroundColor();
    //   color1 = true;
    // }
    else if (distToCenterDown < buttonSize / 8 && startingIndex > 0) {
      startingIndex -= 7;
    }
    else if (distToCenterUp < buttonSize / 8) {
      startingIndex += 7;
    }
    // else if (mouseY < (windowHeight / 2) && startingIndex > 0) {
    //    startingIndex -= 7;
    //    // changeBackgroundColor();
    // } else if (mouseY > (windowHeight / 2)) {
    //    startingIndex += 7;
    //    // changeBackgroundColor();
    // } 
    if (zoom_level == 6) {
      num_col = 5;
      range_size= 91;
      extraScale = 7/6;
    } 
    else if (zoom_level == 5) {
      num_col = 6;
      range_size= 91;
      extraScale = 1;
    } else if (zoom_level == 4) {
      num_col = 6.5;
      range_size = 121;
      extraScale = 7/8;
    } else if (zoom_level == 3) {
      num_col = 7;
      range_size = 153;
      extraScale = 6.1/8;
    } else if (zoom_level == 2) {
      num_col = 8;
      num_row = 20;
      range_size = 200;
      extraScale = 5.5/8;
    } else if (zoom_level == 1) {
      num_col = 9;
      num_row = 24;
      range_size = 240;
      extraScale = 4.9/8;
    } else if (zoom_level == 0) {
      num_col = 10;
      num_row = 24;
      range_size = 340;
      extraScale = 4/8;
    }
}

// function decreaseSize() {
//   if (zoom_level > 0) {
//     zoom_level -= 1;
//     // num_col += 1;
//     num_col = 5;
//   }
// }



var backgroundColor = "#fff6e5";
var strokeColor = 'red';

function draw() {
    frameRate(5);
    background(backgroundColor);
    stroke(strokeColor);
    noFill();
    strokeWeight(1);
    scale(.95);
    createFibers();
    // createTexture();

    for (i=0; i<=(num_row-1)*2; i+=padding) {
      for (j=0; j<=(num_col-1)*2; j+=padding) {
          // print("hi! num_col: ", num_col);
          let grid_coordinates = [j*1000, i*1000];
          grid_centers.push(grid_coordinates);
      }
    }

    windstrokes(startingIndex);
    scale (10); // resize to original scale

    modal = select('.modal-wrapper');
    modalButton = select('#modal-button');
    modalTitle = select('#modal-title');
    modalDescription = select('#modal-description');
  
    // testButton.mousePressed(showModal);
    modalButton.mousePressed(modalButtonClicked);
  
    updateModal("Wind Typography", modalText);



    drawControls();
    
}

function drawControls() {
    stroke('black');


    fill('#FFB6C1');
    // up
    scribble.scribbleEllipse(buttonX + buttonSize/4, buttonY - 635 + 50, buttonSize / 4, buttonSize / 4);
    scribble.scribbleLine(buttonX + buttonSize/4 - 10, buttonY - 635 + 55, buttonX + buttonSize/4 , buttonY - 635 + 45);
    scribble.scribbleLine(buttonX + buttonSize/4, buttonY - 635 + 45, buttonX + buttonSize/4 + 10, buttonY - 635 + 55);

    fill('#FFB6C1');
    // down
    scribble.scribbleEllipse(buttonX + buttonSize/4, buttonY - 570 + 50, buttonSize / 4, buttonSize / 4);
    scribble.scribbleLine(buttonX + buttonSize/4 - 10, buttonY - 570 + 45, buttonX + buttonSize/4 , buttonY - 570 + 55);
    scribble.scribbleLine(buttonX + buttonSize/4, buttonY - 570 + 55, buttonX + buttonSize/4 + 10, buttonY - 570 + 45);

  // + - controls
    // PLUS
    // stroke('#b9e7ff');

    fill('#b9e7ff');

    scribble.scribbleEllipse(buttonX + buttonSize/4, buttonY - 505 + 50, buttonSize / 4, buttonSize / 4);
    scribble.scribbleLine(buttonX + buttonSize/4, buttonY - 505 + 40, (buttonX + buttonSize/4), (buttonY - 505 + 60));
    
    scribble.scribbleLine(buttonX + buttonSize/4 - 10, buttonY - 505 + 50, (buttonX + buttonSize/4 + 10), (buttonY - 505 + 50));
    // fill('white');
    // stroke('#b9e7ff');
    fill('#b9e7ff');

    // MINUS
    scribble.scribbleEllipse(buttonX + buttonSize/4, buttonY - 440 + 50, buttonSize / 4, buttonSize / 4);
    stroke('black');

    scribble.scribbleLine(buttonX + buttonSize/4 - 10, buttonY - 440 + 50, buttonX + buttonSize/4 + 10, buttonY - 440 + 50);
    // scribble.scribbleLine(buttonX, buttonY - 250,buttonX + 60, buttonY - 250);


    // clock
    fill('white');

    scribble.scribbleEllipse(buttonX, buttonY - 250, buttonSize, buttonSize);
    scribble.scribbleLine(buttonX, buttonY - 250,buttonX + 60, buttonY - 250);
    scribble.scribbleLine(buttonX, buttonY - 250,buttonX + 20, buttonY - 270)
    fill('#b9e7ff');
    scribble.scribbleEllipse(buttonX, buttonY - 50, buttonSize, buttonSize);
    // rect(-120, 1750, 1120, 200);
    stroke('black');
    fill('black');


    // INFO
    textSize(100);
    // text("?",buttonX  - 30,buttonY - 10 );
    noFill();
    //I
    // scale(2);
    scribble.scribbleLine(buttonX - 55, buttonY - 60, buttonX - 55, buttonY-30);
    // scribble.scribbleEllipse(buttonX - 45, buttonY - 70, 2, 2);
    //N
    scribble.scribbleLine(buttonX - 35, buttonY - 60, buttonX - 35, buttonY-30);
    scribble.scribbleLine(buttonX - 35, buttonY - 60, buttonX - 15, buttonY-30);
    scribble.scribbleLine(buttonX - 15, buttonY - 60, buttonX - 15, buttonY-30);
    //F
    scribble.scribbleLine(buttonX + 5, buttonY - 60, buttonX + 5, buttonY-30);
    scribble.scribbleLine(buttonX + 5, buttonY - 60, buttonX + 20, buttonY-60);
    scribble.scribbleLine(buttonX + 10, buttonY - 45, buttonX + 25, buttonY-45);
    //O
    scribble.scribbleEllipse(buttonX + 50, buttonY - 45, 25, 30);

    // stroke(strokeColor);
}



function changeBackgroundColor() {
    backgroundColor = color(random(200,255),random(200,255),random(200,255));
    strokeColor = color(random(200,255),random(200,255),random(200,255));
}


function windstrokes(starting_index) {
    // translate(width/2, height/2); // center the lines
    translate(118, 120);
    strokeWeight(20);
    // fill(strokeColor);
    scale(0.1);
    // scale(.6) // debugging
    scale(extraScale);
    if (zoom_level == 6) {
      translate(150, 200);
    }
  
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
    slice_range = range(range_size, starting_index); // [0, 1, 2, ... 155]

    for (i=0; i<slice_range.length; i++) {
        // if(i==2) { // HEYA: comment this out; this is for debugging purposes
        draw_type(wind_data_slices[slice_range[i]], grid_centers[i][0], grid_centers[i][1])
        // } // HEYA: comment this out; this is for debugging purposes
    }
    // print("HEYA! grid_centers: ", grid_centers)

    scale(1/extraScale);
    if (zoom_level == 6) {
      translate(-150, -200);
    }
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
      if (i==0 && show_time === true) {
        fill('gray');
        textSize(140);

        date = time.slice(0,10);
        newTime = time.slice(10,20);
        // print("oldDate:", oldDate);
        // print("date: ", date);
        if (oldDate != date) {
            ellipse(100, 100, 500, 500);
            text(date, s_x-400, s_y+700);
        }
        text(newTime, s_x-320, s_y+750);
        oldDate = date;
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
    // console.log("created fibers")
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




const modalText = "If wind could write, what would its letters look like?<br/><br/> <b>Wind Typography</b> is an imaginative typography based on local wind data. A weather meter station connected to arduino was installed on the art buildings of Aalto campus (Marsio and Varë) to record speed and direction of the current wind every several seconds.<br/><br/>The data was then entered as parameters to a  series of rules on p5.js. The rules were inspired by Hangul, the writing system of Korea. Hangul combines consonants (represented by shapes like circles and rectangles) and vowels (reprsented by lines) to create a single syllable unit. <br/><br/> Each 'stroke' represents a single wind data (speed and direction), and five consecutive wind 'strokes' combine into one unit. If the speed is smaller than 10mph, the wind is represented as a short line in one of four directions (0, 90, 180, and 270 degrees). If the speed is bigger than 10mph, the wind is represented as a circle instead of a line.<br/><br/>To navigate through the strokes, click on the upper or lower left of the screen."