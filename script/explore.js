const searchForm = document.getElementById("search-form")
const mobs = document.querySelector(".mobs")
const nothingfound = document.querySelector(".nothingfound")

const API_URL = "http://51.38.232.174:3000/v1"

function createCard(el) {
    //const diarticlevarticle = document.createElement("div")
    const article = document.createElement("article")
    article.appendChild(Object.assign(document.createElement("div"), {innerHTML: el.name, className: `box ${el.type}`}));
    console.log(article)
    article.appendChild(Object.assign(document.createElement("img"), {src: el.image}));
    const info = Object.assign(document.createElement("div"), {classList: "info"})
    info.appendChild(Object.assign(document.createElement("p"), {innerHTML: el.classification}))
    info.appendChild(Object.assign(document.createElement("p"), {innerHTML: el.type}))
    //article.appendChild(Object.assign(document.createElement("pre"), {innerHTML: JSON.stringify(el)}));
    const aaa = document.createElement("div")
    aaa.appendChild(info)
    aaa.appendChild(document.createElement("hr"))
    const seemore = Object.assign(document.createElement("div"), {className: `box ${el.type}`})
    seemore.appendChild(Object.assign(document.createElement("a"), {href: `./detail.html?id=${el.id}`, innerHTML: "SEE MORE"}));
    aaa.appendChild(seemore)
    article.appendChild(aaa)

    return article;
}

async function updateSearchField(searchForm) {
    mobs.innerHTML = "";
    const query = Array.from(new FormData(searchForm).entries().filter(([_, value]) => !!value).map(([key, value]) => `${key}=${value}`)).join("&");
    const ans = await fetch(`${API_URL}/entities?${query}`);
    const json = await ans.json()
    nothingfound.style.display = json.length == 0 ? "flex" : "none";
    for(let el of json) {
        console.log(el)
        mobs.appendChild(createCard(el))
    }
}

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    updateSearchField(searchForm)
})

updateSearchField(searchForm)