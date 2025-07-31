// Get the modal
var modal = document.getElementById("myModal");


// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// console.log('btn:',btn)
// When the user clicks on the button, open the modal
// btn.onclick = function() {
//     openModal()
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     console.log('span clicked')
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

// function openModal() {
//     console.log("openModal called!")
//     modal.style.display = "block";


// }

var info = "<div id='info-box'><b>What defines a writing?</b><br/><br/>Writing systems typically satisfy three criteria. <br/><br/>First, the writing must have some purpose or meaning to it, and a point must be communicated by the text. <br/>Second, writing systems make use of specific symbols which may be recorded on some writing medium.<br/>Third, the symbols used in writing generally correspond to elements of spoken language. In general, systems of symbolic communication like signage, painting, maps, and mathematical notation are distinguished from writing systems, which require knowledge of an associated language to read a text.<br/><br/><br/><b>The origins of writing</b><br/><br/>Before the 20th century, most scholarly theories of the origins of writing involved some form of monogenesis, the assumption that writing had been invented only once as cuneiform in ancient Sumer, and spread across the world from there via cultural diffusion. According to these theories, writing was such a particular technology that exposure through activities like trade was a much more likely means of acquisition than independent reinvention. Specifically, many theories were dependent on a literal account of the Book of Genesis, including the emphases it placed on Mesopotamia.<br/><br/>Over time, greater awareness of the systems of pre-Columbian Mesoamerica conclusively established that writing had been independently invented multiple times. Four independent inventions of writing are most commonly recognized in Mesopotamia (c. 3400–3100 BC), Egypt (c. 3250 BC), China (before c. 1250 BC), and Mesoamerica (before c. 1 AD).<br/><br/>Source: https://en.wikipedia.org/wiki/History_of_writing</div>"
var dataset_info = "<div id='info-box'><b>Where did you get your data?</b><br/><br/>I researched what are some of the oldest writings from different parts of the world. Then, I handpicked some of the most iconic ones and manually scraped information about them, mainly using Wikipedia. You can see the source of the description and image in the modal that pops out once you click on an image in the timeline.<br/><br/><br/><b>How did you know which writings to pick?</b><br/><br/>I tried to choose a writing of a unique medium from each civilization listed here. The choice also depended a lot on what data (including images) was available and accessible online.<br/><br/><br/><b>Why are you doing this project?</b><br/></br>I’m personally interested in the history of writing, so I decided to explore how writing began in human history. It turns out that there are many different beginnings (with different motivations, tools, etc). I also wanted to practice d3.js and data visualization in general. This was my first attempt at it.</div>"


var closeModal = function() {
    console.log("HELLO")
    modal = document.getElementsByClassName("description")[0];
    console.log('modal:',modal)
    modal.style.display = "none";

}


// web version
const timelineWidth = 1500

// igloo version
// const timelineWidth = 5400

var svgHeight = 670
var imageWidth = 60

