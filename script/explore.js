const searchForm = document.getElementById("search-form")
const results = document.querySelector(".results")

const API_URL = "http://192.168.1.15:3000/v1"

function createCard(el) {
    const div = document.createElement("div")
    div.appendChild(Object.assign(document.createElement("p"), {innerHTML: el.name, className: "entity-name"}));
    div.appendChild(Object.assign(document.createElement("img"), {src: el.image}));
    //div.appendChild(Object.assign(document.createElement("pre"), {innerHTML: JSON.stringify(el)}));

    return div;
}

async function updateSearchField(searchForm) {
    const query = Array.from(new FormData(searchForm).entries().filter(([_, value]) => !!value).map(([key, value]) => `${key}=${value}`)).join("&");
    const ans = await fetch(`${API_URL}/entities?${query}`);
    const json = await ans.json()
    for(let el of json) {
        results.appendChild(createCard(el))
    }
}

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    updateSearchField(searchForm)
})

updateSearchField(searchForm)