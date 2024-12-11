import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const UserProfile = forwardRef(({ userProfile, onSave }, ref) => {
  const fetchedRef = useRef(false);
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
    if (userProfile?.email && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchOrCreateProfile();
    }
  }, [userProfile]);

  useImperativeHandle(ref, () => ({
    fetchOrCreateProfile
  }));

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

  if (loading) return <div className="loading">Loading profile...</div>;
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
          <p>
            <strong>Interests:</strong> 
            {profile.interest_list && profile.interest_list.length > 0 
              ? profile.interest_list.join(', ') 
              : 'No interests added yet'}
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
              value={(profile.interest_list && profile.interest_list.length > 0) 
                ? profile.interest_list.join(', ') 
                : ''}
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
});

export default UserProfile;