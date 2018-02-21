
// let frontier = []
// let visited = []
let p = 0.0

let ur = 0.0
let num = 0.0
let den = 0.0

let depthLimit = 0

let localData = {}

function initialize(data, neighbors){
    localData.data = data
    localData.neighbors = neighbors
    console.log("init complete")
}

function findOne(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

function solution(){

    let data = localData.data
    let neighbors = localData.neighbors
    let state = {name: "", num: 0.0, den:0.0, pop:0.0, rate:0.0, path:[]}
    // bfs(state, data, neighbors, [])

    return connect(state, data, neighbors)
    // return 

    // let toLoop = Object.values(data).sort(function(a,b){
    //     return b.ur - a.ur
    // })

    // console.log(toLoop)


    // console.log("start")

    // let start = toLoop[0]
    // console.log(start)
    // let visited = []
    // let state = {name: "", num: 0.0, den:0.0, pop:0.0, rate:0.0, path:[]}
    // dfs(nextState(state, start.id, data), data, neighbors, 0, visited)
    // console.log("-------")
    
    // clusters = clusters.filter(x => x.rate >= 0.065)
    // console.log(clusters)
    // clusters.sort(function(a,b){
    //     return b.pop - a.pop
    // })
    // console.log(clusters)
    // console.log(clusters[0].pop)
    // return clusters[0].path
}

function areAdjacent(v1, v2, neighbors){
    if(neighbors[v1].length < neighbors[v2].length){
        return neighbors[v1].indexOf(v2) > -1
    }
    else {
        return neighbors[v2].indexOf(v1) > -1
    }
}

function merge(clusters, neighbors, data){
    let anyChange = true
    while(anyChange){
        anyChange = false
        let newCluster = []
        for(let s1 of clusters){
            let noCluster = true
            for(let s2 of newCluster){
                if(setOverlap(s1,s2,neighbors)){
                    noCluster = false
                    anyChange = true
                    for(let k of s1.values()){
                        s2.add(k)
                    }
                }
            }
            if(noCluster){
                newCluster.push(s1)
            }
        }
        clusters = newCluster
    }
    
    return clusters
}

function setOverlap(s1, s2, neighbors){
    for(let k1 of s1.values()){
        for(let k2 of s2.values()){
            if(areAdjacent(k1,k2,neighbors)){
                return true
            }
        }
    }
    return false
}

function neighborSet(cluster, neighbors, data){
    let neighborList = []
    let clusterAsList = Array.from(cluster)
    for(let k of cluster.values()){
        neighborList = neighborList.concat(neighbors[k])
    }
    let allCounties = Object.keys(data)
    return new Set(neighborList.filter(x => clusterAsList.indexOf(x) == -1).filter(x => allCounties.indexOf(x) > -1))
}

function getClusterValues(cluster, data){
    let num = 0.0
    let den = 0.0

    for(let k of cluster.values()){
        num += data[k].unemp
        den += data[k].den
    }
    return [num, den]
}

function getClusterPopulation(cluster, data){
    let pop = 0

    for(let k of cluster.values()){
        pop += data[k].pop
    }
    return pop
}



function expandClusters(clusters, neighbors, data){
    let anyChange = false
    for(let cluster of clusters){
        let neighborhood = neighborSet(cluster, neighbors, data)
        let [num,den] = getClusterValues(cluster,data)
        let bestRate = 0.065
        let candidate = null
        for(let neighbor of neighborhood.values()){
            let tempNum = num + data[neighbor].unemp
            let tempDen = den + data[neighbor].den
            if(tempNum/tempDen >= bestRate){
                bestRate = tempNum/tempDen
                candidate = neighbor
            }
        }
        if(candidate != null){
            anyChange = true
            cluster.add(candidate)
        }
    }
    return [anyChange,clusters]
}

function connect(state, data, neighbors){
    let allKeys = Object.keys(data)
    let values = Object.values(data).filter(x => x.ur >= 0.065)
    // console.log(values)
    let counties = values.map(x => x.id)

    let clusters = []

    //Initialize clusters 
    for(let a of counties){
        clusters.push(new Set([a]))
    }

    let anyChange = true

    while(anyChange){
        anyChange = false
        clusters = merge(clusters, neighbors, data)
        let output = expandClusters(clusters,neighbors,data)
        clusters = output[1]
        anyChange = output[0]
        // console.log(clusters)
        // console.log("-------------")
    }

    //Merge all adjacent clusters
    

    
    // console.log(clusters)
    // console.log("-------")

    // for(let cluster of clusters){
    //     console.log(cluster)
    //     let rateParts = getClusterValues(cluster,data)
    //     console.log(rateParts[0]/rateParts[1])
    //     console.log("=======")
    // }
    



    return clusters

    // clusters = mergeClusters(clusters)
    // clusters = mergeClusters(clusters)
    // clusters = mergeClusters(clusters)

    // let candidates = k

    // let num = d3.sum(values, x => x.unemp)
    // let den = d3.sum(values, x => x.unemp + x.emp)
    
    // let neighborhoodArray = []

    // for(let a of k){
    //     neighborhoodArray = neighborhoodArray.concat(neighbors[a])
    // }

    // let neighborhood = new Set(neighborhoodArray.filter(x => allKeys.indexOf(x) > -1 && k.indexOf(x) < 0))
    
    // let nz = Array.from(neighborhood)

    // nz.sort(function(a,b){
    //     return data[b].pop - data[a].pop
    // })

    // for(let n of nz){
    //     let possibleRate = (num + data[n].unemp)/(den + (data[n].unemp + data[n].emp))
    //     if(possibleRate >= 0.65){

    //     }
    // }
    

    // return []

}



function removeCandidate(candidates, single, data){
    let index = candidates.candy.indexOf(single)
    update = candidates.candy
    update.splice(index, 1)
    

    let newCand = {
        candy: update,
        num: candidates.num - data[single].unemp,
        den: candidates.den - (data[single].unemp + data[single].emp),
        pop: candidates.pop - data[single].pop,
        rate: (candidates.num - data[single].unemp)/(candidates.den - (data[single].unemp + data[single].emp))
    }
    

    return newCand
}

function bfs(state, data, neighbors, visited){
    let begin = Object.values(data).filter(x => x.ur >= 0.065).sort(function(a,b){
        return b.pop - a.pop
    }).map(x => x.id)
    let group = []
    console.log(begin)
    let solution = {}
    frontier = []
    
    while(begin.length > 0){
        let vertex = begin.shift()
        let current = nextState(state,vertex,data)
        let ns = neighbors[vertex]
        for(let n of ns){
            if(data[n] != undefined){
                let candidate = nextState(current, n, data)
                if(candidate.rate >= 0.065)
                    current = candidate
            }  
        }
        frontier.push(current)
    }

    while(frontier.length > 0){
        let current = frontier.shift()

    }

    


}

function mergeStates(state1, state2, data){
    let newState = {
        name: state1.name,
        num: state1.num +  state2.num,
        den: state1.den + state2.den,
        pop: state1.pop + state2.pop,
        rate: (state1.num +  state2.num)/(state1.den + state2.den),
        path: state.path.concat(state2.path)
    }
    return newState
}


function dfs(state, data, neighbors, bufferDepth, visited){
    let name = state.name

    

    if(state.rate < 0.065){
        // console.log(state.rate)
        // console.log(bufferDepth)
        // console.log("%%%%")
        bufferDepth += 1
        if(bufferDepth > depthLimit){
            clusters.push(state)
            return
        }
    } else {
        bufferDepth = 0.0
    }
    

    for(let neighbor of neighbors[name]){
        // console.log(neighbor)
        if(visited.indexOf(neighbor) < 0 && data[neighbor] != undefined){
            let next = nextState(state, neighbor, data)
            // console.log(visited.concat([name]))
            // console.log(visited)
            dfs(next, data, neighbors, bufferDepth, visited.concat([name]))
        }
    }

}



function nextState(state, choice, data){
    
    let newState = {
        name: choice,
        num: state.num + data[choice].unemp,
        den: state.den + data[choice].unemp + data[choice].emp,
        pop: state.pop + data[choice].pop,
        rate: (state.num + data[choice].unemp)/(state.den + data[choice].unemp + data[choice].emp),
        path: state.path.concat([choice])
    }
    return newState
}