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
    d3.selectAll(".description").remove();
}

var toggleModalText = function(btn) {
    var contentEl = btn.parentElement.querySelector(".modal-text-content")
    contentEl.classList.toggle("expanded")
    btn.textContent = contentEl.classList.contains("expanded") ? "See less" : "See more"
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

            // normalize missing/blank values so they don't create empty phantom rows
            var yFilterColumns = ["empire_or_culture", "found_region_modern_large",
                "writing_material", "media_material", "form", "script_type",
                "script_direction", "subject_topic"]

            data.forEach(d => {
                yFilterColumns.forEach(col => {
                    if (!d[col] || d[col].trim() === '') {
                        d[col] = 'unknown'
                    }
                })
            })


        d3.select("body")
            .selectAll("button")
            .data(yFilterColumns)
            .join("button")
            .text(d => d)
            .attr('class','filter-button')
            .on("click", function(e,col) {
                d3.selectAll(".filter-button").classed("active", false)
                updateYLabel(`${col}`)
                d3.select(this).classed("active", true)
            })

        d3.select("body")
            .append("button")
            .attr('id',"noneButton")
            .attr('class','filter-button active')  // starts active by default
            .data(["none"])
            .join("button")
            .text("no filter")
            .on("click", function(e,col) {
                d3.selectAll(".filter-button").classed("active", false)
                updateYLabel(`${col}`)
                d3.select(this).classed("active", true)
            })

                d3.select("body")
                    .append("button")
                    .attr('id',"infoButton")
                    .data(info)
                    .text("on writing")
                    .style("position","fixed")
                    .style("right","20px")
                    .style("background-color","white")
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
                        .style("position","fixed")
                        .style("right","112px")
                        .style("background-color","white")
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
            svg.append("defs")
                .append("clipPath")
                .attr("id", "roundedImageClip")
                .attr("clipPathUnits", "objectBoundingBox")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .attr("rx", 0.1)
                .attr("ry", 0.1)

            svg.select("defs")
                .append("filter")
                .attr("id", "squigglyBorder")
                .attr("x", "-20%")
                .attr("y", "-20%")
                .attr("width", "140%")
                .attr("height", "140%")
                .html(`
                    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" seed="3"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                `)

            svg.select("defs")
                .append("filter")
                .attr("id", "squigglyText")
                .attr("x", "-50%")
                .attr("y", "-50%")
                .attr("width", "200%")
                .attr("height", "200%")
                .html(`
                    <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="noise" seed="7"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
                `)
        

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
                if (numbers === true) {
                    colArr = data.map(d=>+d[col])
                    colArr = colArr.sort(function(a, b) {
                        return a - b;
                    });
                } else {
                    colArr = data.map(d=>d[col])
                }
                colArr = colArr.filter((element,index,array) => array.indexOf(element) == index)

                // evenly distribute categories across svgHeight with no rounding drift
                let yScale = d3.scaleBand()
                    .domain(colArr)
                    .range([0, svgHeight])
                    .paddingInner(0)

                let obj = {}
                colArr.forEach(cat => {
                    obj[cat] = yScale(cat)
                })

                yHeight = yScale.bandwidth()   // keep this assignment as-is, other code reads the global
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
                
                if(filter == "distance_from_origin_km") {
                    console.log('Hi')
                    obj["unknown"] = obj["-10"]; 
                    delete obj["-10"];  
                }

                var uniqueCategories = Object.keys(obj).filter(k => k !== 'yHeight')
                var rowHeight = filter == "none" ? imageWidth : obj.yHeight   // single source of truth

                var imgInset = Math.max(3, rowHeight * 0.12)
                var imgSize = rowHeight - imgInset * 2

                svg
                    .selectAll(".yLines")
                    .data(uniqueCategories)
                    .join('line')
                    .attr('x1', 0)
                    .attr('y1', (cat) => svgHeight - (obj[cat]) - (rowHeight))
                    .attr('x2', timelineWidth)
                    .attr('y2', (cat) => svgHeight - (obj[cat]) - (rowHeight))
                    .attr("fill", "white")
                    .attr('stroke', '#0048ff')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '2 4')
                    .attr('opacity', 0.8)
                    .attr('class','yLines')

                svg.selectAll(".yLines-bottom").remove()
                svg.append("line")
                    .attr("class", "yLines-bottom")
                    .attr('x1', 0)
                    .attr('y1', svgHeight)
                    .attr('x2', timelineWidth)
                    .attr('y2', svgHeight)
                    .attr('stroke', '#0048ff')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '2 4')
                    .attr('opacity', 0.8)

                var timelineBorders = svg.selectAll(".image-border")
                    .data(data)
                    .join('rect')
                    .attr("class", "image-border")
                    .attr("fill", "none")
                    .attr("stroke", "#a8241b")
                    .attr("stroke-width", 2)
                    .attr("rx", rowHeight * 0.1)
                    .style("filter", "url(#squigglyBorder)")
                    .lower()

                var timeline = svg.selectAll("image")
                    .data(data)
                    .join('svg:image')
                    .attr("xlink:href", (d,i) => icon_names[i])
                    .attr("clip-path", "url(#roundedImageClip)")
                    .on('mouseover', function(e,d){
                        if (d._hovering) return
                        d._hovering = true

                        let scaleFactor = imageZoomWidth / imgSize   // ← changed from rowHeight to imgSize
                        d3.select(this)
                            .style("transform", `scale(${scaleFactor})`)
                            .classed("top-layer", true)
                            .raise()

                        let bbox = this.getBBox()

                        let scaledWidth = bbox.width * scaleFactor
                        let scaledHeight = bbox.height * scaleFactor
                        let centerX = bbox.x + bbox.width / 2
                        let centerY = bbox.y + bbox.height / 2
                        
                        // squiggly red outline, offset a few px from the image edge
                        let padding = 10
                        svg.append("rect")
                            .attr("class", "hover-outline")
                            .attr("x", centerX - scaledWidth/2 - padding)
                            .attr("y", centerY - scaledHeight/2 - padding)
                            .attr("width", scaledWidth + padding * 2)
                            .attr("height", scaledHeight + padding * 2)
                            .attr("fill", "none")
                            .attr("stroke", "#5cff69")
                            .attr("stroke-width", 5)
                            .attr("rx", 60)
                            .style("filter", "url(#squigglyBorder)")
                            .style("pointer-events", "none")

                        let tooltipWidth = 300
                        let tooltipHeight = 260

                        let previewX = centerX + scaledWidth / 2 + 20
                        let previewY = centerY - tooltipHeight / 2

                        if (previewX + tooltipWidth > timelineWidth - 10) {
                            previewX = centerX - scaledWidth / 2 - tooltipWidth - 20
                        }

                        previewY = Math.max(10, Math.min(previewY, svgHeight - tooltipHeight - 10))

                        svg.selectAll("foreignObject").remove()

                        svg.append("foreignObject")
                        .style('pointer-events','none')
                        .attr("width", tooltipWidth)
                        .attr("height", 500)
                        .attr("x", previewX)
                        .attr("y", previewY)
                        .append("xhtml:body")
                            .style("font", "13px sans-serif")
                            .style("line-height", "1.5")
                            .style("padding", "16px")
                            .style("background-color", "#f7f3ed")
                            .style("border", "1px solid #d8cfc4")
                            .style("border-radius", "2px")
                            .style("box-shadow", "0 8px 24px rgba(43, 38, 34, 0.25)")
                            .style("color", "#2b2622")
                            .html(`<div><b style="font-family: 'Lacquer', serif; font-size: 15px;">${d.name}</b> <span style="color:#8a8074">(${d.date})</span><br/><br/><span class="underline">Found region</span>: ${d.found_region_origin} <br/><span class="underline">Current location</span>: ${d.current_city}, ${d.current_country} <br/><span class="underline">Distance from origin to current</span>: ${d.distance_from_origin_km} km <br/><span class="underline">Topic</span>: ${d.subject_topic} / ${d.subject}<br/><span class="underline">Medium</span>: <i>${d.writing_material}</i> on <i>${d.media_material2}</i></div>`)
                    })
                    .on('mouseout', function(e,d) {
                        d._hovering = false
                        svg.select('.preview').remove()
                        svg.selectAll("foreignObject").remove()
                        svg.selectAll(".hover-outline").remove() 

                        d3.select(this)
                            .style("transform", null)
                            .classed("top-layer", false)
                            .lower()
                    })
                    .on("click", function(e,d) {
                        d3.selectAll(".description").remove();

                        var modalDiv = d3.select("body").append("div")
                            .attr("class", "description")
                            .style("opacity", 1)
                            .html(
                                `<div class='modal-outline-wrapper'><div class='modal-content'><span class='close' onclick='closeModal()'>&times;</span><div class='flex-container'><div class='modal-img-container'><img class='modal-image' src='${image_names[data.indexOf(d)]}' /></div> <div class="modal-text"><b>${d.name}</b><br/> ${d.date} <br/><br/><div class="modal-text-content">Ruling state: ${d.empire_or_culture} <br/> ${d.period} <br/> Found in: ${d.found_region_origin}<br/> Currently in: ${d.current_city}, ${d.current_country}<br/><br/>Script type: ${d.script_type}<br/>Reading direction: ${d.script_direction}<br/><br/>Distance between origin and current location: ${d.distance_from_origin_km} km<br/><br/> ${d.description} <br/><br/>source(s):<br/>${d.source_url}<br/>${d.img_or_source2_url}<div class="modal-text-fade"></div></div><button class="see-more-btn" onclick="toggleModalText(this)">See more</button></div></div></div></div>`
                                )
                            .style("left", (d.x + 50 + "px"))
                            .style("top", (d.y - 50 +"px"))
                            .classed('modal', true)
                            .style('display','flex')
                            .on("click", function(event) {
                                // only close if the click landed directly on the backdrop (this element),
                                // not on the modal card or anything inside it
                                if (event.target === this) {
                                    closeModal()
                                }
                            })

                        setTimeout(() => {
                            var contentEl = modalDiv.select(".modal-text-content").node()
                            var button = modalDiv.select(".see-more-btn").node()
                            var fade = modalDiv.select(".modal-text-fade").node()

                            if (contentEl.scrollHeight <= contentEl.clientHeight) {
                                button.style.display = "none"
                                fade.style.display = "none"
                            }
                        }, 0)
                    })
                    .transition()
                    .duration(200)
                    .attr("height", imgSize)
                    .attr("width", imgSize)
                    .attr("x", function(d){ 
                        let baseX = filter == "none" ? timeScale(d.date_estimate) + 40 : timeScale(d.date_estimate) + rowHeight
                        return baseX + imgInset
                    })
                    .attr("y", (d) => {
                        let baseY = filter == "none" ? svgHeight/2 : svgHeight - (obj[d[filter]]) - (rowHeight)
                        return baseY + imgInset
                    })

                    timelineBorders
                        .transition()

                    .duration(200)
                    .attr("width", rowHeight)
                    .attr("height", rowHeight)
                    .attr("rx", rowHeight * 0.1)
                    .attr("x",function(d){ 
                        return filter == "none" ? timeScale(d.date_estimate) + 40 : timeScale(d.date_estimate) + rowHeight
                    })
                    .attr("y",(d) => filter == "none" ? svgHeight/2 : svgHeight - (obj[d[filter]]) - (rowHeight))
                svg.select(".row_label").remove()

                svg.selectAll(".row_label")
                    .data(uniqueCategories)
                    .join("text")
                    .text(d => d)
                    .attr('x',20)
                    .attr('y',(cat)=>svgHeight - (obj[cat]) - (rowHeight/2))
                    .attr('class','row_label')

                svg.append("line")
                .attr("x1",function(d){return timeScale(150)})
                .attr("y1",0)
                .attr("x2",function(d){return timeScale(150)})
                .attr("y2",900)
                .attr("stroke","#a8241b")
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
                .attr('class', 'time_label')
            
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

            