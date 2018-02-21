

d3.csv("data/UT_asu_exampleData.csv", function(err, data){
    let census = {}
    data.forEach(function(d){
        census[d.geoid] = d
    })


    d3.json("data/utah_counties.json", function (error, map) {
        d3.csv("data/neighbors.csv", function(error, neighbors) {

            let nmap = {}
            for(let tract of neighbors.map(x => x["SOURCE_TRACTID"])){
                nmap[tract] = []
            }
            for(let n of neighbors){
                nmap[n.SOURCE_TRACTID].push(n.NEIGHBOR_TRACTID)
            }

            if (error) throw error;

            for(obj of map.objects["tl_2016_49_tract"].geometries){
                obj.properties.CENSUS = census[obj.properties.GEOID]
            }

            drawMap(map, nmap)
        })

        
    });
})