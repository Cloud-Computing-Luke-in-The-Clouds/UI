import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import axios from 'axios';

function UserProfile({ userProfile }) {
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    sex: userProfile?.sex || '',
    interest_list: userProfile?.interest_list || []
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
      // Encode the email for the URL
      const encodedEmail = encodeURIComponent(userProfile.email);
      
      // First try to get the existing profile
      const response = await axios.get(`http://34.31.64.142:8080/user/${encodedEmail}`, {
        headers: {
          'Authorization': `Bearer ${userProfile.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setProfile(response.data);
      
    } catch (err) {
      if (err.response?.status === 404) {
        // If profile doesn't exist, create a new one
        try {
          const newProfile = {
            user_id: userProfile.email,  // Use raw email for the body
            name: userProfile.name || '',
            age: null,
            sex: null,
            interest_list: []
          };
          const createResponse = await axios.post('http://34.31.64.142:8080/user', newProfile, {
            headers: {
              'Authorization': `Bearer ${userProfile.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          setProfile(createResponse.data);
        } catch (createErr) {
          setError('Failed to create profile');
          console.error('Profile creation error:', createErr);
        }
      } else {
        setError('Failed to load profile');
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

  const handleInterestChange = (e) => {
    const interests = e.target.value.split(',').map(item => item.trim());
    setProfile(prev => ({
      ...prev,
      interest_list: interests
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Encode the email for the URL
      const encodedEmail = encodeURIComponent(userProfile.email);
      
      await axios.put(`http://34.31.64.142:8080/user/${encodedEmail}`, profile, {
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

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <p className="subtitle">Manage your personal information</p>
      </div>
      
      {error && (
        <div className="error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-field">
            <i className="fas fa-envelope"></i>
            <div>
              <label>Email</label>
              <p>{userProfile?.email}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-user"></i>
            <div>
              <label>Name</label>
              <p>{profile.name || 'Not specified'}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-birthday-cake"></i>
            <div>
              <label>Age</label>
              <p>{profile.age || 'Not specified'}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-venus-mars"></i>
            <div>
              <label>Sex</label>
              <p>{profile.sex || 'Not specified'}</p>
            </div>
          </div>

          <div className="profile-field">
            <i className="fas fa-heart"></i>
            <div>
              <label>Interests</label>
              <p>
                {profile.interest_list && profile.interest_list.length > 0 
                  ? profile.interest_list.map((interest, index) => (
                      <span key={index} className="interest-tag">
                        {interest}
                      </span>
                    ))
                  : 'No interests added yet'}
              </p>
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
              <i className="fas fa-user"></i> Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-birthday-cake"></i> Age
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your age"
              min="0"
              max="120"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-venus-mars"></i> Sex
            </label>
            <select 
              name="sex" 
              value={profile.sex} 
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select your sex...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-heart"></i> Interests
            </label>
            <input
              type="text"
              value={(profile.interest_list && profile.interest_list.length > 0) 
                ? profile.interest_list.join(', ') 
                : ''}
              onChange={handleInterestChange}
              className="form-input"
              placeholder="e.g., AI, Machine Learning, Data Science"
            />
            <small className="form-help">Separate interests with commas</small>
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

export default UserProfile;