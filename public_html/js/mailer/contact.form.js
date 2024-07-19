import {
  db,
  ref,
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

  const studentsRef = ref(db, "studenti");

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

  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      var name = $("input#name").val().trim();
      var email = $("input#email").val().trim();
      var phone = $("input#phone").val().trim(); // Changed 'mobile' to 'phone'
      var message = $("textarea#message").val().trim();

      if (!isValidEmail(email)) {
        $("#alertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Te rugăm să introduci o adresă de email validă.</strong>" +
            "</div>"
        );
        $("#sendMessageButton span").text("Arata-mi lectia demo");
        return;
      }

      if (!isValidPhone(phone)) {
        $("#alertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Te rugăm să introduci un nr de telefon valid.</strong>" +
            "</div>"
        );
        $("#sendMessageButton span").text("Arata-mi lectia demo");
        return;
      }

      $("#sendMessageButton").prop("disabled", true);
      $("#sendMessageButton span").text("Se trimite...");
      $("#sendMessageButton div").removeClass("d-none");

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
        .catch((error) => {
          console.error("Error checking or adding data to Firebase: ", error);
          $("#alertMessage").html(
            "<div class='alert alert-danger alert-dismissible'>" +
              "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
              "<strong>A apărut o eroare. Te rugăm să încerci din nou mai târziu.</strong>" +
              "</div>"
          );
          $("#sendMessageButton").prop("disabled", false);
          $("#sendMessageButton span").text("Arata-mi lectia demo");
          $("#sendMessageButton div").addClass("d-none");
        });

      // Always make the AJAX request regardless of Firebase check
      $.ajax({
        url: "./js/mailer/contact.form.php",
        type: "POST",
        data: {
          name: name,
          email: email,
          phone: phone, // Changed 'mobile' to 'phone'
          message: message,
        },
        dataType: "json",
        cache: false,
      })
        .done((response) => {
          if (response.status === "success") {
            $("#alertMessage").html(
              "<div class='alert alert-success alert-dismissible'>" +
                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                "<strong>" +
                response.message +
                "</strong>" +
                "</div>"
            );
            $("#contactForm").trigger("reset");
          } else {
            $("#alertMessage").html(
              "<div class='alert alert-danger alert-dismissible'>" +
                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                "<strong>" +
                response.message +
                "</strong>" +
                "</div>"
            );
            $("#sendMessageButton span").text("Arata-mi lectia demo");
          }
        })
        .fail((xhr, textStatus, errorThrown) => {
          $("#alertMessage").html(
            "<div class='alert alert-danger alert-dismissible'>" +
              "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
              "<strong>Ajax Error: " +
              errorThrown +
              "</strong>" +
              "</div>"
          );
        })
        .always(() => {
          $("#sendMessageButton").prop("disabled", false);
          $("#sendMessageButton span").text("Arata-mi lectia demo");
          $("#sendMessageButton div").addClass("d-none");
        });

      // Clear the form
      $form.trigger("reset");
    },
  });

  $("#sendMessageButton").prop("disabled", true);

  $("#contactForm").on("change keyup", function () {
    var $form = $(this);
    var isValid = true;
    $form.find("input, textarea").each(function () {
      if (!$(this).val().trim()) {
        isValid = false;
        return false;
      }
    });
    $form.find("button[type='submit']").prop("disabled", !isValid);
  });

  $("#name, #email, #message").focus(function () {
    $("#alertMessage").html("");
  });
})(jQuery);
