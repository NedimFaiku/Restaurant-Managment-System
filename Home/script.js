let tables = [];
let idTable = 1;

//merr te dhenat 
async function getTables() {
    //http://localhost:3000/tavolinat
    await fetch("http://localhost:3000/tavolinat")
        .then(res => res.json())
        .then(jsondata => tables = jsondata)
}
// printi()

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

//e hap menyn per secilen tavoline
async function openMenu(id) {
    let generateOrder = ``;
    let generateMenu = ``;
    //http://localhost:3000/tavolinat
    await fetch("http://localhost:3000/tavolinat/" + id)
        .then(res => res.json())
        .then(data => orderOfTable = data.order)

    //http://localhost:3000/menuja
    await fetch("http://localhost:3000/menuja")
        .then(res => res.json())
        .then(data => menu = data)

    orderOfTable.map(item => {
        generateOrder += `
        <ul>
            <li>${item.name}</li>
            <li>${item.price}
        </ul>
            `
    })
    generateMenu = `
            <div class="menuHeader">
                <h1>Tavolina ${id}</h1>
                <button onclick="showMenu()">Shfaq Menyn </button>
            </div>
            <div id="exitMenu" onclick="exitMenu()"><p>X</p></div>
            <div id="menuAll">`
    menu.map(item => {
        generateMenu += `<div class="card">
            <h2>${item.name}</h2>
            <p>Çmimi: ${item.price} euro</p>
            <button onclick="(e) =>  {addItem(${item.id}, ${id}, e)}">ADD</button>
        </div>`
    })
    generateMenu += `</div>`
    document.getElementById("menu").innerHTML = generateMenu
    document.getElementById("menu").innerHTML += generateOrder
    document.getElementById("menu").style.display = "flex"


}

//i shton elementet ne porosi
const addItem = async (itemId, id, event)=>{
    let itemFound = menu.find(item => {
        return item.id == itemId
    });
    console.log(itemFound)
    orderOfTable.push(itemFound)
    console.log(orderOfTable)
    // await fetch("http://localhost:3000/tavolinat/" + id)
    //     .then(res => res.json())
    //     .then(data => orderOfTable = data)
    //     .then(() => orderOfTable.order.push(itemFound))
    
    await fetch("http://localhost:3000/tavolinat/" + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "order": orderOfTable
        })
    })
    event.preventDefault();
    openMenu(id)
}
// async function addItem(itemId, id, event ) {
//     event.preventDefault();
//     let itemFound = menu.find(item => {
//         return item.id == itemId
//     });
//     console.log(itemFound)
//     orderOfTable.push(itemFound)
//     console.log(orderOfTable)
//     // await fetch("http://localhost:3000/tavolinat/" + id)
//     //     .then(res => res.json())
//     //     .then(data => orderOfTable = data)
//     //     .then(() => orderOfTable.order.push(itemFound))

//     await fetch("http://localhost:3000/tavolinat/" + id, {
//         method: "PATCH",
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             "order": orderOfTable
//         })
//     })
//     openMenu(id)
// }


//largimi nga menyja
const exitMenu = () => {
    document.getElementById("menu").setAttribute("style", "display: none");
};
// let exitMenu = document.getElementById("exitMenu");


//shfaqja e menys
function showMenu() {
    document.getElementById("menuAll").style.display = "flex"
}



// async function deleteTables(id) {
//     await fetch("http://localhost:3000/tavolinat/" + id, {
//         method: "DELETE"
//     })
//     generateTables()
// }