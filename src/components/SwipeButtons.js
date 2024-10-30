import React from 'react';
import './SwipeButtons.css';

function SwipeButtons({ onSwipe }) {
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
        className="swipe-button superlike"
        onClick={() => onSwipe('up')}
        aria-label="Super Like"
      >
        <i className="fas fa-star"></i>
      </button>
      
      <button 
        className="swipe-button like"
        onClick={() => onSwipe('right')}
        aria-label="Like"
      >
        <i className="fas fa-heart"></i>
      </button>
    </div>
  );
}

export default SwipeButtons;
