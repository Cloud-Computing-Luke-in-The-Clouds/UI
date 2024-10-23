import React from 'react';

function SwipeButtons({ onSwipe }) {
  return (
    <div className="swipe-buttons">
      <button onClick={() => onSwipe('left')}>Pass</button>
      <button onClick={() => onSwipe('right')}>Like</button>
    </div>
  );
}

export default SwipeButtons;
