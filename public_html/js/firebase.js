// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmb4kcC9K6Bie38HuJw2wMl-vAhtfoHEo",
  authDomain: "informatic-mit.firebaseapp.com",
  databaseURL: "https://informatic-mit-default-rtdb.firebaseio.com",
  projectId: "informatic-mit",
  storageBucket: "informatic-mit.appspot.com",
  messagingSenderId: "632930275903",
  appId: "1:632930275903:web:20c782b3747bd1d7f4de8a",
  measurementId: "G-2N8TDR58Z1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database
const db = getDatabase(app);

// Form submission handling
document
  .getElementById("popupContactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting

    // Get user input
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      // Push new data to the database
      const newDataRef = push(ref(db, "abonati"), {
        name: name,
        email: email,
      });

      console.log("Data pushed with key: ", newDataRef.key);
    } catch (e) {
      console.error("Error adding data: ", e);
      document.getElementById("popupAlertMessage").innerHTML =
        "A apărut o eroare. Te rugăm să încerci din nou mai târziu.";
    }

    // Clear the form
    document.getElementById("popupContactForm").reset();
  });
