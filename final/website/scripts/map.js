


function drawMap(data, neighbors){
    console.log("Drawing Word Map")

    // console.log(data)
    // console.log(neighbors)


    graph = {}

    

    if(neighbors != undefined){
        for(let pair of neighbors){
            let src = pair[0]
            let trg = pair[1]
            if(graph[src] == undefined)
                graph[src] = []
            if (graph[trg] == undefined)
                graph[trg] = []
            graph[src].push(trg)
            graph[trg].push(src)
        }
    } else {
        for(let tword of data.map(x => x.word)){
            graph[tword] = []
        }
    }


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
        .attr("id", d => "word-" + d.word)
        .attr("class", "node")
        .merge(elements)

    text = elements.append('text')
        .attr("dx", 3)
        .attr("x", d => xScale(d.point[0]))
        .attr("y", d => yScale(d.point[1]))
        .attr("class", "text")
        .style("font-size", "0.3em")
        .style("opacity", 0.0)
        .text(d => "")
        
        
        
    let circles = elements.append('circle')
        .attr("r", 2)
        .attr("cx", d => xScale(d.point[0]))
        .attr("cy", d => yScale(d.point[1]))
        .on("mouseover", mouseOverEvent)
        .on("mouseout", mouseOutEvent)
        .on("click", clickEvent)


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
    d3.selectAll(".node")
        .transition()
        .duration(300)
        .style("opacity", x => x.word != d.word? STATE.NODE.OPACITY.HOVER : STATE.NODE.OPACITY.DEFAULT)
        
    d3.select("g#word-" + d.word + " .text")
    .text(d => d.word)
    .style("opacity", STATE.NODE.OPACITY.DEFAULT)
    
}

function mouseOutEvent(d){
    // d3.select("#info-panel #hover").html("")
    d3.selectAll("g#word-" + d.word + " text")
        .text(d => "")
        .style("opacity", 0.0)
    d3.select(this).style("fill",  getNodeColor)
    d3.selectAll(".node")
        .transition()
        .duration(300)
        .style("opacity", STATE.NODE.OPACITY.DEFAULT)
}


function getNodeColor(x){
    if(STATE.SELECTED.NEIGHBORS.indexOf(x.word) > -1){
        return STATE.NODE.COLOR.NEIGHBOR
    }
    return (STATE.SELECTED.NODES.indexOf(x.word) > -1) ? STATE.NODE.COLOR.SELECTED : STATE.NODE.COLOR.DEFAULT
}

function clickEvent(d){
    let indexInState = STATE.SELECTED.NODES.indexOf(d.word)
    if(indexInState > -1){
        STATE.SELECTED.NODES.splice(indexInState,1)
        STATE.SELECTED.NEIGHBORS = []
    } else{
        STATE.SELECTED.NODES.push(d.word)
        STATE.SELECTED.NEIGHBORS = graph[d.word]
    }

    d3.selectAll(".node")
        .style("fill", getNodeColor)

    d3.selectAll(".scatter-circle")
        .style("fill", getNodeColor)
        .style("opacity", d => (STATE.SELECTED.NODES.indexOf(d.word) > -1) ? STATE.NODE.OPACITY.SELECTED : STATE.NODE.OPACITY.SEARCH)
    

}

function euclideanDistance(v1, v2){
    let total = 0.0
    for(let i in v1){
        total += (v1[i] - v2[i])*(v1[i]-v2[i])
    }
    return Math.sqrt(total)
}

