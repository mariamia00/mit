import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
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

const db = getDatabase(app);
export { db, ref, push, query, orderByChild, equalTo, get };
