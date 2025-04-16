const searchForm = document.getElementById("search-form")

const API_URL = "http://192.168.1.15:3000/v1"

async function updateSearchField(searchForm) {
    const query = Array.from(new FormData(searchForm).entries().filter(([_, value]) => !!value).map(([key, value]) => `${key}=${value}`)).join("&");
    
    console.log(`${API_URL}/entities?${query}`)
}

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    updateSearchField(searchForm)
})



updateSearchField(searchForm)