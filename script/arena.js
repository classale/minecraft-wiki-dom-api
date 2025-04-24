const tbody = document.querySelector("tbody")
const API_URL = "http://51.38.232.174:3000/v1"

const spawnForm = document.getElementById("form-spawn")
const select = document.querySelector("select")
const statusDiv = document.querySelector(".divStatut")

const canvas = document.querySelector("canvas")
canvas.width = canvas.getBoundingClientRect().width;
const ctx = canvas.getContext("2d")

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
    console.log(data)
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


fetch(`${API_URL}/arena`).then(ans => ans.json())
.then(json => {
    statusDiv.innerHTML = json.status
    statusDiv.classList.add(json.status)
    if(json.status == "close") {
        for(let field of spawnForm.querySelectorAll("select, input, button")) {
            field.disabled = true;
        }
    }
})

addEventListener("resize", e => {
    canvas.width = canvas.getBoundingClientRect().width;
})

ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.lineWidth = "1"

fetch(`${API_URL}/arena/entities`).then(ans => ans.json())
.then(json => {
    for(let mob of json) {
        const textWidth = ctx.measureText(`${mob.x}, ${mob.z}`).width
        const parsedX = (mob.x / 37) * canvas.width
        const parsedZ = (mob.z / 16) * canvas.height
        ctx.fillStyle = "#D9D9D9"
        ctx.strokeStyle = "#8E8E8E"
        ctx.drawImage(Object.assign(new Image(), {src: mob.entity.icon}), parsedX, parsedZ, 32, 32)
        ctx.fillRect(parsedX+24, parsedZ-8, textWidth + 16, 16);
        ctx.strokeRect(parsedX+24, parsedZ-8, textWidth + 16, 16);
        ctx.fillStyle = "#000000"
        ctx.strokeStyle = "#000000"
        ctx.fillText(`${mob.x}, ${mob.z}`, parsedX+24+((textWidth + 16) / 2), parsedZ)
    }
})
