import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"

let appSettings = {
    apiKey: "AIzaSyDJUFOSg9VWWuMDyHFW8KSXpYBFLh3Tp20",
    authDomain: "shopping-cart-app-55ad7.firebaseapp.com",
    databaseURL: "https://shopping-cart-app-55ad7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const database = getDatabase(app)


const viewLoggedIn = document.getElementById("logged-in-view")
const viewLoggedOut = document.getElementById("logged-out-view")

const inputFieldEl = document.getElementById("input-field")
const addToCartBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

const signInWithGoogleEl = document.getElementById("sign-in-with-google-btn")
const logOutButtonEl = document.getElementById("log-out-button")

signInWithGoogleEl.addEventListener("click", function() {
    signInWithPopup(auth, provider)
        .then((result) => {
        console.log("Yay it worked")
        }).catch((error) => {
        console.log("Nooo it didnt work")
        })
})

logOutButtonEl.addEventListener("click", function() {
    signOut(auth)
})

onAuthStateChanged(auth, (user) => {
    if (user) {
      viewLoggedIn.style.display = "block"
      viewLoggedOut.style.display = "none"
      fetchFromDB()
  
    } else {
      viewLoggedIn.style.display = "none"
      viewLoggedOut.style.display = "block"
    }
  })
  

// adding to cart lists the item below
addToCartBtn.addEventListener("click", function() {
    const inputValue = inputFieldEl.value
    const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)

    if ((inputValue !== null || inputValue !== "")) {
        push(userShoppingListInDB, inputValue)
        inputFieldEl.value = ""
    } else {
        alert("Enter an item!")
    }

})

function fetchFromDB() {
    const userShoppingListInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList`)

    // clicking on the item cards removes it from the database and DOM
    onValue(userShoppingListInDB, function(snapshot) {
        if (snapshot.exists()) {
            let itemsArray = Object.entries(snapshot.val())

            shoppingListEl.innerHTML = ""
            itemsArray.forEach((item) => {
                appendToShoppingList(item)
            })
        } else {
            shoppingListEl.innerHTML = `<p> No items added yet.</p>`
        }

    })
}


function appendToShoppingList(item) {
    // shoppingListEl.innerHTML += `<li>${item}</li>`
    let itemID = item[0]
    let itemValue = item[1]

    let newListEl = document.createElement("li")
    newListEl.textContent = itemValue

    newListEl.addEventListener("click", function() {
        let locationOfItemInDB = ref(database, `users/${auth.currentUser.uid}/shoppingList/${itemID}`)
        remove(locationOfItemInDB)
    })

    // shoppingListEl.insertBefore(item, shoppingListEl.childNodes[0]);
    shoppingListEl.append(newListEl)



}
