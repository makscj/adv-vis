


let clicked = []
let colorScale = d3.scaleLinear()
        .domain([0.01, 0.065, 0.08, 0.2])
        .range(["steelblue", "lightblue", "lightred", "darkred"]);
let categoryColors = d3.scaleOrdinal(d3.schemeCategory20);

let clusters = []
let local = {}
let width = 0
let height = 0
let zoom = null
let activeCluster = -1

function drawMap(topo, neighbors) {
    let _this = this;

    let w = 500, h = 700

    width = w
    height = h


    svg = d3.select("#map-svg")
        .attr("width", w)
        .attr("height", h)


    zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);
    
    
    svg.call(zoom)

    let geoData = topojson.feature(topo, topo.objects.tl_2016_49_tract);
    
    
    let censusData = geoData.features.map(x => {return {
        "id": x.properties.CENSUS.geoid,
        "name": x.properties.CENSUS.name,
        "emp": parseFloat(x.properties.CENSUS.emp.replace(/,/g, '')),
        "unemp": parseFloat(x.properties.CENSUS.unemp.replace(/,/g, '')),
        "pop": parseFloat(x.properties.CENSUS.pop.replace(/,/g, '')),
        "den": (parseFloat(x.properties.CENSUS.unemp.replace(/,/g, '')) + parseFloat(x.properties.CENSUS.emp.replace(/,/g, ''))),
        "ur": parseFloat(x.properties.CENSUS.unemp.replace(/,/g, ''))/(parseFloat(x.properties.CENSUS.unemp.replace(/,/g, '')) + parseFloat(x.properties.CENSUS.emp.replace(/,/g, ''))),
        "geojson": x
    }})

    let countyLookup = {}
    for(item of censusData){
        countyLookup[item.id] = item
    }
    initialize(countyLookup,neighbors)

    path = createPath(geoData,w,h) 

    

    var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    var map = d3.select("#map")
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
            return "lightgray"
        });
    
    map.on("mouseover", d => mouseover(d,tooltip))

    map.on("mouseout", d => mouseout(d,tooltip))

    map.on("click", d => smartClick(d, countyLookup, neighbors, censusData))

    local = {countyLookup:countyLookup, neighbors:neighbors, censusData:censusData, path:path, svg:svg, map:map}

    

    

    function zoomed() {
        map.style("stroke-width", 1.0 / d3.event.transform.k + "px");
        map.attr("transform", d3.event.transform); // updated for d3 v4
    }
}

function mouseover(d, tooltip) {
    let current = d.properties.GEOID
    let countyLookup = local.countyLookup

    if(clicked.indexOf(current) == -1){
        let name = d.properties.CENSUS.name.split(",")[1]
        let rate = countyLookup[current].unemp/(countyLookup[current].unemp+countyLookup[current].emp)
        rate = Math.round(rate*1000)/1000
        
        tooltip.transition()		
            .duration(200)		
            .style("opacity", .9);		
        
            tooltip.html(name + "<br/>"  + "pop: " + countyLookup[current].pop + "<br/>ur: " + rate)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
    }
    else {
        for(let cluster of clusters){
            if(cluster.has(current)){
                let clusterName = "Cluster " + clusters.indexOf(cluster)
                let parts = getClusterValues(cluster, countyLookup)
                let rate = parts[0]/parts[1]
                let pop = getClusterPopulation(cluster, countyLookup)
                rate = Math.round(rate*1000)/1000

                tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltip.html(clusterName + "<br/>"  + "pop: " + pop + "<br/>ur: " + rate)	
                    .style("left", (d3.event.pageX + 1) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
            }
        }
    }
}

function mouseout(d, tooltip){
    tooltip.transition()		
    .duration(500)		
    .style("opacity", 0);
}



function resetZoom(){
    local.svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);
}

