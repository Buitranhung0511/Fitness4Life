import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [isRegistered, setIsRegistered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic here
    setIsRegistered(true);
  };

  const hideMessage = () => setIsRegistered(false);

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
            <form className="reg-page" onSubmit={handleSubmit}>
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

              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                style={{ marginBottom: '20px' }}
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />

              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                style={{ marginBottom: '20px' }}
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />

              <label>Email Address <span className="color-red">*</span></label>
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ marginBottom: '20px' }}
                required
                value={formData.email}
                onChange={handleInputChange}
              />

              <div className="row">
                <div className="col-sm-6">
                  <label>Password <span className="color-red">*</span></label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    style={{ marginBottom: '20px' }}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label>Confirm Password <span className="color-red">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    style={{ marginBottom: '20px' }}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {isRegistered && (
                <div className="alert alert-success successBox">
                  <button type="button" className="close" onClick={hideMessage}>
                    ×
                  </button>
                  <strong style={{ fontSize: '16px' }}>Congratulations!</strong>
                  <span className="alert-link"> You Have Successfully Registered.</span>
                </div>
              )}

              <hr />

              <div className="row">
                <div className="col-lg-6 checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      required
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                    />{' '}
                    I read <a href="#" className="color-green">Terms and Conditions</a>
                  </label>
                </div>
                <div className="col-lg-6 text-right">
                  <button className="btn-u" type="submit">
                    Register
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
