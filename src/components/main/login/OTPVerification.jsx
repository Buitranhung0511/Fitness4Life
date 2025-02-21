import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyOTP, loginUser } from '../../../services/authService';
import { getUserByEmail } from '../../../serviceToken/authService';
import { jwtDecode } from "jwt-decode";
import authObserver from '../../../config/authObserver';

const OTPVerification = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have registration data
    const registrationData = sessionStorage.getItem('registrationData');
    if (!registrationData) {
      toast.error('Registration information not found');
      navigate('/login');
    }
  }, [navigate]);

  const handleAutoLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const { access_token, refresh_token, expires_in } = response;
      
      if (!access_token) {
        throw new Error('Login failed: Invalid credentials');
      }
      
      const decodedToken = jwtDecode(access_token);
      const userEmail = decodedToken?.sub;

      if (!userEmail) {
        throw new Error('Invalid token: User information missing');
      }

      const userDetails = await getUserByEmail(userEmail, access_token);

      if (!userDetails) {
        throw new Error('Failed to retrieve user details');
      }

      if (!userDetails.active) {
        throw new Error('Account is not active');
      }

      const tokenInfo = {
        access_token,
        refresh_token,
        expires_in,
        user: userDetails,
        timestamp: Date.now()
      };

      // Save token data and notify observers
      localStorage.setItem("tokenData", JSON.stringify(tokenInfo));
      authObserver.notifyLogin(tokenInfo);

      // Clean up registration data
      sessionStorage.removeItem('registrationData');

      // Redirect based on role
      switch (decodedToken.role) {
        case 'ADMIN':
          navigate('/admin/profile');
          break;
        case 'USER':
          navigate('/user/profile');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (error) {
      throw new Error(error.message || 'Auto-login failed');
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      // Get registration data from sessionStorage
      const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
      if (!registrationData) {
        throw new Error('Registration data not found');
      }

      // Verify OTP
      const response = await verifyOTP(otpCode, email);

      if (response.status === 200) {
        toast.success("OTP Verified Successfully!");
        
        // Perform auto login
        await handleAutoLogin(registrationData.email, registrationData.password);
        
        toast.success('Login successful! Redirecting to profile...');
      } else {
        toast.error(response.message || "Invalid OTP!");
      }
    } catch (error) {
      toast.error(error.message || "Verification failed!");
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      let newOtp = [...otp];
      
      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      setOtp(pastedData.split(''));
    }
  };

  return (
    <div className="otp-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Verify OTP</h2>
      <p>Please enter the 6-digit code sent to <b>{email}</b></p>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            maxLength="1"
            autoComplete="off"
          />
        ))}
      </div>

      <button 
        className="btn-verify" 
        onClick={handleVerifyOTP} 
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          "Verify OTP"
        )}
      </button>
    </div>
  );
};

export default OTPVerification;