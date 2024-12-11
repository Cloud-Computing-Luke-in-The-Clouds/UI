import React from 'react';
import './ResearcherCard.css';

function ResearcherCard({ researcher }) {
  return (
    <div className="researcher-card">
      <div className="card-image-container">
        <img 
          src={researcher.imageUrl || 'default-profile-image.png'} 
          alt={researcher.name || 'Researcher'} 
        />
        <div className="card-gradient"></div>
        <div className="card-info-overlay">
          <h2>
            {researcher.name || 'Anonymous'} 
            {researcher.age ? `, ${researcher.age}` : ''}
          </h2>
          <div className="card-title">{researcher.title || 'Researcher'}</div>
        </div>
      </div>
      
      <div className="card-details">
        <div className="detail-section">
          <div className="detail-item">
            <i className="fas fa-university"></i>
            <span>{researcher.organization || 'Organization not specified'}</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-venus-mars"></i>
            <span>{researcher.sex || 'Not specified'}</span>
          </div>

          <div className="detail-item">
            <i className="fas fa-heart"></i>
            <span>
              {researcher.interest_list && researcher.interest_list.length > 0 
                ? researcher.interest_list.join(', ') 
                : 'No interests listed'}
            </span>
          </div>
        </div>

        <div className="social-links">
          {researcher.google_scholar_link && (
            <a href={researcher.google_scholar_link} 
               target="_blank" 
               rel="noopener noreferrer"
               className="social-button scholar">
              <i className="fas fa-graduation-cap"></i>
              Scholar Profile
            </a>
          )}
          {researcher.personal_website_link && (
            <a href={researcher.personal_website_link} 
               target="_blank" 
               rel="noopener noreferrer"
               className="social-button website">
              <i className="fas fa-globe"></i>
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResearcherCard;