$(document).ready(function() {
    console.log(userId);
    if (category) {
        let musics = fetch('music/data/'+category).
        then(response => {
            if (response.status==200) {
                response.json().then(
                    musics => {
                        // console.log(musics.msg);
                        populateResults(musics.msg);
                        // implementSearch(musics.msg);
                        // $('#result-title').text('Searching Results');
                        console.log(category);
                        $('#result-title').text('All '+category);
                    });
            }
        });
    } else {
        let musics = fetch('music/data').
        then(response => {
            if (response.status==200) {
                response.json().then(
                    musics => {
                        // console.log(musics.msg);
                        if (keywordsPassed) {
                            $('#search-keywords').val(keywordsPassed);
                            let newMusic = new Set();
                            console.log($('#search-button'));
                            const keywords = $('#search-keywords').val().split(' ');
                            console.log(keywords);
                            if (keywords.length!==1 || keywords[0]!=='') {
                                $('#result-title').text('Searching Results');
                            } else {
                                category = category?category:'Music';
                                $('#result-title').text('All '+category);
                            }
                            for (let keyword of keywords) {
                                for (let music of musics.msg) {
                                    if (music.musicName.includes(keyword) || music.composer.includes(keyword)) {
                                        newMusic.add(music);
                                    }
                                }
                            }
                            populateResults(Array.from(newMusic));
                            implementSearch(musics.msg);
                        } else {
                            populateResults(musics.msg);
                            implementSearch(musics.msg);
                        }
                    });
            }
        });
    }    
});

const implementSearch = (musicsData) => {
    $('#search-button').on('click', ()=>{
        let newMusic = new Set();
        console.log($('#search-button'));
        const keywords = $('#search-keywords').val().split(' ');
        console.log(keywords);
        if (keywords.length!==1 || keywords[0]!=='') {
            $('#result-title').text('Searching Results');
        } else {
            category = category?category:'Music';
            $('#result-title').text('All '+category);
        }
        for (let keyword of keywords) {
            for (let music of musicsData) {
                if (music.musicName.includes(keyword) || music.composer.includes(keyword)) {
                    newMusic.add(music);
                }
            }
        }
        populateResults(Array.from(newMusic));
    });
};

const populateResults = (data) => {
    let results = '';
    for (let music of data) {
        // console.log(Buffer.from(music.image.data.data));
        // console.log(music.image.data.toString('base64'));
        // console.log(music.image.data);
        // console.log(music.price.$numberDecimal);
        results+=`
            <div onclick="moveToInfo(event, this)" class="card" data=${music._id}>
                <div class="card-title">
                    <a href='info/${music._id}''><h3>${music.musicName}</h3></a>
                </div>
                <div class="card-image">
                    <img src="${music.image}">
                </div>
                <div class="card-content">
                    ${music.newArrival?'<p style="color:red;">NEW ARRIVAL!</p>':""}
                    <p>Composer: ${music.composer}</p>
                    <p><b>Price: $ ${music.price.$numberDecimal}</b></p>
                </div>
            </div>

        `;
    }
    $('#results-musics').html(results);  
};

const moveToInfo = (event, instance) => {
    window.location.href = 'info/'+instance.getAttribute('data');
};