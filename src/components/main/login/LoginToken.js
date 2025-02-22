import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, getUserByEmail } from '../../../serviceToken/authService';
import { jwtDecode } from 'jwt-decode';
import '../../../assets/css/Main/login.css';
import authObserver from '../../../config/authObserver';
import ResetPassword from './ResetPassword';

const LoginToken = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isResetPassword, setResetPassword] = useState(false);

  // Validation schema
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email should be valid"),
    password: Yup.string()
      .required("Password is required")
  });

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  // Token expiration check
  useEffect(() => {
    checkTokenExpiration();
    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const checkTokenExpiration = () => {
    const tokenData = localStorage.getItem('tokenData');
    if (!tokenData) return;
    
    try {
      const { access_token, refresh_token, expires_in } = JSON.parse(tokenData);
      const decodedToken = jwtDecode(access_token);
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp - currentTime < 300) {
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
      handleAutoLogout('Session expired. Please login again.');
    } catch (error) {
      handleAutoLogout('Failed to refresh session. Please login again.');
    }
  };

  const handleAutoLogout = (message) => {
    localStorage.removeItem('tokenData');
    toast.info(message);
    navigate('/login');
  };

  const onLoginSubmit = async (data) => {
    try {
      console.log('Login attempt with:', { email: data.email }); // Không log password
      setLoading(true);
      const response = await loginUser(data.email, data.password);
      const { access_token} = response;
      console.log("response",response);
      
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
  
        const tokenInfo = {
          ...response,
          user: userDetails,
          timestamp: Date.now()
        };
        
        authObserver.notifyLogin(tokenInfo);
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
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>EXISTING LOGIN FORM</h1>
      
      <div className="form-container">
        <h2>Login here</h2>
        
        <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="EMAIL"
              {...loginRegister('email')}
              className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`}
            />
            {loginErrors.email && (
              <div className="invalid-feedback">{loginErrors.email.message}</div>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="PASSWORD"
              {...loginRegister('password')}
              className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
            />
            {loginErrors.password && (
              <div className="invalid-feedback">{loginErrors.password.message}</div>
            )}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" 
              className="forgot-password"
              onClick={() => setResetPassword(true)}
            >Forgot password?</a>
          </div>
          
          <div className="form-submit">
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "LOGIN"}
            </button>
          </div>
        </form>

        <p className="toggle-form-text">
          To Register New Account →
          <span onClick={() => navigate('/register')} className="toggle-form">
            Click Here
          </span>
        </p>
      </div>
      
      <ResetPassword 
        isResetPassword={isResetPassword}
        setResetPassword={setResetPassword}
      />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default LoginToken;