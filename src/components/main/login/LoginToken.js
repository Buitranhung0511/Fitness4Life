import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, getUserByEmail } from '../../../serviceToken/authService';
import { registerUser } from '../../../services/authService';
import { jwtDecode } from 'jwt-decode';
import '../../../assets/css/Main/login.css';
import authObserver from '../../../config/authObserver';
import ResetPassword from './ResetPassword';

const LoginToken = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isResetPassword, setResetPassword] = useState(false);

  // Validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email should be valid"),
    password: Yup.string()
      .required("Password is required")
  });

  const registerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email should be valid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    gender: Yup.string()
      .required("Gender is required"),
    acceptTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
  });

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const { register: registerFormRegister, handleSubmit: handleRegisterSubmit, reset: registerReset, formState: { errors: registerErrors } } = useForm({
    resolver: yupResolver(registerSchema)
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
      setLoading(true);
      const response = await loginUser(data.email, data.password);
      const { access_token, refresh_token, expires_in } = response;
      
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

  const onRegisterSubmit = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        role: "USER"
      };

      const result = await registerUser(newData);

      if (result.status === 201) {
        registerReset();
        toast.success("Registration successful! Redirecting to OTP verification...");
        setTimeout(() => {
          navigate(`/verify-otp/${data.email}`);
        }, 2000);
      } else if (result.status === 400) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>{isLoginForm ? 'EXISTING LOGIN FORM' : 'REGISTER FORM'}</h1>
      
      <div className="form-container">
        <h2>{isLoginForm ? 'Login here' : 'Register here'}</h2>
        
        {isLoginForm ? (
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
        ) : (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="FULL NAME"
                {...registerFormRegister('fullName')}
                className={`form-control ${registerErrors.fullName ? 'is-invalid' : ''}`}
              />
              {registerErrors.fullName && (
                <div className="invalid-feedback">{registerErrors.fullName.message}</div>
              )}
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="EMAIL"
                {...registerFormRegister('email')}
                className={`form-control ${registerErrors.email ? 'is-invalid' : ''}`}
              />
              {registerErrors.email && (
                <div className="invalid-feedback">{registerErrors.email.message}</div>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="PASSWORD"
                {...registerFormRegister('password')}
                className={`form-control ${registerErrors.password ? 'is-invalid' : ''}`}
              />
              {registerErrors.password && (
                <div className="invalid-feedback">{registerErrors.password.message}</div>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                {...registerFormRegister('confirmPassword')}
                className={`form-control ${registerErrors.confirmPassword ? 'is-invalid' : ''}`}
              />
              {registerErrors.confirmPassword && (
                <div className="invalid-feedback">{registerErrors.confirmPassword.message}</div>
              )}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="gender-options">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    {...registerFormRegister('gender')}
                    value="MALE"
                    id="male"
                    defaultChecked
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    {...registerFormRegister('gender')}
                    value="FEMALE"
                    id="female"
                  />
                  <label htmlFor="female">Female</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    {...registerFormRegister('gender')}
                    value="OTHER"
                    id="other"
                  />
                  <label htmlFor="other">Other</label>
                </div>
              </div>
              {registerErrors.gender && (
                <div className="invalid-feedback">{registerErrors.gender.message}</div>
              )}
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                {...registerFormRegister('acceptTerms')}
                id="acceptTerms"
                className={`form-check-input ${registerErrors.acceptTerms ? 'is-invalid' : ''}`}
              />
              <label htmlFor="acceptTerms">I Accept Terms & Conditions</label>
              {registerErrors.acceptTerms && (
                <div className="invalid-feedback">{registerErrors.acceptTerms.message}</div>
              )}
            </div>

            <div className="form-submit">
              <button type="submit" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : "REGISTER"}
              </button>
            </div>
          </form>
        )}

        <p className="toggle-form-text">
          {isLoginForm ? 'To Register New Account →' : 'Already have an account?'}
          <span onClick={() => setIsLoginForm(!isLoginForm)} className="toggle-form">
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