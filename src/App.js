import React, { useState, useEffect } from 'react';
import './App.css';
import ResearcherCard from './components/ResearcherCard';
import SwipeButtons from './components/SwipeButtons';
import ProfilePage from './components/ProfilePage';

function App() {
  const [researchers, setResearchers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('discover');
  const [userProfile, setUserProfile] = useState({
    // Add default user profile data here
  });

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      const response = await fetch('https://researcher-profile-265479170833.us-central1.run.app/researchers');
      const data = await response.json();
      // Transform the data to match our needed format
      const transformedData = data.items.map((researcher, index) => ({
        imageUrl: researcher.image_url,
        name: researcher.researcher_name,
        field_of_study: "Not specified", // These fields aren't in the API
        school_organization: researcher.organization,
        present: true,
        google_scholar_link: researcher.google_scholar_link,
        personal_website_link: researcher.personal_website_link,
        organization: researcher.organization,
        title: researcher.title,
        age: researcher.age,
        sex: researcher.sex,
        research_papers: [] // API doesn't provide papers info
      }));
      setResearchers(transformedData);
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

  const handleProfileSave = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call to update the profile
    console.log('Saving profile:', updatedProfile);
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'discover':
        return (
          <>
            <ResearcherCard researcher={researchers[currentIndex]} />
            <SwipeButtons onSwipe={handleSwipe} />
          </>
        );
      case 'profile':
        return <ProfilePage userProfile={userProfile} onSave={handleProfileSave} />;
      default:
        return <div>Page not found</div>;
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">AcadeMingle</div>
          <div className="nav-menu">
            <button className="nav-item active">Discover</button>
            <button className="nav-item">Matches</button>
            <button className="nav-item">Messages</button>
            <button className="nav-item">Profile</button>
          </div>
        </nav>
        <div className="loading-screen">Loading...</div>
      </div>
    );
  }

  if (researchers.length === 0) {
    return (
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">AcadeMingle</div>
          <div className="nav-menu">
            <button className="nav-item active">Discover</button>
            <button className="nav-item">Matches</button>
            <button className="nav-item">Messages</button>
            <button className="nav-item">Profile</button>
          </div>
        </nav>
        <div className="no-data">No researchers found</div>
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
          <button className="nav-item">
            <i className="fas fa-heart"></i>
            <span>Matches</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-comment"></i>
            <span>Messages</span>
          </button>
          <button 
            className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
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
