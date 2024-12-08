import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userProfile, onSave }) => {
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    sex: userProfile?.sex || '',
    interest_list: userProfile?.interest_list || []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || '',
        age: userProfile.age || '',
        sex: userProfile.sex || '',
        interest_list: userProfile.interest_list || []
      });
    }
  }, [userProfile]);

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
      // Update this URL to match your actual API endpoint
      await axios.put(`http://13.115.67.82:8000/user/${userProfile.$id}`, profile, {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      
      {!isEditing ? (
        <div className="profile-view">
          <p><strong>Email:</strong> {userProfile?.email}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Sex:</strong> {profile.sex}</p>
          <p><strong>Interests:</strong> {profile.interest_list.join(', ')}</p>
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
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Sex:</label>
            <select 
              name="sex" 
              value={profile.sex} 
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interests (comma-separated):</label>
            <input
              type="text"
              value={profile.interest_list.join(', ')}
              onChange={handleInterestChange}
              className="form-input"
              placeholder="e.g., AI, Machine Learning, Data Science"
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
};

export default UserProfile;