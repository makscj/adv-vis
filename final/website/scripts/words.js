let wordSet = null

function setWords(words){
    wordSet = words.map(x => x[0])

    let wordList = d3.select("#words-list")
    wordList = wordList.selectAll("option").data(wordSet)


    wordList = wordList.enter().append('option').attr('value', d => d)
}

function searchWord(){
    let word = document.getElementById('wordsearch').value
    console.log(word)
    
    let found = d3.select(".node#"+word)

    d3.selectAll(".node")
        .transition()
        .duration(500)
        .style("opacity", d => (d.word === word) ? STATE.NODE.OPACITY.DEFAULT : STATE.NODE.OPACITY.SEARCH)
    
    repeatFlash(found, 0)

}

function repeatFlash(found, counter){
    if(counter > 5){
        d3.selectAll(".node")
            .transition()
            .duration(500)
            .style("opacity", STATE.NODE.OPACITY.DEFAULT)
            return
    }
    counter += 1
    console.log("FLASH")
    found.transition()
        .duration(750)
        .style("fill", x => counter % 2 == 0 ? getNodeColor(x) : STATE.NODE.COLOR.SELECTED)
        .on("end", d => repeatFlash(found, counter))
}