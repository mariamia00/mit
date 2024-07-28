// tokenGenerator.js
import {
  db,
  dbRef,
  push,
  equalTo,
  query,
  get,
} from "./mailer/firebase.connect.js";

function generateToken() {
  return Math.random().toString(36).substr(2);
}

function storeToken(phone, token) {
  const tokensRef = dbRef(db, "tokens");
  return push(tokensRef, { phone, token });
}

function getToken(phone) {
  return new Promise((resolve, reject) => {
    const tokensRef = dbRef(db, "tokens");
    const tokenQuery = query(tokensRef, orderByChild("phone"), equalTo(phone));

    get(tokenQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const tokenData = snapshot.val();
          const tokenKey = Object.keys(tokenData)[0];
          resolve(tokenData[tokenKey].token);
        } else {
          reject(new Error("Token not found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { generateToken, storeToken, getToken };
