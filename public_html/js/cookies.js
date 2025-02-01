jQuery(document).ready(function ($) {
  "use strict";

  $(document).ready(function () {
    if (localStorage.getItem("cookiesAccepted")) {
      $("#cookieBanner").hide();
    } else if (localStorage.getItem("cookiesRefused")) {
      $("#cookieBanner").hide();
    }

    $("#acceptCookies").click(function () {
      localStorage.setItem("cookiesAccepted", true);
      $("#cookieBanner").hide();
    });

    $("#rejectCookies").click(function () {
      localStorage.setItem("cookiesRefused", true);
      $("#cookieBanner").hide();
    });
  });
});
