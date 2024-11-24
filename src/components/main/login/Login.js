import React, { useState } from 'react';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <section id="services">
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div href="#" className="logo">
          <div className="logo-name"><span>LO</span>GIN</div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <form className="reg-page" onSubmit={handleSubmit}>
              <div className="reg-header">
                <h2>Login to your account</h2><br />
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <span className="input-group-addon">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="email"
                  name="userid"
                  placeholder="Email Address"
                  className="form-control"
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: '20px' }}>
                <span className="input-group-addon">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="usrpsw"
                  placeholder="Password"
                  className="form-control"
                  required
                />
                <span 
                  className="input-group-addon" 
                  style={{ cursor: 'pointer' }} 
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>

              <div className="row">
                <div className="col-md-6 checkbox">
                  <label>
                    <input type="checkbox" /> Stay signed in
                  </label>
                </div>
                <div className="col-md-6">
                  <button className="btn-u pull-right" type="submit">
                    Login
                  </button>
                </div>
              </div>

              <hr />
              <h4>Don't have an account yet?</h4>
              <p>
                No worries,{' '}
                <a className="color-green" href="/registration">
                  click here
                </a>{' '}
              </p>
              <h4>Forgot your Password?</h4>
              <p>
                No worries,{' '}
                <a className="color-green" href="#">
                  click here
                </a>{' '}
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
