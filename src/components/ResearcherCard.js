import React from 'react';
import './ResearcherCard.css';

function ResearcherCard({ researcher }) {
  return (
    <div className="researcher-card">
      <div className="card-image-container">
        <img src={researcher.imageUrl} alt={researcher.name} />
        <div className="card-gradient"></div>
        <div className="card-info-overlay">
          <h2>{researcher.name}, {researcher.age}</h2>
          <div className="card-title">{researcher.title}</div>
        </div>
      </div>
      
      <div className="card-details">
        <div className="detail-section">
          <div className="detail-item">
            <i className="fas fa-university"></i>
            <span>{researcher.organization}</span>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-book"></i>
            <span>{researcher.field_of_study || 'Research Field'}</span>
          </div>

          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{researcher.present ? 'Present at Conference' : 'Not Present'}</span>
          </div>
        </div>

        <div className="social-links">
          <a href={researcher.google_scholar_link} 
             target="_blank" 
             rel="noopener noreferrer"
             className="social-button scholar">
            <i className="fas fa-graduation-cap"></i>
            Scholar Profile
          </a>
          <a href={researcher.personal_website_link} 
             target="_blank" 
             rel="noopener noreferrer"
             className="social-button website">
            <i className="fas fa-globe"></i>
            Website
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResearcherCard;
