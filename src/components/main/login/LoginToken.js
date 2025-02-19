import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUserByEmail } from '../../../serviceToken/authService';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/css/Main/login.css'

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const navigate = useNavigate();

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
      const { access_token } = data;
      
      const decodedToken = jwtDecode(access_token);
      const userEmail = decodedToken?.sub;

      if (!userEmail) {
        toast.error('Invalid token.');
        return;
      }

      const userDetails = await getUserByEmail(userEmail, access_token);

      if (!userDetails.active) {
        toast.warning('⚠️ Your account is not active, please contact admin!');
        return;
      }

      localStorage.setItem('tokenData', JSON.stringify(data));
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
            toast.error('You have not been granted permission.');
        }
      }, 1500);
    } catch (err) {
      toast.error(err.message);
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

export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../../../serviceToken/authService';
// import { jwtDecode } from 'jwt-decode';
// import { toast,ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { getUserByEmail } from '../../../serviceToken/authService';

// const LoginToken = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error(' Please fill in email or password!');
//       return;
//     }

//     try {
//       const data = await loginUser(email, password);
//       const { access_token } = data;
//       console.log(data);
      

//       const decodedToken = jwtDecode(access_token);
//       const userEmail = decodedToken?.sub;

//       if (!userEmail) {
//         toast.error('Invalid token.');
//         return;
//       }

//       const userDetails = await getUserByEmail(userEmail, access_token);

//       if (!userDetails.active) {
//         toast.warning('⚠️ Your account is not active, please contact admin!');
//         return;
//       }

//       localStorage.setItem('tokenData', JSON.stringify(data));
//       toast.success('Login successful! Redirecting...');

//       setTimeout(() => {
//         switch (decodedToken.role) {
//           case 'ADMIN':
//             navigate('/admin/profile');
//             break;
//           case 'USER':
//             navigate('/user/profile');
//             break;
//           default:
//             toast.error('You have not been granted permission.');
//         }
//       }, 1500);
//     } catch (err) {
//       toast.error(`${err.message}`);
//     }
//   };

//   return (
//     <section id="services">
//       <div className="login-container">
//         <h2>Login</h2>
//         <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>
//           <button type="submit" className="submit-button">Login</button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default LoginToken;
