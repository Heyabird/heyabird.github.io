let table;
let names=[];
function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable('m.csv', 'csv', 'header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}

function setup() {
let filewriter = createWriter('showcase-map.txt');
  for (let r = 49; r < 58; r++){
            filewriter.print(['"properties":']);
    for (let c = 0; c < 7; c++) {
      if (c==0){
      filewriter.print(['{"author": "'+table.getString(r, c)+'",']);
    }
      if (c==1){
      filewriter.print(['"location": "'+table.getString(r, c)+'",']);
    }
      if (c==2){
      filewriter.print(['"title": "'+table.getString(r, c)+'",']);
    }
      if (c==3){
      filewriter.print(['"project_link": "'+table.getString(r, c)+'",']);
    }
      if (c==6){
      filewriter.print(['"occupation": "'+table.getString(r, c)+'"},']);
    }
      
  }
  }    filewriter.close();

}