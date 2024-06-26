(function ($) {
  "use strict";

  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      var name = $("input#name").val();
      var email = $("input#email").val();
      var mobile = $("input#mobile").length
        ? $("input#mobile").val()
        : "noMobile";
      var message = $("textarea#message").val();

      $("#sendMessageButton").prop("disabled", true);
      $("#sendMessageButton span").text("Se trimite...");
      $("#sendMessageButton div").removeClass("d-none");

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
          $("#sendMessageButton").prop("disabled", false);
          $("#sendMessageButton span").text("Arata-mi lectia demo");
          $("#sendMessageButton div").addClass("d-none");
        },
      });
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
