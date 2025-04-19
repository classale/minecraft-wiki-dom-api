const tbody = document.querySelector("tbody")
const API_URL = "http://51.38.232.174:3000/v1"

const spawnForm = document.getElementById("form-spawn")
const select = document.querySelector("select")

const entitiesRes = await fetch(`${API_URL}/arena/entities`)
const entities = await entitiesRes.json()

for(let entity of await (await fetch(`${API_URL}/entities`)).json()) {
    select.appendChild(Object.assign(document.createElement("option"), {innerHTML: entity.name, value: entity.id}))
}

async function createTableElement({x, z, id, entity}) {
    const tr = document.createElement("tr")
    const tdImg = document.createElement("td")
    tdImg.appendChild(Object.assign(document.createElement("img"), {src: entity.icon, alt: entity.name}))
    tr.appendChild(tdImg);
    tr.appendChild(Object.assign(document.createElement("td"), {innerHTML: entity.name}))
    tr.appendChild(Object.assign(document.createElement("td"), {innerHTML: x}))
    tr.appendChild(Object.assign(document.createElement("td"), {innerHTML: z}))
    const {strength} = await (await fetch(`${API_URL}/entities/${entity.id}`)).json()
    tr.appendChild(Object.assign(document.createElement("td"), {innerHTML: strength}))
    const tdButton = document.createElement("td")
    const button = Object.assign(document.createElement("button"), {innerHTML: "DELETE", className: "delete-btn"})
    button.addEventListener("click", async () => {
        const answ = await (await fetch(`${API_URL}/arena/entities/${id}`, {method: "DELETE"})).text();
        console.log(answ)
        tr.remove();
    })
    tdButton.appendChild(button);
    
    tr.appendChild(tdButton)
    return tr;
}

for(let entity of entities) {
    tbody.append(await createTableElement(entity))
}



spawnForm.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(Array.from(new FormData(spawnForm).entries()).map(([key, value]) => [key, parseFloat(value)]))
    const answ = await fetch(`${API_URL}/arena/entities`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    })
    const answData = await answ.json()
    if(answ.ok) {
        const arenaMobResp = await fetch(`${API_URL}/arena/entities/${answData.id}`)
        const arenaMobData = await arenaMobResp.json()
        tbody.append(await createTableElement(arenaMobData))
    }
})

/*
<tr>
    <td><img src="assets/mob.svg" alt="" /></td>
    <td>Armadillo</td>
    <td>155.6</td>
    <td>245.2</td>
    <td>0</td>
    <td><button class="delete-btn" mob-id="0">DELETE</button></td>
</tr>
*/

