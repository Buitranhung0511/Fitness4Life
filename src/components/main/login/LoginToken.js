import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUserByEmail } from '../../../serviceToken/authService';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/css/Main/login.css';

const LoginToken = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const navigate = useNavigate();

  // Check for token expiration on component mount
  useEffect(() => {
    checkTokenExpiration();
    // Set up interval to check token expiration every minute
    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const checkTokenExpiration = () => {
    const tokenData = localStorage.getItem('tokenData');
    if (!tokenData) return;
    
    try {
      const { access_token, refresh_token, expires_in } = JSON.parse(tokenData);
      const decodedToken = jwtDecode(access_token);
      
      // Check if token is expired or about to expire (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp - currentTime < 300) {
        // Token is expired or about to expire
        if (refresh_token) {
          refreshAuthToken(refresh_token);
        } else {
          handleAutoLogout('Your session has expired. Please login again.');
        }
      }
    } catch (error) {
      handleAutoLogout('Authentication error. Please login again.');
    }
  };

  const refreshAuthToken = async (refreshToken) => {
    try {
      // Implement refresh token API call here
      // For now, we'll just log out as the endpoint isn't provided
      handleAutoLogout('Session expired. Please login again.');
      
      // When you implement the refresh token API:
      // const response = await refreshTokenAPI(refreshToken);
      // localStorage.setItem('tokenData', JSON.stringify(response.data));
    } catch (error) {
      handleAutoLogout('Failed to refresh session. Please login again.');
    }
  };

  const handleAutoLogout = (message) => {
    localStorage.removeItem('tokenData');
    toast.info(message);
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in email and password!');
      return;
    }

    try {
      const data = await loginUser(formData.email, formData.password);
      const { access_token, refresh_token, expires_in } = data;
      
      if (!access_token) {
        toast.error('Login failed: Invalid credentials or server error');
        return;
      }
      
      const decodedToken = jwtDecode(access_token);
      const userEmail = decodedToken?.sub;

      if (!userEmail) {
        toast.error('Invalid token: User information missing');
        return;
      }

      try {
        const userDetails = await getUserByEmail(userEmail, access_token);

        if (!userDetails) {
          toast.error('Failed to retrieve user details');
          return;
        }

        if (!userDetails.active) {
          toast.warning('⚠️ Your account is not active, please contact admin!');
          return;
        }

        // Store token data with expiration info
        const tokenInfo = {
          ...data,
          user: userDetails,
          timestamp: Date.now()
        };
        
        localStorage.setItem('tokenData', JSON.stringify(tokenInfo));
        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          switch (decodedToken.role) {
            case 'ADMIN':
              navigate('/admin/profile');
              break;
            case 'USER':
              navigate('/user/profile');
              break;
            default:
              toast.error('You have not been granted permission to access the system.');
          }
        }, 1500);
      } catch (userError) {
        toast.error(`User verification failed: ${userError.message || 'Unknown error'}`);
      }
    } catch (err) {
      // Enhanced error handling with specific messages
      if (err.message.includes('401')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (err.message.includes('403')) {
        toast.error('Your account has been locked. Please contact administrator.');
      } else if (err.message.includes('server')) {
        toast.error('Server is currently unavailable. Please try again later.');
      } else {
        toast.error(`Login failed: ${err.message}`);
      }
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    // Add registration logic here
    toast.success('Registration successful! Please log in.');
    setIsLoginForm(true);
  };

  return (
    <div className="login-wrapper">
      <h1>{isLoginForm ? 'EXISTING LOGIN FORM' : 'REGISTER FORM'}</h1>
      
      <div className="form-container">
        <h2>{isLoginForm ? 'Login here' : 'Register here'}</h2>
        
        <form onSubmit={isLoginForm ? handleLoginSubmit : handleRegisterSubmit}>
          {!isLoginForm && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="USERNAME"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {!isLoginForm && (
            <>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="CONFIRM PASSWORD"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="acceptTerms">I Accept Terms & Conditions</label>
              </div>
            </>
          )}
          
          {isLoginForm && (
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
          )}
          
          <div className="form-submit">
            <button type="submit">
              {isLoginForm ? 'LOGIN' : 'REGISTER'}
            </button>
            <p>
              {isLoginForm ? 'To Register New Account →' : 'Already have an account?'}
              <span onClick={() => setIsLoginForm(!isLoginForm)} className="toggle-form">
                Click Here
              </span>
            </p>
          </div>
        </form>
      </div>
      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default LoginToken;