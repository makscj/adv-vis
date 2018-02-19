function findOne(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};


let clicked = []
let population = 0
let numerator = 0.0
let denominator = 0.0
let adjacent = []
let colorScale = d3.scaleLinear()
        .domain([0.01, 0.065, 0.08, 0.2])
        .range(["steelblue", "lightblue", "lightred", "darkred"]);

function drawMap(topo, neighbors) {
    let _this = this;

    let w = 500, h = 700


    let svg = d3.select("#map-svg")
        .attr("width", w)
        .attr("height", h)

    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);
    svg.call(zoom);

    let geoData = topojson.feature(topo, topo.objects.tl_2016_49_tract);
    
    
    let censusData = geoData.features.map(x => {return {
        "id": x.properties.CENSUS.geoid,
        "name": x.properties.CENSUS.name,
        "emp": parseFloat(x.properties.CENSUS.emp.replace(/,/g, '')),
        "unemp": parseFloat(x.properties.CENSUS.unemp.replace(/,/g, '')),
        "pop": parseFloat(x.properties.CENSUS.pop.replace(/,/g, '')),
        "ur": parseFloat(x.properties.CENSUS.unemp.replace(/,/g, ''))/(parseFloat(x.properties.CENSUS.unemp.replace(/,/g, '')) + parseFloat(x.properties.CENSUS.emp.replace(/,/g, '')))
    }})

    let countyLookup = {}
    for(item of censusData){
        countyLookup[item.id] = item
    }


    // let colorScale = d3.scaleLinear()
    //             .domain([d3.max(censusData.map(x => x.ur)), 0.065/2.0, 0])
    //             .range(["darkred", "lightgray", "steelblue"]);

    
    let path = createPath(geoData,w,h)

    var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let map = d3.select("#map")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("opacity", 0.5)
        .attr("class", "counties")
        .attr("id", function (d) {
            return "id-" + d.properties.GEOID;
        })
        .style("fill", function(d){
            county = d.properties.CENSUS
            let unemp = parseFloat(county.unemp.replace(/,/g, ''))
            let emp =  parseFloat(county.emp.replace(/,/g, ''))
            let ur = unemp/(unemp + emp + 0.0)

            return colorScale(ur)
        })
        //Hover opacity change
        .on("mouseover", function (d) {
            let current = d.properties.GEOID
            let name = d.properties.CENSUS.name.split(",")[1]
            let rate = countyLookup[current].unemp/(countyLookup[current].unemp+countyLookup[current].emp)
            rate = Math.round(rate*1000)/1000
            d3.select("#county-name").html(name)
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            
                tooltip.html(name + "<br/>"  + "pop: " + countyLookup[current].pop + "<br/>ur: " + rate)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

        })
        .on("mouseout", function (d) {
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);

        })
        .on("click", d => clickCounty(d, countyLookup, neighbors, censusData))


        function zoomed() {
            map.style("stroke-width", 1.0 / d3.event.transform.k + "px");
            map.attr("transform", d3.event.transform); // updated for d3 v4
        }
}

function createPath(geoData, w, h){
    var center = d3.geoCentroid(geoData)
    var scale  = 300;
    var offset = [w/2, h/2];
    var projection = d3.geoMercator().scale(scale).center(center)
        .translate(offset);

    // create the path
    var path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use 
    // these to determine better values for the scale and translation
    var bounds  = path.bounds(geoData);
    var hscale  = scale*w  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*h / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [w - (bounds[0][0] + bounds[1][0])/2,
                    h - (bounds[0][1] + bounds[1][1])/2];

    // new projection
    projection = d3.geoMercator().center(center)
    .scale(scale).translate(offset);
    path = path.projection(projection);
    return path
}

function updateGlobals(dataBlock, direction){
    population = population + direction*dataBlock.pop
    numerator = numerator + direction*dataBlock.unemp
    denominator = denominator + direction*(dataBlock.unemp + dataBlock.emp)
}

function clickCounty(d, countyLookup, neighbors, censusData){
    let current = d.properties.GEOID
    let index = clicked.indexOf(current)
    if(index > -1){
        clicked.splice(index, 1)
        updateGlobals(countyLookup[current], -1.0)
        for(let n of neighbors[current]){
            let nindex = adjacent.indexOf(n)
            console.log(nindex)
            adjacent.splice(nindex,1)
        }
    } else {
        clicked.push(current)
        adjacent = adjacent.concat(neighbors[current])
        updateGlobals(countyLookup[current], 1.0)
    }
    let rate = 0.0
    if(denominator != 0)
        rate = numerator/(denominator + 0.0)
    d3.select("#population").html(population)
    d3.select("#rate").html(Math.round(rate*1000)/1000)

    updateCounties(countyLookup, censusData)
}

function updateCounties(countyLookup, censusData) {
    let unclicked = censusData.filter(x => clicked.indexOf(x.id) < 0)

    // let hotScale = d3.scaleLinear()
    //     .domain([0.065, 0.1])
    //     .range(["lightgray", "darkred"]);

    // let coldScale = d3.scaleLinear()
    //     .domain([0.01, 0.065])
    //     .range(["steelblue", "lightblue"]);

    // let colorScale = d3.scaleLinear()
    //     .domain([0.01, 0.064, 0.065, 0.1])
    //     .range(["steelblue", "lightblue", "lightgray", "darkred"]);

    for(let county of clicked){
        d3.select("#id-" + county).style("opacity", 1.0)
        d3.select("#id-" + county).style("stroke", "white")
    }    

    for(let county of unclicked.map(x => x.id)){
        let potentialNum = numerator + countyLookup[county].unemp
        let potentialDen = denominator + (countyLookup[county].unemp + countyLookup[county].emp)
        let potentialRate = potentialNum/potentialDen
        let potentialPop = population + countyLookup[county].pop
        if(adjacent.indexOf(county) < 0){
            d3.select("#id-" + county).style("opacity", 0.05)
            
        }
        else {
            d3.select("#id-" + county).style("opacity", 0.3)
        }
        d3.select("#id-" + county).style("fill", colorScale(potentialRate))
    }
}