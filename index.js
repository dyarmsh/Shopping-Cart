import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"

let appSettings = {
    databaseURL: "https://shopping-cart-app-55ad7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const myApp = initializeApp(appSettings)
// const myAuth = getAuth(myApp)
const provider = new GoogleAuthProvider()
const myDatabase = getDatabase(myApp)
const shoppingListInDB = ref(myDatabase, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addToCartBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const signInWithGoogleEl = document.getElementById("sign-in-with-google-btn")
const viewLoggedIn = document.getElementById("view-logged-in")
const viewLoggedOut = document.getElementById("view-logged-out")

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//       viewLoggedIn.style.display = "block"
//       viewLoggedOut.style.display = "none"
  
//     } else {
//       viewLoggedIn.style.display = "none"
//       viewLoggedOut.style.display = "block"
//     }
//   })
  
  // signInWithGoogleEl.addEventListener("click", function() {
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       console.log("Yay it worked")
  //     }).catch((error) => {
  //       console.log("Nooo it didnt work")
  //     })
  // })

// adding to cart lists the item below
addToCartBtn.addEventListener("click", function() {
    const inputValue = inputFieldEl.value

    if ((inputValue !== null || inputValue !== "")) {
        push(shoppingListInDB, inputValue)
        inputFieldEl.value = ""
    } else {
        alert("Enter an item!")
    }

})

// clicking on the item cards removes it from the database and DOM
onValue(shoppingListInDB, function(snapshot) {
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

    // shoppingListEl.insertBefore(item, shoppingListEl.childNodes[0]);
    shoppingListEl.append(newListEl)



}
