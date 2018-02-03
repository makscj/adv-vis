function download(text, name) {
    var a = document.createElement("a");
    var file = new Blob([text], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

let newData = []

function getFeatures(item) {
    return {
        id: item.id,
        danceability: item.song.features.danceability,
        energy: item.song.features.energy,
        acousticness: item.song.features.acousticness,
        instrumentalness: item.song.features.instrumentalness,
        liveness: item.song.features.liveness,
        loudness: item.song.features.loudness,
        speechiness: item.song.features.speechiness,
        valence: item.song.features.valence,
        tempo: item.song.features.tempo,
        time_signature: item.song.features.time_signature,
        key: item.song.features.key,
        duration_ms: item.song.features.duration_ms,
        peak: d3.min(item.chart.map(x => +x.position)),
        chart_time: item.chart.length
    }
}

function getTitle(item){
    return {
        id: item.id,
        name: item.song.name,
        artist: item.artists.artists[0].name
    }
}

d3.json("songs.json", function(err, data) {
    console.log(data);

    for(item of data){
        // newData.push(getFeatures(item))
        newData.push(getTitle(item))
    }

    console.log(newData)
    download(JSON.stringify(newData), "song-title.json")
  });