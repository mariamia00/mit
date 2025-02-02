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
    const videoSection = videoContainer.parentElement;
    const videoFolderRef = storageRef(storage, "testimonial-videos");

    // Get all video files from Firebase
    const result = await listAll(videoFolderRef);

    // Clear existing videos
    videoContainer.innerHTML = "";

    // If no videos are found, display "Coming Soon" message (only once)
    if (result.items.length === 0) {
      videoSection.innerHTML = `<div class="text-center"><h5>Coming Soon</h5></div>`;
      return;
    }

    // Loop through videos and create video elements
    for (const item of result.items) {
      const url = await getDownloadURL(item);
      const videoTitle = item.name.replace(".mp4", ""); // Remove file extension

      const videoElement = document.createElement("div");
      videoElement.classList.add("item");
      videoElement.innerHTML = `
        <div class="video-item">
          <div class="video-title text-center">
            <h5>${videoTitle}</h5>
          </div>
          <video class="w-100 rounded video-player" controls>
            <source src="${url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;

      videoContainer.appendChild(videoElement);
    }

    // ✅ Initialize Owl Carousel AFTER videos are loaded
    initializeVideoCarousel();

    // ✅ Ensure only one video plays at a time
    setupSingleVideoPlay();
  } catch (error) {
    console.error("Error fetching videos:", error);
    // Show "Coming Soon" only once if an error occurs
    const videoSection =
      document.getElementById("video-carousel").parentElement;
    videoSection.innerHTML = `<div class="text-center"><h5>Coming Soon</h5></div>`;
  }
}

// ✅ Function to Initialize Owl Carousel
function initializeVideoCarousel() {
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
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 3 },
    },
  });
}

// ✅ Function to Make Sure Only One Video Plays at a Time
function setupSingleVideoPlay() {
  const videos = document.querySelectorAll(".video-player");

  videos.forEach((video) => {
    video.addEventListener("play", function () {
      // Pause all other videos except the one being played
      videos.forEach((otherVideo) => {
        if (otherVideo !== video) {
          otherVideo.pause();
          otherVideo.currentTime = 0; // Optional: Reset video progress
        }
      });
    });
  });
}

// ======================= EVENT LISTENERS =======================

// Fetch and display testimonials on page load
document.addEventListener("DOMContentLoaded", fetchApprovedReviews);

// Fetch and display video testimonials on page load
document.addEventListener("DOMContentLoaded", fetchVideoTestimonials);
