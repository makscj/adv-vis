


function drawMap(data){
    console.log("Drawing Word Map")

    let buffer = 25

    let svg = d3.select("#word-map svg")
    
    let width = d3.max([window.innerWidth/2, 700])
    // let width = window.innerWidth
    // let height = window.innerHeight
    let height = 500

    svg.attr("width", width + buffer)
        .attr("height", height + buffer)
        .attr("border", 1)

    
    let xScale = d3.scaleLinear()
        .domain([0,1])
        .range([0, width])
    
    let yScale = d3.scaleLinear()
        .domain([0,1])
        .range([0, height])
    

    let elements = svg.selectAll("g").data(data)

    elements.exit().remove()

    elements = elements.enter()
        .append("g")
        .attr("id", d => d.word)
        .attr("class", "node")
        .merge(elements)
        .on("mouseover", mouseOverEvent)
        .on("mouseout", mouseOutEvent)
        .on("click", clickEvent)
        
    let circles = elements.append('circle')
        .attr("r", 2)
        .attr("cx", d => xScale(d.point[0]))
        .attr("cy", d => yScale(d.point[1]))
         .on("mouseover", function(d){
            d3.selectAll("g#" + d.word + " text").style("opacity", 0.0)

            // console.log(pick)
            // pick.style("opacity", 1.0)
        })
        .on("mouseout", function(d){
            d3.selectAll("g#" + d.word + " text").style("opacity", 0.0)
        })
        

    text = elements.append('text')
        .attr("dx", 3)
        .attr("x", d => xScale(d.point[0]))
        .attr("y", d => yScale(d.point[1]))
        .attr("class", "text")
        .style("font-size", "0.7em")
        .style("opacity", 0)
        .text(d => d.word)
        // .on("mouseover", function(d){
        //     d3.select(this).style("opacity", 1.0)
        // })
        // .on("mouseout", function(d){
        //     d3.select(this).style("opacity", 0.0)
        // })



    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function(){         
            svg.selectAll('g').attr("transform", d3.event.transform)
        });

    svg.call(zoom);

    
}

function mouseOverEvent(d){
    console.log(d.word)
    // d3.select("#info-panel #hover").html(d.word)

    d3.select(this).style("fill", STATE.NODE.COLOR.SELECTED)
    d3.selectAll(".node").style("opacity", STATE.NODE.OPACITY.HOVER)
    d3.select(this).style("opacity", STATE.NODE.OPACITY.DEFAULT)
}

function mouseOutEvent(d){
    // d3.select("#info-panel #hover").html("")
    d3.select(this).style("fill",  getNodeColor)
    d3.selectAll(".node").style("opacity", STATE.NODE.OPACITY.DEFAULT)
}


function getNodeColor(x){
    // console.log(x)
    return (STATE.SELECTED.NODES.indexOf(x.word) > -1) ? STATE.NODE.COLOR.SELECTED : STATE.NODE.COLOR.DEFAULT
}

function clickEvent(d){
    let indexInState = STATE.SELECTED.NODES.indexOf(d.word)
    if(indexInState > -1){
        STATE.SELECTED.NODES.splice(indexInState,1)
    } else{
        STATE.SELECTED.NODES.push(d.word)
    }
    
    d3.selectAll(".node")
        .style("fill", getNodeColor)

    d3.selectAll(".scatter-circle")
        .style("fill", getNodeColor)
        .style("opacity", d => (STATE.SELECTED.NODES.indexOf(d.word) > -1) ? STATE.NODE.OPACITY.SELECTED : STATE.NODE.OPACITY.SEARCH)
    

    // console.log(STATE.SELECTED.NODES)
}

function euclideanDistance(v1, v2){
    let total = 0.0
    for(let i in v1){
        total += (v1[i] - v2[i])*(v1[i]-v2[i])
    }
    return Math.sqrt(total)
}

