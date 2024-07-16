import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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

const db = getDatabase(app);
(function ($) {
  "use strict";
  function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  // Firebase initialization (already included above)

  $("#popupContactForm input").jqBootstrapValidation({
    preventSubmit: true,
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      var name = $("input#name").val().trim();
      var email = $("input#email").val().trim();
      if (!isValidEmail(email)) {
        $("#popupAlertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Te rugăm să introduci o adresă de email validă.</strong>" +
            "</div>"
        );
        return;
      }

      $("#sendPopupMessageButton").prop("disabled", true);
      $("#sendPopupMessageButton").text("Se trimite...");
      $("#sendPopupMessageButton div").removeClass("d-none");
      // Push new data to Firebase
      try {
        const newDataRef = push(ref(db, "abonati"), {
          name: name,
          email: email,
        });

        console.log("Data pushed with key: ", newDataRef.key);

        // AJAX request to PHP for additional processing (if needed)
        $.ajax({
          url: "./js/mailer/contact.form.php",
          type: "POST",
          data: {
            name: name,
            email: email,
          },
          dataType: "json",
          cache: false,
          success: function (response) {
            if (response.status === "success") {
              window.location.href = "./video.html";
              $("#popupAlertMessage").html(
                "<div class='alert alert-success alert-dismissible'>" +
                  "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                  "<strong>" +
                  response.message +
                  "</strong>" +
                  "</div>"
              );
              $("#popupContactForm").trigger("reset");
            } else {
              $("#popupAlertMessage").html(
                "<div class='alert alert-danger alert-dismissible'>" +
                  "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                  "<strong>" +
                  response.message +
                  "</strong>" +
                  "</div>"
              );
            }
          },
          error: function (xhr, textStatus, errorThrown) {
            $("#popupAlertMessage").html(
              "<div class='alert alert-danger alert-dismissible'>" +
                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                "<strong>Ajax Error: " +
                errorThrown +
                "</strong>" +
                "</div>"
            );
          },
          complete: function () {
            $("#sendPopupMessageButton").prop("disabled", false);
            $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
            $("#sendPopupMessageButton div").addClass("d-none");
          },
        });
      } catch (e) {
        console.error("Error adding data: ", e);
        $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
        $("#popupAlertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>A apărut o eroare. Te rugăm să încerci din nou mai târziu.</strong>" +
            "</div>"
        );
      }

      // Clear the form
      $form.trigger("reset");
    },
  });

  $("#sendPopupMessageButton").prop("disabled", true);

  $("#popupContactForm").on("change keyup", function () {
    var $form = $(this);
    var isValid = true;
    $form.find("input").each(function () {
      if (!$(this).val().trim()) {
        isValid = false;
        return false;
      }
    });
    $form.find("button[type='submit']").prop("disabled", !isValid);
  });

  $("#popupContactForm input").focus(function () {
    $("#popupAlertMessage").html("");
  });
})(jQuery);
