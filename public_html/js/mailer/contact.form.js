(function ($) {
  "use strict";

  // Initialize form validation
  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      // Fetch form data
      var name = $("input#name").val();
      var email = $("input#email").val();
      var subject = $("input#subject").val();
      var message = $("textarea#message").val();
      var mobile = $("input#mobile").length
        ? $("input#mobile").val()
        : "noMobile";

      // Disable submit button during AJAX request
      $("#sendMessageButton").prop("disabled", true);
      $("#sendMessageButton span").text("Se trimite...");
      $("#sendMessageButton div").removeClass("d-none");

      // Perform AJAX submission
      $.ajax({
        url: "./js/mailer/contact.form.php",
        type: "POST",
        data: {
          name: name,
          email: email,
          mobile: mobile,
          subject: subject,
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
          $("#sendMessageButton span").text("Trimite mesaj");
          $("#sendMessageButton div").addClass("d-none");
        },
      });
    },
  });

  // Disable submit button initially
  $("#sendMessageButton").prop("disabled", true);

  // Enable submit button when all required fields are valid
  $("#contactForm").on("change keyup", function () {
    var isValid = true;
    $("#contactForm input, #contactForm textarea").each(function () {
      if (!$(this).val().trim()) {
        isValid = false;
        return false; // Exit each loop early
      }
    });
    $("#sendMessageButton").prop("disabled", !isValid);
  });

  // Clear error messages on focus
  $("#name, #email, #subject, #message").focus(function () {
    $("#alertMessage").html("");
  });
})(jQuery);
