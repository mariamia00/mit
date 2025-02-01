import {
  db,
  dbRef,
  get,
  storageRef,
  storage,
  getDownloadURL,
  listAll,
} from "./mailer/firebase.connect.js";

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
        nav: false,
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

// ======================= VIDEO TESTIMONIAL FETCHING =======================

// Function to fetch videos from Firebase Storage

async function fetchVideoTestimonials() {
  try {
    const videoContainer = document.getElementById("video-carousel");
    const videoFolderRef = storageRef(storage, "testimonial-videos");
    // Get all video files from the folder
    const result = await listAll(videoFolderRef);

    // Clear existing videos before adding new ones
    videoContainer.innerHTML = "";

    // Loop through videos and create video elements
    for (const item of result.items) {
      const url = await getDownloadURL(item);

      const videoElement = document.createElement("div");
      videoElement.classList.add("item");
      videoElement.innerHTML = `
        <video class="w-100 rounded" controls>
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;

      videoContainer.appendChild(videoElement);
    }

    // Destroy previous Owl Carousel if initialized
    $(videoContainer).owlCarousel("destroy");

    // Reinitialize Owl Carousel for videos
    $(".video-carousel").owlCarousel({
      autoplay: true,
      loop: true,
      margin: 10,
      nav: true,
      dots: true,
      items: 1,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        1200: {
          items: 3,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}

// ======================= EVENT LISTENERS =======================

// Fetch and display testimonials on page load
document.addEventListener("DOMContentLoaded", fetchApprovedReviews);

// Fetch and display video testimonials on page load
document.addEventListener("DOMContentLoaded", fetchVideoTestimonials);