// filter first, then svg
var filters = d3.select("body")
    .append("div")
    .attr("id", "filters")
        
        d3.csv("./early_writings.csv").then(function(data){
            var yFilterColumns = ["empire_or_culture",
            "found_region_modern_large",
            // "found_region_modern",
            // "current_country",
            // "distance_from_origin_km",
                "writing_material",
                "media_material",
                "form",
                "script_type",
                "script_direction",
                "subject_topic",
                // "none"
            ]


            d3.select("body")
                .selectAll("button")
                .data(yFilterColumns)
                .join("button")
                .text(d => d)
                .attr('class','filter-button')
                .on("click", function(e,col) {

                    d3.selectAll(".filter-button")
                    .style("background-color", "#cccbcb")
                    console.log(col)
                    
                    // updateYLabel("media_material")
                    updateYLabel(`${col}`)

                    d3.select(this)
                        .transition()
                        .style("background-color", "#c98a4f")
                })

            d3.select("body")
                .append("button")
                .attr('id',"noneButton")
                .attr('class','filter-button')
                .data(["none"])
                .join("button")
                .text("no filter")
                .style("background-color", "#c98a4f")
                .on("click", function(e,col) {
                    d3.selectAll(".filter-button")
                    .style("background-color", "#cccbcb")
                    
                    updateYLabel(`${col}`)
                    d3.select(this)
                        .transition()
                        .style("background-color", "#c98a4f")
 
                })

                d3.select("body")
                    .append("button")
                    .attr('id',"infoButton")
                    .data(info)
                    .text("on writing")
                    .style("background-color", "white")
                    // .style("stroke", "1px black")
                    // .style("stroke", "1px")
                    .style("position","fixed")
                    .style("right","20px")
                    .style("text-decoration","underline")
                    .on("mouseover", function(e,col) {
                        svg.append("foreignObject")
                        .style('pointer-events','none')
                        .attr("width", 800)
                        .attr("height", 440)
                        .attr("x",timelineWidth - 800)
                        .attr("y",0) // HEYA
                        .append("xhtml:div")
                            .style("font", "12px 'Helvetica Neue'")
                            .style("padding","13px")
                            .style("background-color","white")
                            .style("height","800px")
                            .style("stroke","black")
                            // .style("width","800px")
                            .html(`${info}`)
                    })
                    .on("mouseout", function(e,col) {
                        svg.selectAll("foreignObject").remove()
                    })

                d3.select("body")
                    .append("button")
                    .attr('id',"datasetInfoButton")
                    .data(dataset_info)
                    .text("on this project")
                    .style("background-color", "gray")
                    // .style("stroke", "1px black")
                    // .style("stroke", "1px")
                    .style("position","fixed")
                    .style("right","100px")
                    .style("text-decoration","underline")
                    .on("mouseover", function(e,col) {
                        svg.append("foreignObject")
                        .style('pointer-events','none')
                        .attr("width", 800)
                        .attr("height", 335)
                        .attr("x",timelineWidth - 800)
                        .attr("y",0) // HEYA
                        .append("xhtml:div")
                            .style("font", "12px 'Helvetica Neue'")
                            .style("padding","13px")
                            .style("background-color","white")
                            .style("height","800px")
                            .style("stroke","black")
                            // .style("width","800px")
                            .html(`${dataset_info}`)
                    })
                    .on("mouseout", function(e,col) {
                        svg.selectAll("foreignObject").remove()
                    })

                            
            var svg = d3.select("body").append("svg")
            .attr("width",timelineWidth)
            .attr("height",svgHeight + 50)
            // .style('margin','0 10')
            
        

            var allDates = data.map(function(row){ return +row.date_estimate})
            var timeScale = d3.scaleLinear(d3.extent(allDates), [50,timelineWidth - imageWidth - 40])
            console.log('data.length: ', data.length)



            let materialToY = createFilterObject("media_material")
            let empireToY = createFilterObject("empire_or_culture")
            let scriptToY = createFilterObject("script_type")
            let currentCountryToY = createFilterObject("current_country")
            let distanceFromOriginToY = createFilterObject("distance_from_origin_km",true)
            let foundRegionModernToY = createFilterObject("found_region_modern")
            let foundRegionToY = createFilterObject("found_region_modern_large")
            let scriptDirectionToY = createFilterObject("script_direction")
            let subjectTopicToY = createFilterObject("subject_topic")
            let writingMaterialToY = createFilterObject("writing_material")
            let formToY = createFilterObject("form")
            var yHeight

            function createFilterObject(col, numbers = false) {
                // FILTER - y axis

                // only get the unique items

                if (numbers === true) {
                    colArr = data.map(d=>+d[col])
                    colArr = colArr.sort(function(a, b) {
                        return a - b;
                    });
                } else {
                    colArr = data.map(d=>d[col])
                }
                colArr = colArr.filter((element,index,array) => array.indexOf(element) == index)

                // turn array into object
                let obj = {}
                yHeight = Math.floor((svgHeight / colArr.length))

                for (let i = 0; i < colArr.length; i++) {
                    obj[colArr[i]] = yHeight * i;
                }
                obj['yHeight'] = yHeight
                return obj
            }


            // FILTER TIME for x axis (time)
            let first_year =-3200
            let last_year = 1200
            let num_years = Math.abs(first_year - last_year)
            let year_sub_range = Math.floor(num_years / 10)
            let year_full_range = [first_year,last_year]
            var years_array = []
            let yearToX = {}
            for (let i = -3200; i <= 1200; i+=year_sub_range) {
                years_array.push(i)
            }
            console.log("years_array: ", years_array)
            console.log("timeScale(years_array[1]): ", timeScale(years_array[2]))

            const rowNameToObject = {
                'media_material': materialToY,
                'empire_or_culture': empireToY,
                'script_type': scriptToY,
                'current_country': currentCountryToY,
                'distance_from_origin_km': distanceFromOriginToY,
                'found_region_modern': foundRegionModernToY,
                'found_region_modern_large': foundRegionToY,
                'script_direction': scriptDirectionToY,
                'subject_topic': subjectTopicToY,
                'writing_material': writingMaterialToY,
                'form': formToY,
                'none':{}
            }

            

            // ROW LABELS (Y)
            function updateYLabel(filter) {
                var obj = rowNameToObject[filter]
                let imageZoomWidth = 125
                
                // this one deals with number so we might have to do something about that
                if(filter == "distance_from_origin_km") {
                    console.log('Hi')
                    obj["unknown"] = obj["-10"]; 
                    delete obj["-10"];  
                }

                svg
                    .selectAll(".yLines")
                    .data(data)
                    .join('line')
                    .attr('x1', 0)
                    // .attr('y', 0)
                    .attr('y1',(d) => svgHeight - (obj[d[filter]]) - (imageWidth))
                    .attr('x2', timelineWidth)
                    .attr('y2', (d) => svgHeight - (obj[d[filter]]) - (imageWidth))
                    .attr("fill", "white")
                    .attr('stroke', '#a7afdb')
                    .attr('opacity', 0.5)
                    .attr('class','yLines')

                
                // combine
                var timeline = svg.selectAll("image")
                    .data(data)
                    .join('svg:image')
                    .attr("xlink:href", (d,i) => icon_names[i])
                    // .transition()
                    

                // HOVER EFFECTS - show preview boxes!
                    .on('mouseover', function(e,d){
                        let moveRight
                        if (d.date_estimate < 0) {
                            moveRight = 170
                        } else {
                            moveRight = -255
                        }
                        svg.append("foreignObject")
                        .style('pointer-events','none')
                        .attr("width", 300)
                        .attr("height", 500)
                        .attr("x",filter == "none" ? timeScale(d.date_estimate) + 32 : timeScale(d.date_estimate) + moveRight)
                        .attr("y",filter == "none" ? svgHeight/2 + imageZoomWidth : svgHeight - (obj[d[filter]]) - (imageZoomWidth) + 57) // HEYA
                        .append("xhtml:body")
                            .style("font", "12px 'Helvetica Neue'")
                            .style("padding","3px")
                            .style("background-color","#c98a4f")
                            .html(`<div><b>${d.name}</b> (${d.date})<br/><span class="underline">Found region</span>: ${d.found_region_origin} <br/><span class="underline">Current location</span>: ${d.current_city}, ${d.current_country} <br/><span class="underline">Distance from origin to current</span>: ${d.distance_from_origin_km} km <br/><span class="underline">Topic</span>: ${d.subject_topic} / ${d.subject}<br/><span class="underline">Medium</span>: <i>${d.writing_material}</i> on <i>${d.media_material2}</i></div>`)
                        console.log('this:', this)

                        d3.select(this).attr("height", imageZoomWidth)
                            .attr("width", imageZoomWidth)
                            .classed("top-layer", true)
                            .raise()

                    })
                    .on('mouseout', function(e,d) {
                        d3.select("div").remove()
                        svg.select('.preview').remove()
                        svg.select("foreignObject").remove()

                        d3.select(this)
                            .attr("height", filter == "none" ? imageWidth : obj.yHeight)
                            .attr("width", filter == "none" ? imageWidth : obj.yHeight)
                            .lower()
                    })
                    .on("click", function(e,d) {
                        console.log('on click e:', e)
                        var modalDiv = d3.select("body").append("div")
                            .attr('pointer-events', 'none')
                            .attr("class", "description")
                            .style("opacity", 1)
                            .html(
                                `<div class='modal-content'><span class='close' onclick='closeModal()'>&times;</span><div class='flex-container'><div class='modal-img-container'><img class='modal-image' src='${image_names[data.indexOf(d)]}' height='400'/></div> <p class="modal-text"><b>${d.name}</b><br/> ${d.date} <br/><br/>Ruling state: ${d.empire_or_culture} <br/> ${d.period} <br/> Found in: ${d.found_region_origin}<br/> Currently in: ${d.current_city}, ${d.current_country}<br/><br/>Script type: ${d.script_type}<br/>Reading direction: ${d.script_direction}<br/><br/>Distance between origin and current location: ${d.distance_from_origin_km} km<br/><br/> ${d.description} <br/><br/>source(s):<br/>${d.source_url}<br/>${d.img_or_source2_url}</p></div></div>`
                                )
                            .style("left", (d.x + 50 + "px"))
                            .style("top", (d.y - 50 +"px"))
                            //modal-making...
                            .classed('modal', true)
                            .style('display','block')
                            console.log('on click d:', d)

                        //                         .attr("width", 230)
                        // .attr("height", 500)
                        // .attr("x",timeScale(d.date_estimate) + 90)
                        // .attr("y",svgHeight - (obj[d[filter]]) - (imageWidth))
                        // .append("xhtml:body")
                        //     .style("font", "14px 'Helvetica Neue'")
                        //     .html(`<b>${d.name}</b> <br/> ${d.date} <br/> ${d.empire_or_culture} <br/> ${d.media_material2}`)

                        d3.select("span")
                            .on("click",function(e,d){
                                console.log('test!')
                        })
                    })
                    .transition()
                    .attr("height", filter == "none" ? imageWidth : obj.yHeight)
                    .attr("width", filter == "none" ? imageWidth : obj.yHeight)
                    .attr("x",function(d){ 
                        console.log('obj : ', obj)
                        return filter == "none" ? timeScale(d.date_estimate) + 40 : timeScale(d.date_estimate) + yHeight
                    })
                    .attr("y",(d) => filter == "none" ? svgHeight/2 : svgHeight - (obj[d[filter]]) - (imageWidth))


                svg.select(".row_label").remove()

                    svg.selectAll(".row_label")
                    .data(data)
                    .join("text")
                    .text(d => d[filter])
                    .attr('x',20)
                    .attr('y',(d)=>svgHeight - (obj[d[filter]]) - (imageWidth/2))
                    .attr('class','row_label')
                    // .attr('fill',"#a8241b")

                // dark red vertical line that sepearts BCE to CE
                svg.append("line")
                .attr("x1",function(d){return timeScale(150)})
                .attr("y1",0)
                .attr("x2",function(d){return timeScale(150)})
                .attr("y2",900)
                .attr("stroke","#a8241b") // dark red
                .attr("stroke-width","2")
                .attr("stroke-dasharray","0 6")
                .attr("stroke-linecap","round")
            }
            updateYLabel("none") // HEYA; change this!

            // // COLUMN LABELS (TIME)
            svg.selectAll(".time_label")
                .data(data)
                .join("text")
                .text((d,i) => years_array[i])
                .attr('x',(d,i) => timeScale(years_array[i]) + 40)
                .attr('y',svgHeight + 40)
                .attr('fill',"#a8241b")
            
            svg.append("text")
                .attr("x",timeScale(210))
                .attr("y",30)
                .text('CE')
                .style('fill',"#a8241b")
            svg.append("text")
                .attr("x",timeScale(-20))
                .attr("y",30)
                .text('BCE')
                .style('fill',"#a8241b")
        })

            