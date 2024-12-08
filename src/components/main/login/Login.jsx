import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import clsx from 'clsx';
import { toast, ToastContainer } from 'react-toastify'; // Sử dụng react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../../../services/authService';
import { DataContext } from '../../helpers/DataContext';

const Login = () => {
  const { handleStoreUser } = useContext(DataContext);
  const navigate = useNavigate();

  // Trạng thái để xử lý hiển thị mật khẩu
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  // Validation schema với Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email should be valid'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // const onSubmit = async (data) => {
  //   try {
  //     let result = await loginUser(data);
  //     console.log('result: ', result);
  //     if (result.status === 200) {
  //       handleStoreUser(result.data);
  //       navigate('/');
  //     } else if (result.status === 400) {
  //       toast.error(result.message);
  //     } else if (result.status === 404) {
  //       toast.error('Invalid credentials!!');
  //     }
  //   } catch (error) {
  //     toast.error('Oops, something went wrong!!');
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      let result = await loginUser(data);
      console.log('API Response:', result); // Log toàn bộ phản hồi
      if (result.status === 200) {
        handleStoreUser(result.data);
        navigate('/');
      } else if (result.status === 400) {
        toast.error(result.message || 'Invalid input.'); // Thêm fallback message
      } else if (result.status === 404) {
        toast.error('Invalid credentials!!');
      } else {
        toast.error('Unexpected error occurred.');
      }
    } catch (error) {
      console.error('API Error:', error); // Log lỗi để kiểm tra
      toast.error('Oops, something went wrong!!');
    }
  };

  return (
    <section id="services">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div href="#" className="logo">
          <div className="logo-name">
            <span>LO</span>GIN
          </div>
        </div>
      </div>
      <div className="container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="row">
          <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <form className="reg-page" onSubmit={handleSubmit(onSubmit)}>
              <div className="reg-header">
                <h2>Login to your account</h2>
                <br />
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <span className="input-group-addon">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className={clsx('form-control', { 'is-invalid': errors.email })}
                  {...register('email')}
                />
                {errors.email && (
                  <div className="invalid-feedback text-danger">
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <span className="input-group-addon">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder="Password"
                  className={clsx('form-control', { 'is-invalid': errors.password })}
                  {...register('password')}
                />
                {errors.password && (
                  <div className="invalid-feedback text-danger">
                    {errors.password.message}
                  </div>
                )}
                <span
                  className="input-group-addon"
                  style={{ cursor: 'pointer' }}
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <button className="btn-u pull-right" type="submit">
                    Login
                  </button>
                  <div className="text-center mt-3">
                    <Link to="/get-otp" className="text-decoration-none">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </div>

              <hr />
              <h4>Don't have an account yet?</h4>
              <p>
                No worries,{' '}
                <Link to="/registration" className="color-green">
                  click here
                </Link>{' '}
                to register.
              </p>
              <h4>Forgot your Password?</h4>
              <p>
                No worries,{' '}
                <Link to="#" className="color-green">
                  click here
                </Link>{' '}
                to reset your password.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
