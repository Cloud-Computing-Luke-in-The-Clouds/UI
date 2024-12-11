import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import ResearcherCard from './components/ResearcherCard';
import SwipeButtons from './components/SwipeButtons';
import UserProfile from './components/UserProfile';
import ResearcherProfile from './components/ResearcherProfile';
import Auth from './components/Auth';
import { account } from './components/appwrite';
import jwt_encode from 'jwt-encode';
import axios from 'axios';

function App() {
  const [researchers, setResearchers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('discover');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const userProfileRef = useRef(null);
  const researcherProfileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await account.get();
      if (!session) {
        setError('No session found. Please log in.');
        return;
      }
      
      const tokenPayload = {
        userId: session.$id,
        email: session.email,
        name: session.name,
      };
      const token = jwt_encode(tokenPayload, 'test');
      
      setUserProfile({ 
        ...session, 
        accessToken: token,
      });
      
      setIsAuthenticated(true);
      await fetchResearchers(token, session.email);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication failed. Please try again.');
      setIsAuthenticated(false);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setIsAuthenticated(false);
      setUserProfile(null);
      setCurrentPage('discover');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchResearchers = async () => {
    try {
      const response = await fetch('https://researcher-profile-265479170833.us-central1.run.app/researchers');
      const data = await response.json();
      const transformedData = data.items.map((researcher) => ({
        user_id: researcher.user_id,
        imageUrl: researcher.image_url,
        google_scholar_link: researcher.google_scholar_link,
        personal_website_link: researcher.personal_website_link,
        organization: researcher.organization,
        title: researcher.title,
      }));

      // Create a new array to store the updated researchers
      const updatedResearchers = [];
      
      for (const researcher of transformedData) {
        try {
          if (researcher.user_id === userProfile?.email) {
            continue;
          }
          const response = await axios.get(`http://34.31.64.142:8080/user/${encodeURIComponent(researcher.user_id)}`, {
            headers: {
              // 'Authorization': `Bearer ${userProfile.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Combine researcher profile with user profile data
          updatedResearchers.push({
            ...researcher,
            name: response.data.name,
            age: response.data.age,
            sex: response.data.sex,
            interest_list: response.data.interest_list
          });
        } catch (error) {
          console.error(`Error fetching user data for ${researcher.user_id}:`, error);
          // Add researcher without user profile data if fetch fails
          updatedResearchers.push(researcher);
        }
      }

      // Update state once with all the data
      setResearchers(updatedResearchers);
      console.log(updatedResearchers);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching researchers:', error);
      setLoading(false);
    }
  };

  const handleSwipe = (direction) => {
    if (researchers.length === 0) return;
    console.log(`Swiped ${direction} on ${researchers[currentIndex].name}`);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % researchers.length);
  };

  const handleProfileSave = async (updatedProfile) => {
    try {
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfile,
        prefs: {
          ...prev.prefs,
          interests: updatedProfile.interest_list,
          age: updatedProfile.age,
          sex: updatedProfile.sex
        }
      }));

      // Update Appwrite preferences
      await account.updatePrefs({
        interests: updatedProfile.interest_list,
        age: updatedProfile.age,
        sex: updatedProfile.sex
      });

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'discover':
        return (
          <>
            <ResearcherCard researcher={researchers[currentIndex]} />
            <SwipeButtons 
              onSwipe={handleSwipe} 
              userProfile={userProfile}
              currentResearcher={researchers[currentIndex]}
            />
          </>
        );
      case 'user-profile':
        return <UserProfile 
          ref={userProfileRef}
          userProfile={userProfile} 
          onSave={handleProfileSave} 
        />;
      case 'researcher-profile':
        return <ResearcherProfile 
          ref={researcherProfileRef}
          userProfile={userProfile} 
          onSave={handleProfileSave} 
        />;
      default:
        return <div>Page not found</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">AcadeMingle</div>
        </nav>
        <main className="main-content">
          <Auth onLogin={checkAuthStatus} />
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={checkAuthStatus} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">AcadeMingle</div>
        <div className="nav-menu">
          <button 
            className={`nav-item ${currentPage === 'discover' ? 'active' : ''}`}
            onClick={() => setCurrentPage('discover')}
          >
            <i className="fas fa-search"></i>
            <span>Discover</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'user-profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('user-profile')}
          >
            <i className="fas fa-user"></i>
            <span>User Profile</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'researcher-profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('researcher-profile')}
          >
            <i className="fas fa-graduation-cap"></i>
            <span>Researcher Profile</span>
          </button>
          <button 
            className="nav-item"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
