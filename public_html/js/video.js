import {
  storage,
  storageRef,
  getDownloadURL,
} from "./mailer/firebase.connect.js";

// Function to load video URL and update the video element
function loadVideo() {
  // Reference to the video file in Firebase Storage
  const videoPath = "tutorial.mp4"; // Adjust the path as needed
  const videoRef = storageRef(storage, videoPath);

  // Get the download URL
  getDownloadURL(videoRef)
    .then((url) => {
      // Get the video element
      const videoElement = document.getElementById("myVideo");

      // Set the src attribute of the video element
      videoElement.src = url;
    })
    .catch((error) => {
      console.error("Error fetching video URL:", error);
    });
}

// Call the function to load the video
loadVideo();
