import {
  db,
  dbRef,
  query,
  orderByChild,
  equalTo,
  get,
} from "./mailer/firebase.connect.js";

function redirectToHome() {
  window.location.href = "index.html#demo";
}

function validateToken() {
  const token = localStorage.getItem("demoAccessToken");
  if (!token) {
    redirectToHome();
    return;
  }

  const tokensRef = dbRef(db, "tokens");
  const tokenQuery = query(tokensRef, orderByChild("token"), equalTo(token));

  get(tokenQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("demoContent").style.display = "block";
      } else {
        redirectToHome();
      }
    })
    .catch((error) => {
      console.error("Error validating token:", error);
      redirectToHome();
    });
}

document.addEventListener("DOMContentLoaded", validateToken);
