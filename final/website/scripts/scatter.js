

function drawScatter(data){
    console.log("Draw scatterplot matrix")
    
    let width = 960,
    // size = 230,
    size = 15,
    padding = 2,
    n = 50

    let traits = [],
    domainByTrait = {}
    for(let i = 0; i < 50; i++)
        traits.push(i)

    traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, d => d.original[trait]);
          });

    

    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var svg = d3.select("#scatter-matrix svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")")
        
    d3.select("body").on("keydown", function(d){
        if(d3.event.keyCode >= 37 && d3.event.keyCode <= 40){
            d3.event.preventDefault()
            let currentX = STATE.SELECTED.SCATTER.x
            let currentY = STATE.SELECTED.SCATTER.y

            if(d3.event.keyCode == 40){
                console.log("DOWN")
        
                currentY = ((currentY + 1) % 50 + 50) % 50
            }
            else if(d3.event.keyCode == 38){
                console.log("UP")
                currentY = ((currentY - 1) % 50 + 50) % 50
            }
            else if(d3.event.keyCode == 37){
                console.log("LEFT")
                currentX = ((currentX + 1) % 50 + 50) % 50
            }
            else if(d3.event.keyCode == 39){
                console.log("RIGHT")
                currentX = ((currentX - 1) % 50 + 50) % 50
            }
        
            STATE.SELECTED.SCATTER = {x: currentX, y: currentY}
            
    
            d3.selectAll(".frame")
                .style("fill", z => (z.x == STATE.SELECTED.SCATTER.x && z.y == STATE.SELECTED.SCATTER.y) ? STATE.SCATTER.COLOR.SELECTED : STATE.SCATTER.COLOR.DEFAULT)
    
            drawRubics(data)
        }
    })
    

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

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

//   // Titles for the diagonal.
//   cell.filter(function(d) { return d.i === d.j; }).append("text")
//       .attr("x", padding)
//       .attr("y", padding)
//       .attr("dy", ".71em")
//       .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    // p = p.original

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding)
        .style("opacity", STATE.SCATTER.OPACITY.DEFAULT)
        .style("fill", d => (p.x == STATE.SELECTED.SCATTER.x && p.y == STATE.SELECTED.SCATTER.y) ? STATE.SCATTER.COLOR.SELECTED : STATE.SCATTER.COLOR.DEFAULT)
        .on("click", function(d){
            console.log("====")
            console.log(d)
            console.log("====")
            STATE.SELECTED.SCATTER = d
            console.log(STATE.SELECTED.SCATTER)

            d3.selectAll(".frame")
                .style("fill", z => (z.x == STATE.SELECTED.SCATTER.x && z.y == STATE.SELECTED.SCATTER.y) ? STATE.SCATTER.COLOR.SELECTED : STATE.SCATTER.COLOR.DEFAULT)
            
            drawRubics(data)
        })

    // cell.selectAll("circle")
    //     .data(data)
    //   .enter().append("circle")
    //     .attr("class", d => "scatter-circle scatter-" + d.word)
    //     // .attr("id", d => "scatter-" + d.word + "" + )
    //     .attr("cx", function(d) { return x(d.original[p.x]); })
    //     .attr("cy", function(d) { return y(d.original[p.y]); })
    //     .attr("r", 1)
    //     .style("fill", d => getNodeColor(d));
  }
}

function moveSquare(d){
    console.log("====")
    console.log(d)
    console.log("====")
    STATE.SELECTED.SCATTER = d
    console.log(STATE.SELECTED.SCATTER)

    d3.selectAll(".frame")
        .style("fill", z => (z.x == STATE.SELECTED.SCATTER.x && z.y == STATE.SELECTED.SCATTER.y) ? STATE.SCATTER.COLOR.SELECTED : STATE.SCATTER.COLOR.DEFAULT)

    drawRubics(data)
}

function KeyDownEvent(d)
{
    // console.log(d3.event)

    

   

}


function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
}