

function drawRubics(data){

    console.log("Draw scatterplot matrix")
    
    let width = 500,
    // size = 230,
    size = 500,
    padding = 20,
    n = 50

    let traits = [],
    domainByTrait = {}
    for(let i = 0; i < 50; i++)
        traits.push(i)

    traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, d => d.original[trait]);
          });

    

    let x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    let y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    let xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    let yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    let svg = d3.select("#rubics svg")
        .attr("width", width)
        .attr("height", width)
        
        // .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
    

//     svg.selectAll(".x.axis")
//       .data(traits)
//     .enter().append("g")
//       .attr("class", "x axis")
//       .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
//       .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

//   svg.selectAll(".y.axis")
//       .data(traits)
//     .enter().append("g")
//       .attr("class", "y axis")
//       .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
//       .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });


    let cell = svg.select("g")


    let circles = cell.selectAll("circle.scatter-circle")
        .data(data)  
    
    circles.exit().remove()

    x.domain(domainByTrait[STATE.SELECTED.SCATTER.x]);
    y.domain(domainByTrait[STATE.SELECTED.SCATTER.y]);

    circles = circles.enter().append("circle")
        .merge(circles)
        .attr("class", d => "scatter-circle scatter-" + d.word)
        // .attr("id", d => "scatter-" + d.word + "" + )
        .attr("cx", function(d) { return x(d.original[STATE.SELECTED.SCATTER.x]); })
        .attr("cy", function(d) { return y(d.original[STATE.SELECTED.SCATTER.y]); })
        .attr("r", 2)
        .style("fill", d => getNodeColor(d))
    


}
