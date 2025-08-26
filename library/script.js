// var filters = d3.select("body")
//     .append("div")
//     .attr("id", "filters")

var svg = d3.select('body')
    .append('svg')
    .attr('width',800)
    .attr('height',800)
    .style('background-color', '#ffc2f6')

d3.csv("./library.csv").then(function(data){
    
    var dataVis = svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr('x', 10)
        .attr('y', 120)
        .attr('width', 600)
        .attr('height', 40)
        .attr('stroke', 'black')
        .attr('fill', '#69a3b2');
    })