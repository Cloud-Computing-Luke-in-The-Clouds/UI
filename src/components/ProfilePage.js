import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage({ userProfile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    title: userProfile?.title || '',
    organization: userProfile?.organization || '',
    field_of_study: userProfile?.field_of_study || '',
    google_scholar_link: userProfile?.google_scholar_link || '',
    personal_website_link: userProfile?.personal_website_link || '',
    bio: userProfile?.bio || '',
    email: userProfile?.email || '',
    research_interests: userProfile?.research_interests || []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={userProfile?.imageUrl || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="profile-image"
          />
          {editing && (
            <button className="change-photo-btn">
              <i className="fas fa-camera"></i>
            </button>
          )}
        </div>
        <h2>{userProfile?.name || 'Your Name'}</h2>
        <p className="profile-title">{userProfile?.title || 'Title'}</p>
      </div>

      {!editing ? (
        <div className="profile-info">
          <button 
            className="edit-button"
            onClick={() => setEditing(true)}
          >
            <i className="fas fa-edit"></i> Edit Profile
          </button>

          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-item">
              <i className="fas fa-user"></i>
              <span>Name:</span> {userProfile?.name}
            </div>
            <div className="info-item">
              <i className="fas fa-birthday-cake"></i>
              <span>Age:</span> {userProfile?.age}
            </div>
            <div className="info-item">
              <i className="fas fa-university"></i>
              <span>Organization:</span> {userProfile?.organization}
            </div>
            <div className="info-item">
              <i className="fas fa-graduation-cap"></i>
              <span>Title:</span> {userProfile?.title}
            </div>
          </div>

          <div className="info-section">
            <h3>Academic Information</h3>
            <div className="info-item">
              <i className="fas fa-book"></i>
              <span>Field of Study:</span> {userProfile?.field_of_study}
            </div>
            <div className="info-item">
              <i className="fas fa-link"></i>
              <span>Google Scholar:</span> 
              <a href={userProfile?.google_scholar_link} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </div>
            <div className="info-item">
              <i className="fas fa-globe"></i>
              <span>Personal Website:</span>
              <a href={userProfile?.personal_website_link} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </div>
          </div>
        </div>
      ) : (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Academic Information</h3>
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Google Scholar Link</label>
              <input
                type="url"
                name="google_scholar_link"
                value={formData.google_scholar_link}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Personal Website</label>
              <input
                type="url"
                name="personal_website_link"
                value={formData.personal_website_link}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage; 