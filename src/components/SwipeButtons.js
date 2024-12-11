import React from 'react';
import axios from 'axios';
import './SwipeButtons.css';

function SwipeButtons({ onSwipe, userProfile, currentResearcher }) {
  const handleLike = async () => {
    try {
      console.log(currentResearcher);
      if (currentResearcher && userProfile?.email) {
        await axios.post(`http://34.171.223.208:8080/like_researcher/?user_email=${encodeURIComponent(userProfile.email)}&researcher_email=${encodeURIComponent(currentResearcher.user_id)}&researcher_name=${encodeURIComponent(currentResearcher.name || 'Researcher')}`, {}, {
          headers: {
            'Authorization': `Bearer ${userProfile.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
      // Call the original onSwipe after successful like
      onSwipe('right');
    } catch (error) {
      console.error('Error liking researcher:', error);
      // Still call onSwipe to move to next card even if like fails
      onSwipe('right');
    }
  };

  return (
    <div className="swipe-buttons">
      <button 
        className="swipe-button pass"
        onClick={() => onSwipe('left')}
        aria-label="Pass"
      >
        <i className="fas fa-times"></i>
      </button>
      <button 
        className="swipe-button like"
        onClick={handleLike}
        aria-label="Like"
      >
        <i className="fas fa-heart"></i>
      </button>
    </div>
  );
}

export default SwipeButtons;
