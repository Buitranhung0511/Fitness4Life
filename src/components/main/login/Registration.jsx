import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../../../services/authService';

const Registration = () => {
  const [loading, setLoading] = useState(false);
  // Schema validation với Yup
  const validationSchema = Yup.object().shape({
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
      .required("Gender is required")
  });
  // Sử dụng useForm từ react-hook-form với Yup resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data) => {
    let newData = {
      ...data,
      role: "USER"
    }
    console.log('New Data:', newData);
    try {
      setLoading(true)
      let result = await registerUser(newData);
      console.log("result: ", result);

      if (result.status == 201) {
        reset()
        toast.success("Registration successful!");
      }
      if (result.status == 400) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Oops, something went wrong!!");
    } finally {
      setLoading(false)
    }
  };

  return (
    <section id="services">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div href="#" className="logo">
          <div className="logo-name">RE<span>GISTER</span></div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
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

            <form className="reg-page" onSubmit={handleSubmit(onSubmit)}>
              <div className="reg-header">
                <h2>Register a new account</h2>
                <p>
                  Already Signed Up? Click{' '}
                  <a href="/login" className="color-green">
                    Sign In
                  </a>{' '}
                  to login your account.
                </p>
              </div>

              {/* Full Name */}
              <label>full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                {...register('fullName')}
                style={{ marginBottom: '20px' }}
              />
              <div className="invalid-feedback">{errors.fullName?.message}</div>

              {/* Email */}
              <label>Email Address <span className="color-red">*</span></label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                {...register('email')}
                style={{ marginBottom: '20px' }}
                required
              />
              <div className="invalid-feedback">{errors.email?.message}</div>

              {/* Password */}
              <div className="row">
                <div className="col-sm-6">
                  <label>Password <span className="color-red">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    {...register('password')}
                    style={{ marginBottom: '20px' }}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

                {/* Confirm Password */}
                <div className="col-sm-6">
                  <label>Confirm Password <span className="color-red">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    style={{ marginBottom: '20px' }}
                  />
                  <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
              </div>
              {/* Gender */}
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Gender</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                        type="radio"
                        id="male"
                        {...register('gender')}
                        defaultChecked
                        value="MALE"
                      />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                        type="radio"
                        id="female"
                        {...register('gender')}
                        value="FEMALE"
                      />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                        type="radio"
                        id="other"
                        {...register('gender')}
                        value="OTHER"
                      />
                      <label className="form-check-label" htmlFor="other">Other</label>
                    </div>
                    <div className="invalid-feedback d-block">{errors.gender?.message}</div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="row">

                {/* Submit Button */}
                <div className="col-lg-6 text-right">
                  <button className="btn-u" disabled={loading} type="submit">
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
