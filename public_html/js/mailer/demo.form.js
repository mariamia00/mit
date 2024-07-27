import {
  db,
  dbRef,
  push,
  query,
  orderByChild,
  equalTo,
  get,
} from "./firebase.connect.js";

(function ($) {
  "use strict";

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  const studentsRef = dbRef(db, "studenti");

  function checkPhoneExists(phone) {
    return new Promise((resolve, reject) => {
      const phoneQuery = query(
        studentsRef,
        orderByChild("phone"),
        equalTo(phone)
      );
      get(phoneQuery)
        .then((snapshot) => {
          resolve(snapshot.exists());
        })
        .catch((error) => {
          console.error("Error checking phone existence: ", error);
          reject(error);
        });
    });
  }

  $("#popupContactForm input").jqBootstrapValidation({
    preventSubmit: true,
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      var name = $("input#name").val().trim();
      var email = $("input#email").val().trim();
      var phone = $("input#phone").val().trim();

      if (!isValidEmail(email)) {
        $("#popupAlertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Te rugăm să introduci o adresă de email validă.</strong>" +
            "</div>"
        );
        $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
        return;
      }

      if (!isValidPhone(phone)) {
        $("#popupAlertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Te rugăm să introduci un nr de telefon valid.</strong>" +
            "</div>"
        );
        $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
        return;
      }

      $("#sendPopupMessageButton").prop("disabled", true);
      $("#sendPopupMessageButton").text("Se trimite...");
      $("#sendPopupMessageButton div").removeClass("d-none");

      // Check if phone number exists and add data to Firebase if it doesn't
      checkPhoneExists(phone)
        .then((exists) => {
          if (!exists) {
            // Phone number does not exist, add data to Firebase
            return push(studentsRef, {
              name: name,
              email: email,
              phone: phone,
            });
          }
        })
        .then(() => {
          // Always make the AJAX request regardless of Firebase check
          return $.ajax({
            url: "./js/mailer/contact.form.php",
            type: "POST",
            data: {
              name: name,
              email: email,
              phone: phone,
            },
            dataType: "json",
            cache: false,
          });
        })
        .then((response) => {
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
            $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
          }
        })
        .catch((error) => {
          // Redirect to video.html even if PHP request fails
          window.location.href = "./video.html";

          // Log the error for debugging
          console.error("Error in processing: ", error);
        });

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
