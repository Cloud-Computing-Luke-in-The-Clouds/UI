// src/Auth.js
import React from 'react';
import { loginWithGoogle } from './auth';

const Auth = () => {
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to AcadeMingle</h2>
        <p>Connect with researchers worldwide</p>
        
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

