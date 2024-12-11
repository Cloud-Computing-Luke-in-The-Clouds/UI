import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import axios from 'axios';

function ResearcherProfile({ userProfile }) {
  const [profile, setProfile] = useState({
    user_id: userProfile?.email || '',
    image_url: '',
    google_scholar_link: '',
    personal_website_link: '',
    organization: '',
    title: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userProfile?.email) {
      fetchOrCreateProfile();
    }
  }, [userProfile]);

  const fetchOrCreateProfile = async () => {
    if (!userProfile?.email) return;
    
    try {
      const encodedEmail = encodeURIComponent(userProfile.email);
      const response = await axios.get(`https://researcher-profile-265479170833.us-central1.run.app/researcher/${encodedEmail}`, {
        headers: {
          'Authorization': `Bearer ${userProfile.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProfile(response.data);
      
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const newProfile = {
            user_id: userProfile.email,
            image_url: '',
            google_scholar_link: '',
            personal_website_link: '',
            organization: '',
            title: ''
          };
          
          const createResponse = await axios.post('https://researcher-profile-265479170833.us-central1.run.app/researcher', newProfile, {
            headers: {
              'Authorization': `Bearer ${userProfile.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          setProfile(createResponse.data);
        } catch (createErr) {
          setError('Failed to create researcher profile');
          console.error('Profile creation error:', createErr);
        }
      } else {
        setError('Failed to load researcher profile');
        console.error('Profile fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const encodedEmail = encodeURIComponent(userProfile.email);
      await axios.put(`https://researcher-profile-265479170833.us-central1.run.app/researcher/${encodedEmail}`, profile, {
        headers: {
          'Authorization': `Bearer ${userProfile.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading researcher profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>Researcher Profile</h2>
        <p className="subtitle">Manage your research information</p>
      </div>

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-field profile-image-field">
            <i className="fas fa-image"></i>
            <div>
              <label>Profile Image</label>
              {profile.image_url ? (
                <div className="profile-image-container">
                  <img 
                    src={profile.image_url} 
                    alt="Profile" 
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
              ) : (
                <p>No image uploaded</p>
              )}
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-envelope"></i>
            <div>
              <label>Email</label>
              <p>{userProfile?.email}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-university"></i>
            <div>
              <label>Organization</label>
              <p>{profile.organization || 'Not specified'}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-user-graduate"></i>
            <div>
              <label>Title</label>
              <p>{profile.title || 'Not specified'}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-graduation-cap"></i>
            <div>
              <label>Google Scholar</label>
              {profile.google_scholar_link ? (
                <p>
                  <a href={profile.google_scholar_link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="interest-tag">
                    View Profile <i className="fas fa-external-link-alt"></i>
                  </a>
                </p>
              ) : (
                <p>Not specified</p>
              )}
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-globe"></i>
            <div>
              <label>Personal Website</label>
              {profile.personal_website_link ? (
                <p>
                  <a href={profile.personal_website_link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="interest-tag">
                    Visit Website <i className="fas fa-external-link-alt"></i>
                  </a>
                </p>
              ) : (
                <p>Not specified</p>
              )}
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`profile-form ${loading ? 'loading' : ''}`}>
          <div className="form-group">
            <label>
              <i className="fas fa-image"></i> Profile Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={profile.image_url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com/your-image.jpg"
            />
            <small className="form-help">Enter the URL of your profile image (JPEG, PNG formats recommended)</small>
            
            {profile.image_url && (
              <div className="image-preview">
                <img 
                  src={profile.image_url} 
                  alt="Profile Preview" 
                  className="preview-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-profile.png';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-university"></i> Organization
            </label>
            <input
              type="text"
              name="organization"
              value={profile.organization}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your organization"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-user-graduate"></i> Title
            </label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your academic title"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-graduation-cap"></i> Google Scholar Link
            </label>
            <input
              type="url"
              name="google_scholar_link"
              value={profile.google_scholar_link}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://scholar.google.com/..."
            />
            <small className="form-help">Enter the full URL to your Google Scholar profile</small>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-globe"></i> Personal Website
            </label>
            <input
              type="url"
              name="personal_website_link"
              value={profile.personal_website_link}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://..."
            />
            <small className="form-help">Enter the full URL to your personal website</small>
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ResearcherProfile;