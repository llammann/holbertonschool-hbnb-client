document.addEventListener('DOMContentLoaded', () => {
  const token = checkAuthentication();
  const placeId = getPlaceIdFromURL();

  if (!placeId) {
      alert('Invalid place ID');
      window.location.href = 'index.html';
  }

  if (token) {
      const reviewForm = document.getElementById('review-form');
      if (reviewForm) {
          reviewForm.addEventListener('submit', async (event) => {
              event.preventDefault();
              const comment = document.getElementById('comment').value;
              const rating = document.getElementById('rating').value;
              await submitReview(token, placeId, comment, rating);
          });
      }
  }
});

function checkAuthentication() {
  const token = getCookie('token');
  if (!token) {
      window.location.href = 'index.html';
  }
  return token;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function submitReview(token, placeId, comment, rating) {
  try {
      const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}/reviews`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment, rating })
      });

      handleResponse(response);
  } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting the review.');
  }
}

function handleResponse(response) {
  if (response.ok) {
      alert('Review submitted successfully!');
      document.getElementById('review-form').reset();
      // Optionally redirect or update the page
      window.location.href = 'index.html'; // Redirect to index page or show a success message
  } else {
      response.json().then(data => {
          alert('Failed to submit review: ' + (data.error || response.statusText));
      });
  }
}
