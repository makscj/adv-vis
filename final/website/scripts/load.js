
STATE = {
    NODE : {
        OPACITY: {
            DEFAULT: 1.0,
            SEARCH: 0.05,
            HOVER: 0.3,
            SELECTED: 1.0
        },
        COLOR: {
            DEFAULT: "black",
            SELECTED: "red",
            NEIGHBOR: "blue"
        }
    },
    SCATTER: {
        COLOR: {
            DEFAULT: "steelblue",
            SELECTED: "red"
        },
        OPACITY: {
            DEFAULT: 0.7
        }
    },
    SELECTED: {
        NODES: [],
        SCATTER: {x:1, y:1},
        NEIGHBORS: []
    }
}

d3.text("data/words5000.csv", function(text_words) {
    let words = d3.csvParseRows(text_words).map(x => x[0])
    d3.text("data/tsne-vectors-nc2-p40.0-c5000.csv", function(text_vectors) {
        vectors = d3.csvParseRows(text_vectors)
        vectors = vectors.map(x => {
            return [+x[0], +x[1]]
        })
        d3.text("data/word-vectors-c5000.csv", function(original_vectors) {
            original = d3.csvParseRows(original_vectors)

            original = original.map(x => {
                return x.map(y => +y)
            })

            let data = []

            for(let i = 0; i < words.length; i++){
                data.push({
                    word: words[i],
                    point: vectors[i],
                    original: original[i]
                })
            }

            data = data.slice(0,2000)
            
            drawMap(data, undefined)
            drawScatter(data)
            drawRubics(data, {x: 1, y: 2})
            setWords(words)

        })
        

        


    });
  });



