import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const ResearcherProfile = forwardRef(({ userProfile, onSave }, ref) => {
  const fetchedRef = useRef(false);
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
    if (userProfile?.email && !fetchedRef.current) {
      fetchedRef.current = true;
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
      if (onSave) {
        onSave(profile);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchOrCreateProfile
  }));

  if (loading) return <div className="loading">Loading researcher profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="researcher-profile-container">
      <h2>Researcher Profile</h2>
      
      {!isEditing ? (
        <div className="profile-view">
          <p><strong>Email:</strong> {userProfile?.email}</p>
          <p><strong>Title:</strong> {profile?.title || 'Not specified'}</p>
          <p><strong>Organization:</strong> {profile?.organization || 'Not specified'}</p>
          <p><strong>Google Scholar:</strong> 
            {profile?.google_scholar_link ? (
              <a href={profile?.google_scholar_link} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            ) : 'Not provided'}
          </p>
          <p><strong>Personal Website:</strong> 
            {profile?.personal_website_link ? (
              <a href={profile?.personal_website_link} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            ) : 'Not provided'}
          </p>
          <p><strong>Profile Image:</strong> 
            {profile?.image_url ? (
              <img src={profile?.image_url} alt="Profile" style={{maxWidth: '200px', display: 'block', marginTop: '10px'}} />
            ) : 'No image uploaded'}
          </p>
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={profile?.title || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Professor, Research Scientist"
            />
          </div>

          <div className="form-group">
            <label>Organization:</label>
            <input
              type="text"
              name="organization"
              value={profile?.organization || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Columbia University"
            />
          </div>

          <div className="form-group">
            <label>Google Scholar Link:</label>
            <input
              type="url"
              name="google_scholar_link"
              value={profile?.google_scholar_link || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://scholar.google.com/..."
            />
          </div>

          <div className="form-group">
            <label>Personal Website:</label>
            <input
              type="url"
              name="personal_website_link"
              value={profile?.personal_website_link || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Profile Image URL:</label>
            <input
              type="url"
              name="image_url"
              value={profile?.image_url || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://..."
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
});

export default ResearcherProfile;