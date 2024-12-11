// src/Auth.js
import React, { useState } from 'react';
import { loginWithGoogle, getUser } from './base_auth';
import './Auth.css';

const Auth = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      const userData = await getUser();
      if (userData) {
        console.log('User logged in:', userData);
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <i className="fas fa-graduation-cap logo-icon"></i>
            <div className="logo-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
            </div>
          </div>
          <h1>AcadeMingle</h1>
          <p className="auth-subtitle">Where Academic Minds Connect</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="feature-text">
              <h3>Network</h3>
              <p>Connect with fellow academics worldwide</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="feature-text">
              <h3>Share</h3>
              <p>Exchange research ideas and interests</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="feature-text">
              <h3>Collaborate</h3>
              <p>Find research partners and opportunities</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className={`google-signin-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Signing in...
            </>
          ) : (
            <>
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google logo" 
                className="google-icon"
              />
              Sign in with Google
            </>
          )}
        </button>

        <p className="terms-text">
          By signing in, you agree to our{' '}
          <a href="/terms" className="terms-link">Terms of Service</a> and{' '}
          <a href="/privacy" className="terms-link">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;

