(function ($) {
  "use strict";

  $("#popupContactForm input").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // Additional error handling if needed
    },
    submitSuccess: function ($form, event) {
      event.preventDefault(); // Prevent default form submission

      var name = $("input#name").val();
      var email = $("input#email").val();

      $("#sendPopupMessageButton").prop("disabled", true);
      $("#sendPopupMessageButton").text("Se trimite...");
      $("#sendPopupMessageButton div").removeClass("d-none");

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
