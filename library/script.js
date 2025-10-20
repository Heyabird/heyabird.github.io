var libraryWidth = 1200;
var libraryHeight = 250;

// var button = d3.select("body")
//     .append("button")
//     .attr("id", "noneButton")
//     .data(["none"])
//     .join("button")
//     .text("alphabetical")
//     .style("background-color", "red")

var title = d3.select("body")
    .append("h2")
    .attr("id", "title")
    .join("button")
    .text("2025")
    .style("text-align", "center")

var svg = d3.select('body')
    .append('svg')
    .attr('width',libraryWidth)
    .attr('height',libraryHeight)
    .style('background-color', '#ffc2f6')
    .style('display', 'block')
    .style('margin', '0 auto');

    // Library Rows
    svg.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', libraryWidth)
        .attr('height', libraryHeight/3)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    svg.append("rect")
        .attr('x', 0)
        .attr('y', libraryHeight/3)
        .attr('width', libraryWidth)
        .attr('height', libraryHeight/3)
        .attr('stroke', 'black')
        .attr('fill', 'white');

    svg.append("rect")
        .attr('x', 0)
        .attr('y', libraryHeight/3*2)
        .attr('width', libraryWidth)
        .attr('height',libraryHeight/3)
        .attr('stroke', 'black')
        .attr('fill', 'white');


d3.csv("./library.csv").then(function(data){
    console.log("data: ", data);
    // Books and Films
    svg.append("clipPath")
        .attr("id", "photoClip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 200)
        .attr("rx", 10)

    svg.append("image")
        .attr("href", "assets/crime_and_punishment_thumbnail.jpg")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", libraryHeight/3)
        .attr("height", libraryHeight/3)

    svg.append("image")
        .attr("href", "assets/crime_and_punishment_thumbnail.jpg")
        .attr("x", 0)
        .attr("y", libraryHeight/3)
        .attr("width", libraryHeight/3)
        .attr("height", libraryHeight/3)    
        .attr("clip-path", "url(#photoClip)");

        addLabel(8, 0, "favorites")
        addLabel(8, (libraryHeight/3), "books")
        addLabel(8, (libraryHeight/3 * 2), "films")
    })



function addLabel(x, y, labelText) {
    var label = svg.append("g")
        .attr("transform", `translate(${x}, ${y + 20})`)
        .attr("class", "label");

    var text = label.append("text")
        .text(labelText)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "white")
        .attr("font-size", "18px")
        .attr("font-family", "sans-serif");

    // getBBox returns bounding box of an element as a rectangle by x, y, width, and height
    var bbox = text.node().getBBox();

    label.insert("rect", "text")
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 4)
        .attr("width", bbox.width + 16) // add horizontal padding
        .attr("height", bbox.height + 8) // add vertical padding
        // .attr("rx", 6) // rounded corners
        .attr("fill", "#0000ad");
}

svg.selectAll(".label").raise()