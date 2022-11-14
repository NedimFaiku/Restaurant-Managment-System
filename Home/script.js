let tables = [];
let idTable = 1;

//merr te dhenat 
async function getTables() {
    //http://localhost:3000/tavolinat
    await fetch("http://localhost:3000/tavolinat")
        .then(res => res.json())
        .then(jsondata => tables = jsondata)
}
printi()

//therritet ne fillim per te marre te dhenat nga api dhe per te gjeneruar html per tavolinat
async function printi() {
    await getTables();
    generateTables()
}

//gjeneron html per te gjitha tavolinat qe jane
function generateTables() {
    let htmlTables = ``;
    if (tables != undefined) {
        tables.map(table => {
            htmlTables += `<div class="table">
                <button onclick="openMenu(${table.id})">
                    ${table.id}
                </button>
        </div>`
        })
        idTable = tables[tables.length - 1].id + 1
    }
    else {
        htmlTables = `<h1>Nuk ka tavolina</h1>`
    }
    document.getElementById("tables").innerHTML = htmlTables

}

//function emri(){}
//const emri = () => {}

async function addTables() {
    await fetch("http://localhost:3000/tavolinat", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "id": idTable
        })
    })
    generateTables()
}

let menu = [];
let orderOfTable;
let generateMenu = ``;
let generateMenuAll = ``;
let generateOrder = ``;

function generateMenuHeader(id) {
    generateMenu = `
    <div class="menuHeader">
        <h1>Tavolina ${id}</h1>
    </div>
    <div id="exitMenu" onclick="exitMenu()"><p>X</p></div>
    
    `
    document.getElementById("menu").innerHTML = generateMenu
    generateOrderFunc(id)
    
}

function generateOrderFunc(id) {
    let total = 0;
    generateOrder = `
    <div id="orderAll">
    <div id="order">`
    if (orderOfTable !== undefined) {
        let acc = 0;
        orderOfTable.map(item => {
            generateOrder += `
            <ul>
                <li>${item.name}</li>
                <li>${item.price}</li>
                <button onclick="deleteItem(${acc++}, ${id})">Fshije</button>
            </ul>
                `
            total = Math.round((total + item.price) * 1e12) / 1e12
        })
    }
    generateOrder += `
    <p>Totali për pagesë: ${total}</p>
    `
    generateOrder += `</div>`

    generateMenuAllFunc(id)
}

function generateMenuAllFunc(id){
    generateMenu = ``;
    generateMenu += generateOrder;
    generateMenu += `<div id="menuAll">`

    menu.map(item => {
        generateMenu += `<div class="card">
            <h2>${item.name}</h2>
            <p>Çmimi: ${item.price} euro</p>
            <button onclick="saveItem(${item.id}, ${id})">ADD</button>
        </div>
        `
    })
    generateMenu += `</div>`
    document.getElementById("menu").innerHTML += generateMenu
    generateButtons(id)
}
function generateButtons(id){
    generateMenu = `
        
    <div id="saveTheBill">
        <button onclick="addItems(${id})">Ruaje Porosin</button>
        <button onclick="payBill(${id})">Perfundoje Porosin</button>

    </div>
    `
    document.getElementById("menu").innerHTML += generateMenu
}

//e hap menyn per secilen tavoline
async function openMenu(id) {
    generateOrder = ``;
    generateMenu = ``;
    //http://localhost:3000/tavolinat
    await fetch("http://localhost:3000/tavolinat/" + id)
        .then(res => res.json())
        .then(data => orderOfTable = data.order)

    //http://localhost:3000/menuja
    await fetch("http://localhost:3000/menuja")
        .then(res => res.json())
        .then(data => menu = data)


    generateMenuHeader(id)
    
    
    document.getElementById("menu").style.display = "block"
}


//e kryen pagesen e tavolines

async function payBill(id) {
    await fetch("http://localhost:3000/tavolinat/" + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "order": []
        })
    })
}

//i merr porosite i ruan ne varg
const saveItem = (itemId, id) => {
    let itemFound = menu.find(item => {
        return item.id == itemId
    });
    orderOfTable.push(itemFound)
    generateMenuHeader(id)
}

//i shton elementet ne porosi
async function addItems(id) {
    await fetch("http://localhost:3000/tavolinat/" + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "order": orderOfTable
        })
    })
}

//fshirja e nje item nga porosia
function deleteItem(itemId, id){
    orderOfTable.splice(itemId, 1);
    generateMenuHeader(id);
}


//largimi nga menyja
const exitMenu = () => {
    document.getElementById("menu").setAttribute("style", "display: none");
};


//shfaqja e menys
function showMenu() {
    document.getElementById("menuAll").style.display = "flex"
}

