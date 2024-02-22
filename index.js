import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

let appSettings = {
    databaseURL: "https://shopping-cart-app-55ad7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const myApp = initializeApp(appSettings)
const myDatabase = getDatabase(myApp)
const shoppingListInDB = ref(myDatabase, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addToCartBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const containerEl = document.getElementById("container2")

// adding to cart lists the item below
addToCartBtn.addEventListener("click", function() {
    const inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)

    inputFieldEl.value = ""
})

// clicking on the item cards removes it from the database and DOM
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        shoppingListEl.textContent = ""
        itemsArray.forEach((item) => {
            appendToShoppingList(item)
        })
    } else {
        shoppingListEl.innerHTML = `<p> No items added yet.</p>`
    }

})

function appendToShoppingList(item) {
    // shoppingListEl.innerHTML += `<li>${item}</li>`
    let itemID = item[0]
    let itemValue = item[1]

    let newListEl = document.createElement("li")
    newListEl.textContent = itemValue

    newListEl.addEventListener("click", function() {
        let locationOfItemInDB = ref(myDatabase, `shoppingList/${itemID}`)
        remove(locationOfItemInDB)
    })

    shoppingListEl.append(newListEl)



}
