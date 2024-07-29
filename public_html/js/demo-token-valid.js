import {
  db,
  dbRef,
  query,
  orderByChild,
  equalTo,
  get,
} from "./mailer/firebase.connect.js";

const demo_token =
  "HKt45Hl2iw0P9xdu6=?2C13!?Jm6oR3BLqpUa8Ih8DNnYBIsoSyzsOjLehf2toiP";

function validateToken() {
  const token = localStorage.getItem("demoAccessToken");

  if (token === demo_token) {
    // Token matches the predefined value
    document.getElementById("demoContent").style.display = "block";
    document.getElementById("alternativeValidation").classList.add("d-none");
  } else if (!token) {
    // No token in local storage
    document.getElementById("alternativeValidation").classList.remove("d-none");
  } else {
    // Token exists but doesn't match the predefined value
    document.getElementById("alternativeValidation").classList.remove("d-none");
  }
}

function validateAlternative() {
  const phone = document.getElementById("inputPhone").value.trim();
  const email = document.getElementById("inputEmail").value.trim();

  if (!phone && !email) {
    alert("Please enter either phone number or email.");
    return;
  }

  const usersRef = dbRef(db, "studenti");

  let queryRef;
  if (phone) {
    queryRef = query(usersRef, orderByChild("phone"), equalTo(phone));
  } else {
    queryRef = query(usersRef, orderByChild("email"), equalTo(email));
  }

  get(queryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User found
        // Set the predefined token in local storage
        localStorage.setItem("demoAccessToken", demo_token);

        // Show demo content and hide alternative validation
        document.getElementById("demoContent").style.display = "block";
        document
          .getElementById("alternativeValidation")
          .classList.add("d-none");
      } else {
        alert("User not found. Please check the entered details.");
      }
    })
    .catch((error) => {
      console.error("Error validating alternative method:", error);
      alert("Error validating user. Please try again.");
    });
}

document.addEventListener("DOMContentLoaded", validateToken);
document
  .getElementById("validateAlternative")
  .addEventListener("click", validateAlternative);