function clusterZoom(id){
    if(id == activeCluster){
        resetZoom()
        activeCluster = -1
        return
    }
    activeCluster = id
    console.log(id)
    let xs = [], ys = []
    

    for(let k of clusters[id]){    
        let bounds = local.path.bounds(local.countyLookup[k].geojson)
 
        xs.push(bounds[0][0])
        xs.push(bounds[1][0])
        ys.push(bounds[0][1])
        ys.push(bounds[1][1])
    }

    let minx = d3.min(xs)
    let miny = d3.min(ys)
    let maxx = d3.max(xs)
    let maxy = d3.max(ys)

    let dx = maxx - minx,
        dy = maxy - miny,
        x = (maxx + minx) / 2,
        y = (maxy + miny) / 2

    let scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    var transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);

    local.svg.transition()
        .duration(750)
        .call(zoom.transform, transform);

}

function findSolution(){
    clearMap()
    clusters = solution()
    for(let cluster of clusters){
        for(let k of cluster.values()){
            clicked.push(k)
        }
    }
    colorClusters(local.countyLookup, local.neighbors, local.censusData)
}

function initialTractSeeds(){
    clearMap()
    let seeds = local.censusData.filter(x => x.ur >= 0.065).map(x => x.id)

    clicked = seeds
    
    for(let seed of seeds){
        clusters.push(new Set([seed]))
    }

    clusters = merge(clusters, local.neighbors, local.countyLookup)  
    colorClusters(local.countyLookup, local.neighbors, local.censusData)  

    
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


function smartClick(d, countyLookup, neighbors, censusData){
    let county = d.properties.GEOID
    let index = clicked.indexOf(county)
    if(index < 0){
        clicked.push(county)
        clusters.push(new Set([county]))
        clusters = merge(clusters, neighbors, countyLookup)    
        colorClusters(countyLookup, neighbors, censusData)
    }
    else {
        clicked.splice(index, 1)
        d3.select("#id-" + county).style("fill", "lightgray")
        for(let cluster of clusters){
            if(cluster.has(county)){
                for(let k of cluster.values()){
                    if(k != county){
                        clusters.push(new Set([k]))
                    }
                }
                let cIndex = clusters.indexOf(cluster)
                clusters.splice(cIndex,1)
                clusters = merge(clusters, neighbors, countyLookup)
                colorClusters(countyLookup, neighbors, censusData)
                return 
            }
        }
    }
    
    
    

}

function colorClusters(countyLookup, neighbors, censusData){
    let iterate = 0
    for(let cluster of clusters){
        for(let k of cluster.values()){
            d3.select("#id-"+k).style("fill", function(d){
                let c = categoryColors(iterate)
                return c
            })
        }
        iterate += 1
    }

    let pop = d3.sum(clicked, x => countyLookup[x].pop)
    d3.select("#population").html(pop)

    let ratesBox = d3.select("#rates ul")

    ratesBox = ratesBox.selectAll("li").data(clusters)

    ratesBox.exit().remove()

    ratesBox = ratesBox.enter().append("li").merge(ratesBox)

    ratesBox.html(function(d){
        let parts = getClusterValues(d, countyLookup)
        let rate = parts[0]/parts[1]
        let color = "black"
        if(rate < 0.065)
            color = "red"
        let index = clusters.indexOf(d)
        return "Cluster " + index + ":&nbsp;<span style='color:" + color + "'>"  + (Math.round(rate*1000)/1000) + "</span>&nbsp;" +
            "<svg onclick='clusterZoom(" + index +  ")' width=1em height=1em><rect width=1em height=1em style='fill:" + categoryColors(index) + "'/></svg>"
    })
}



function clearMap(){
    d3.selectAll(".counties").style("fill", "lightgrey")
    clusters = []
    clicked = []
    d3.select("#population").html(0)

    let ratesBox = d3.select("#rates ul")
    ratesBox = ratesBox.selectAll("li").data(clusters)

    ratesBox.exit().remove()

    ratesBox = ratesBox.enter().append("li").merge(ratesBox)
    resetZoom()
}