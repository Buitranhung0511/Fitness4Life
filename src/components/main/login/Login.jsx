import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { DataContext } from '../../helpers/DataContext';
import { loginUser } from '../../../services/authService';
import img2 from '../../../assets/images/img2.jpg';

const Login = () => {
  const { handleStoreUser } = useContext(DataContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    try {
      const result = await loginUser(values);
      if (result.status === 200) {
        const user = result.data;
        if (!user.active) {
          message.error('Account needs verification');
          return;
        }
        handleStoreUser(user);
        navigate(user.role === 'ADMIN' ? '/admin/profile' : '/');
      } else {
        message.error(result.message || 'Login failed');
      }
    } catch (error) {
      message.error('An error occurred');
    }
  };

  return (
    <div className="body-container">
      <h1>FITNESS4LIFE</h1>
      
      <div className="w3layoutscontaineragileits">
        <h2>Login Here</h2>
        
        <Form
          form={form}
          onFinish={onSubmit}
          className="login-form"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Email"
              className="agile-email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password 
              placeholder="Password"
              className="agile-password"
            />
          </Form.Item>

          <ul className="agileinfotickwthree">
            <li>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="/forgot-password">Forgot password?</a>
            </li>
          </ul>

          <div className="aitssendbuttonw3ls">
            <Form.Item>
              <Button type="primary" htmlType="submit" className="agileits-submit">
                LOGIN
              </Button>
            </Form.Item>
            
            <p>
              To Register New Account 
              <a href="/register">
                <span> Click Here</span>
              </a>
            </p>
          </div>
        </Form>
      </div>

      <div className="w3footeragile">
        <p>© 2025 Fitness4Life Login Form. All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Login;


// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
// import clsx from 'clsx';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { loginUser } from '../../../services/authService';
// import { DataContext } from '../../helpers/DataContext';
// import ResetPassword from './ResetPassword';
// const Login = () => {
//   const { handleStoreUser } = useContext(DataContext);


//   const navigate = useNavigate();

//   const [isResetPassword, setResetPassword] = useState(false);

//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

//   const validationSchema = Yup.object().shape({
//     email: Yup.string()
//       .required('Email is required')
//       .email('Email should be valid'),
//     password: Yup.string().required('Password is required'),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//   });

//   const onSubmit = async (data) => {
//     try {
//       const result = await loginUser(data);
//       if (result.status === 200) {
//         const user = result.data;
//         if (!user.active) {
//           toast.error('Bạn cần phải xác thực tài khoản');
//           return;
//         }
//         handleStoreUser(user);
//         if (user.role === 'ADMIN') {
//           navigate('/admin/profile');
//         } else {
//           navigate('/');
//         }
//       } else if (result.status === 400) {
//         toast.error(result.message || 'Invalid input.');
//       } else if (result.status === 404) {
//         toast.error('Invalid credentials!!');
//       } else {
//         toast.error('Unexpected error occurred.');
//       }
//     } catch (error) {
//       toast.error('Oops, something went wrong!!');
//     }
//   };
  
//   return (
//     <section id="services">
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <div className="logo">
//           <div className="logo-name">
//             <span>LO</span>GIN
//           </div>
//         </div>
//       </div>
//       <div className="container">
//         <ToastContainer />
//         <div className="row">
//           <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
//             <form className="reg-page" onSubmit={handleSubmit(onSubmit)}>
//               <div className="reg-header">
//                 <h2>Login to your account</h2>
//               </div>

//               <div className="input-group" style={{ marginBottom: '20px' }}>
//                 <span className="input-group-addon">
//                   <i className="fa fa-user"></i>
//                 </span>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="Email Address"
//                   className={clsx('form-control', { 'is-invalid': errors.email })}
//                   {...register('email')}
//                 />
//                 {errors.email && (
//                   <div className="invalid-feedback text-danger">
//                     {errors.email.message}
//                   </div>
//                 )}
//               </div>

//               <div className="input-group" style={{ marginBottom: '20px' }}>
//                 <span className="input-group-addon">
//                   <i className="fa fa-lock"></i>
//                 </span>
//                 <input
//                   type={passwordVisible ? 'text' : 'password'}
//                   id="password"
//                   placeholder="Password"
//                   className={clsx('form-control', { 'is-invalid': errors.password })}
//                   {...register('password')}
//                 />
//                 {errors.password && (
//                   <div className="invalid-feedback text-danger">
//                     {errors.password.message}
//                   </div>
//                 )}
//                 <span
//                   className="input-group-addon"
//                   style={{ cursor: 'pointer' }}
//                   onClick={togglePasswordVisibility}
//                 >
//                   <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
//                 </span>
//               </div>

//               <div className="row">
//                 <div className="col-md-6">
//                   <button className="btn-u pull-right" type="submit">
//                     Login
//                   </button>
//                   <div className="text-center mt-3">
//                     <span
//                       className="text-decoration-none"
//                       style={{
//                         cursor: 'pointer',
//                         color: '#1890ff',
//                         textDecoration: 'underline',
//                       }}
//                       onClick={() => setResetPassword(true)}
//                     >
//                       Forgot your password?
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <hr />
//             </form>
//             <ResetPassword
//               isResetPassword={isResetPassword}
//               setResetPassword={setResetPassword}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;
