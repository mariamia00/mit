import { db, dbRef, get } from "./mailer/firebase.connect.js";

// Function to fetch reviews
async function fetchApprovedReviews() {
  try {
    const reviewsRef = dbRef(db, "reviews/");
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      const reviews = snapshot.val();
      const reviewsContainer = document.getElementById("testimonial-carousel");

      // Clear existing reviews
      reviewsContainer.innerHTML = "";

      // Loop through the reviews
      Object.keys(reviews).forEach((key) => {
        const review = reviews[key];

        // Only display approved reviews
        if (review.status === "approved") {
          // Create review element
          const reviewElement = createReviewElement(review);
          reviewsContainer.appendChild(reviewElement);
        }
      });

      // Initialize or reinitialize the Owl Carousel
      $(reviewsContainer).owlCarousel("destroy"); // Destroy existing carousel if it exists
      // Testimonials carousel
      $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: false,
        loop: true,
        nav: true,
        navText: [
          '<i class="bi bi-chevron-left"></i>',
          '<i class="bi bi-chevron-right"></i>',
        ],
        responsive: {
          0: {
            items: 1,
          },
          768: {
            items: 2,
          },
          992: {
            items: 3,
          },
        },
      });
    } else {
      console.log("No reviews found");
    }
  } catch (error) {
    console.error("Error fetching reviews: ", error);
  }
}

// Function to create review element
function createReviewElement(review) {
  const filledStars = '<i class="fas fa-star star-checked"></i>'.repeat(
    review.rating
  );
  const emptyStars = '<i class="fas fa-star star-unchecked"></i>'.repeat(
    5 - review.rating
  );

  const reviewHTML = `
    <div class="testimonial-item text-center">
      <img
        class="border rounded-circle p-2 mx-auto mb-3"
        src="${review.imageUrl}"
        style="width: 80px; height: 80px"
      />
      <h5 class="mb-0">${review.name}</h5>
      <div class="mb-2">
        ${filledStars}
        ${emptyStars}
      </div>
      <div
        class="testimonial-text bg-light text-center p-4 d-flex align-items-center"
        >
        <p class="mb-0 w-100">
          ${review.comment}
        </p>
      </div>
    </div>
  `;

  const reviewElement = document.createElement("div");
  reviewElement.innerHTML = reviewHTML.trim();
  return reviewElement.firstElementChild;
}

// ======================= EVENT LISTENERS =======================
// Fetch and display testimonials on page load
document.addEventListener("DOMContentLoaded", fetchApprovedReviews);
