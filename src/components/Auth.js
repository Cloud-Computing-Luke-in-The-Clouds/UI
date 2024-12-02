// src/Auth.js
import React, { useState } from 'react';
import { loginWithGoogle, getUser } from './auth';

const Auth = () => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // After successful login, get user data
      const userData = await getUser();
      if (userData) {
        console.log('User logged in:', userData);
        // You can now use userData.email, userData.id, etc.
        // to make requests to your backend
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to AcadeMingle</h2>
        <p>Connect with researchers worldwide</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <button
          onClick={handleGoogleLogin}
          className="google-signin-btn"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google logo" 
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;

