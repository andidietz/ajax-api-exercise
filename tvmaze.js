const episodeList = document.getElementById("episodes-list")
const showsList = document.querySelector('#shows-list')

async function searchShows(query) {
    const shows = []
    const res = await axios.get("http://api.tvmaze.com/search/shows", {params: {
        q: query
    }})

    for(let show of res.data) {
        if(show.show.image) {
            const showInfo = {
                id: show.show.id,
                name: show.show.name,
                summary: show.show.summary,
                image: show.show.image.original
            }
            shows.push(showInfo)
        } else {
            const showInfo = {
                id: show.show.id,
                name: show.show.name,
                summary: show.show.summary,
                image: "https://tinyurl.com/tv-missing"
            }
            shows.push(showInfo)
        }
    }
    return shows
}

function populateShows(shows) {
    const $showsList = $("#shows-list")
    $showsList.empty()

    for (let show of shows) {
        let $item = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
            <div class="card" data-show-id="${show.id}">
                <img class="card-img-top" src="${show.image}">
                <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">${show.summary}</p>
                <button id="show-Eps">Show Episodes</button>
                </div>
            </div>
            </div>
        `)

        $showsList.append($item)
    }
}

$("#search-form").on("submit", async function handleSearch (evt) {
    evt.preventDefault()
    let query = $("#search-query").val()
    if (!query) return

    $("#episodes-area").hide()

    let shows = await searchShows(query)

    populateShows(shows)
})

async function getEpisodes(id) {
    const showEps = []
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
    
    for(let episode of res.data) {
        const episodeInfo = {
            name: episode.name,
            season: episode.season,
            number: episode.number
        }
        showEps.push(episodeInfo)
    }
    return showEps
}

function populateEspisodes(showEps) {
    episodeList.innerText = ""
    for(let episode of showEps) {
        const ep = document.createElement('li')
        ep.innerText = `${episode.name} (Season ${episode.season}, Episode ${episode.number})`
        const episodeList = document.getElementById("episodes-list")
        episodeList.append(ep)
    }

    const episodesArea = document.getElementById("episodes-area")
    
    // Source: Unhide Elements with jQuery (5/21/2021): https://www.w3schools.com/jquery/eff_show.asp 
    episodesArea.style.display = "block"

}

async function handleEpisodes(event) {
    if (event.target.tagName === 'BUTTON') {
        // Source: Access Grandparent element (5/21/2021): https://stackoverflow.com/questions/15036696/is-there-other-way-to-reference-grandparent-object-in-javascript
        // Source: Access Data Attribute (5/21/2021): https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        const id = event.target.parentElement.parentElement.dataset.showId
        let showEps = await getEpisodes(id)

        populateEspisodes(showEps)
    }
}

showsList.addEventListener('click', handleEpisodes)
