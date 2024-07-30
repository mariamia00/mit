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

// Validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/; // Adjust if needed (e.g., include country code)
  return phoneRegex.test(phone);
}

function validateToken() {
  const token = localStorage.getItem("demoAccessToken");

  if (token === demo_token) {
    // Token matches the predefined value
    $("#demoContent").show();
    $("#alternativeValidation").addClass("d-none");
  } else {
    // No token or token doesn't match the predefined value
    $("#alternativeValidation").removeClass("d-none");
  }
}

function validateAlternative() {
  const phone = $("#inputPhone").val().trim();
  const email = $("#inputEmail").val().trim();

  let valid = true;
  let message = "";

  // Validate phone and email
  if (phone && !isValidPhone(phone)) {
    valid = false;
    message +=
      "<div class='alert alert-danger alert-dismissible'>" +
      "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
      "<strong>Numărul de telefon este invalid.</strong>" +
      "</div>";
  }

  if (email && !isValidEmail(email)) {
    valid = false;
    message +=
      "<div class='alert alert-danger alert-dismissible'>" +
      "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
      "<strong>Emailul este invalid.</strong>" +
      "</div>";
  }

  if (!valid) {
    $("#display-msg").html(message);
    return;
  }

  // Check if at least one field is filled
  if (!phone && !email) {
    $("#display-msg").html(
      "<div class='alert alert-danger alert-dismissible'>" +
        "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
        "<strong>Cel puțin un câmp trebuie să fie completat.</strong>" +
        "</div>"
    );
    return;
  }

  // Create Firebase query based on the provided input
  const usersRef = dbRef(db, "studenti");
  let queryRef;

  if (phone) {
    queryRef = query(usersRef, orderByChild("phone"), equalTo(phone));
  } else {
    queryRef = query(usersRef, orderByChild("email"), equalTo(email));
  }

  // Query Firebase for matching records
  get(queryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // User found
        // Set the predefined token in local storage
        localStorage.setItem("demoAccessToken", demo_token);

        // Show demo content and hide alternative validation
        $("#demoContent").show();
        $("#alternativeValidation").addClass("d-none");
      } else {
        $("#display-msg").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Nu am putut găsi o potrivire cu datele trimise.</strong>" +
            "</div>"
        );
      }
    })
    .catch((error) => {
      console.error("Error validating alternative method:", error);
      $("#display-msg").html(
        "<div class='alert alert-danger alert-dismissible'>" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
          "<strong>A apărut o eroare la trimitere. Încercați din nou mai târziu.</strong>" +
          "</div>"
      );
    });
}

$(document).ready(function () {
  validateToken();
  $("#validateAlternative").click(validateAlternative);
});
