(function ($) {
  "use strict";

  // Initialize form validation for #contactForm
  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      // Fetch form data for #contactForm
      var name = $("input#name").val();
      var email = $("input#email").val();

      var message = $("textarea#message").val();
      var mobile = $("input#mobile").length
        ? $("input#mobile").val()
        : "noMobile";

      // Disable submit button during AJAX request
      $("#sendMessageButton").prop("disabled", true);
      $("#sendMessageButton span").text("Se trimite...");
      $("#sendMessageButton div").removeClass("d-none");

      // Perform AJAX submission for #contactForm
      $.ajax({
        url: "./js/mailer/contact.form.php",
        type: "POST",
        data: {
          name: name,
          email: email,
          mobile: mobile,
          message: message,
        },
        dataType: "json",
        cache: false,
        success: function (response) {
          if (response.status === "success") {
            $("#alertMessage").html(
              "<div class='alert alert-success alert-dismissible'>" +
                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
                "<strong>" +
                response.message +
                "</strong>" +
                "</div>"
            );
            $("#contactForm").trigger("reset"); // Reset form on success
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
        },
        error: function (xhr, textStatus, errorThrown) {
          $("#alertMessage").html(
            "<div class='alert alert-danger alert-dismissible'>" +
              "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
              "<strong>Ajax Error: " +
              errorThrown +
              "</strong>" +
              "</div>"
          );
        },
        complete: function () {
          // Re-enable submit button after AJAX completes
          $("#sendMessageButton").prop("disabled", false);
          $("#sendMessageButton span").text("Arata-mi lectia demo");
          $("#sendMessageButton div").addClass("d-none");
        },
      });
    },
  });

  // -------------- Initialize form validation for #popupContactForm
  $(
    "#popupContactForm input, #popupContactForm textarea"
  ).jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      // Fetch form data for #popupContactForm
      var name = $("input#name").val();
      var email = $("input#email").val();
      var mobile = $("input#mobile").length
        ? $("input#mobile").val()
        : "noMobile";

      var message = $("textarea#message").val();

      // Disable submit button during AJAX request
      $("#sendPopupMessageButton").prop("disabled", true);
      $("#sendPopupMessageButton").text("Se trimite...");
      $("#sendPopupMessageButton div").removeClass("d-none");

      // Perform AJAX submission for #popupContactForm
      $.ajax({
        url: "./js/mailer/contact.form.php", // Adjust the URL as per your PHP script
        type: "POST",
        data: {
          name: name,
          email: email,
          mobile: mobile,
          message: message,
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

            $("#popupContactForm").trigger("reset"); // Reset form on success
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
          // Re-enable submit button after AJAX completes
          $("#sendPopupMessageButton").prop("disabled", false);
          $("#sendPopupMessageButton span").text("Arata-mi lectia demo");
          $("#sendPopupMessageButton div").addClass("d-none");
        },
      });
    },
  });

  // Disable submit buttons initially
  $("#sendMessageButton, #sendPopupMessageButton").prop("disabled", true);

  // Enable submit buttons when all required fields are valid
  $("#contactForm, #popupContactForm").on("change keyup", function () {
    var $form = $(this);
    var isValid = true;
    $form.find("input, textarea").each(function () {
      if (!$(this).val().trim()) {
        isValid = false;
        return false; // Exit each loop early
      }
    });
    $form.find("button[type='submit']").prop("disabled", !isValid);
  });

  // Clear error messages on focus
  $(
    "#name, #email, #message, #popupContactForm input, #popupContactForm textarea"
  ).focus(function () {
    $("#alertMessage, #popupAlertMessage").html("");
  });
})(jQuery);
