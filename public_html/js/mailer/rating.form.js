import {
  db,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  push,
  dbRef,
} from "./firebase.connect.js";

// URL for the default image
const defaultImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/informatic-mit.appspot.com/o/userReviews%2Fplaceholder-review.png?alt=media&token=949d9f03-63ad-44df-9a90-e7e38ce90f87";

function saveRatingData(rating, name, comment, imageFile) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString(); // Generate timestamp
    if (imageFile) {
      // Upload the image to Firebase Storage
      const storageReference = storageRef(
        storage,
        "userReviews/" + imageFile.name
      );
      uploadBytes(storageReference, imageFile)
        .then((snapshot) => {
          console.log("Upload snapshot:", snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          return push(dbRef(db, "reviews/"), {
            rating: rating,
            name: name,
            comment: comment,
            imageUrl: downloadURL,
            timestamp: timestamp, // Ensure this is included
            status: "pending", // Default status
          });
        })
        .then(() => resolve("Rating submitted successfully!"))
        .catch((error) => {
          console.error("Error during upload or database push: ", error);
          reject("Error during upload or database push.");
        });
    } else {
      // No image file, use default image URL
      push(dbRef(db, "reviews/"), {
        rating: rating,
        name: name,
        comment: comment,
        imageUrl: defaultImageUrl,
        timestamp: timestamp, // Ensure this is included
        status: "pending",
      })
        .then(() => resolve("Rating submitted successfully!"))
        .catch((error) => {
          console.error("Error during database push: ", error);
          reject("Error during database push.");
        });
    }
  });
}

// Document Ready Function
$(document).ready(function () {
  $("#popupRatingForm").on("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Clear previous alert messages
    $("#ratingAlertMessage").html("");

    // Get form values
    const rating = $("input[name='rating']:checked").val() || "5"; // Default to 5 stars if no rating is selected
    const name = $("#ratingName").val().trim();
    const comment = $("#ratingComment").val().trim();
    const imageFile = $("#ratingImage")[0]?.files[0]; // Use optional chaining

    // Validate form fields
    if (!name || !comment) {
      $("#ratingAlertMessage").html(
        "<div class='alert alert-danger alert-dismissible'>" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
          "<strong>Va rugam sa completati toate campurile.</strong>" +
          "</div>"
      );
      $("#submitRatingButton").prop("disabled", false);
      $("#submitRatingButton").text("Trimite recenzia");
      return;
    }

    $("#submitRatingButton").prop("disabled", true);
    $("#submitRatingButton").text("Se trimite...");

    // Call the function to save the rating data
    saveRatingData(rating, name, comment, imageFile)
      .then(() => {
        $("#ratingAlertMessage").html(
          "<div class='alert alert-success alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>Multumim pentru recenzie!</strong>" + // Corrected concatenation
            "</div>"
        );
        // Reset the form
        $("#popupRatingForm")[0].reset();
        // Re-check the default rating button (5 stars) after form reset
        $("input[name='rating1'][value='5']").prop("checked", true);
        // Re-enable the submit button
        $("#submitRatingButton").prop("disabled", false);
        $("#submitRatingButton").text("Trimite recenzia");
      })
      .catch((error) => {
        $("#ratingAlertMessage").html(
          "<div class='alert alert-danger alert-dismissible'>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-hidden='true'></button>" +
            "<strong>A aparut o eroare la trimitere. Incercati din nou mai tarziu.</strong>" +
            "</div>"
        );
        console.error("Error during form submission:", error);
        $("#submitRatingButton").prop("disabled", false);
        $("#submitRatingButton").text("Trimite recenzia");
      });
  });

  // Form validation logic
  $("#popupRatingForm input, #popupRatingForm textarea").on(
    "input",
    function () {
      const rating = $("input[name='rating1']:checked").val() || "5";
      const name = $("#ratingName").val().trim();
      const comment = $("#ratingComment").val().trim();
      const isFormValid = rating && name && comment;

      $("#submitRatingButton").prop("disabled", !isFormValid);
    }
  );

  $("#popupRatingForm").on("reset", function () {
    // Reset the default rating to 5 stars
    $("input[name='rating1'][value='5']").prop("checked", true);
    // Re-enable the submit button
    $("#submitRatingButton").prop("disabled", false);
    setTimeout(function () {
      $("#ratingAlertMessage").html("");
    }, 1500);
  });
});
