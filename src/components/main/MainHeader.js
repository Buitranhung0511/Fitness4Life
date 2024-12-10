import React, { useContext } from 'react';
import logo from '../../assets/images/logo.png'; // Import the logo image
import { Link } from 'react-router-dom';
import { DataContext } from '../helpers/DataContext';

const MainHeader = () => {
  const { isLoggedIn, handleLogout } = useContext(DataContext);
  return (
    <header id="header">
      <nav id="main-nav" className="navbar navbar-default navbar-fixed-top" role="banner">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
              <Link to="/" className="logo"> <div className="logo-name" style={{ fontSize: "28px" }}><span>FITNESS</span>4LIFE</div></Link>
            </div>
          </div>

          <div className="collapse navbar-collapse navbar-right">
            <ul className="nav navbar-nav">
              <li className="scroll active"><a href="#home">Home</a></li>
              <li className="scroll"><a href="#services">Classes</a></li>
              <li className="scroll"><a href="#about">About</a></li>
              <li className="scroll"><a href="#our-team">Trainers</a></li>
              <li className="scroll"><a href="#portfolio">Gallery</a></li>
              <li className="scroll"><a href="#pricing">Pricing</a></li>
              <li className="scroll"><Link to="/blog">Blog</Link></li>
              <li className="scroll"><Link to="/contact-us">Contact</Link></li>
              {!isLoggedIn ? (
                <>
                  <li className="scroll">
                    <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                  </li>
                  <li className="scroll">
                    <Link className="btn btn-light" to="/registration">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="scroll">
                    <Link className="btn btn-light" to="/user/profile">Profile</Link>
                  </li>
                  <li className="scroll">
                    <Link className="ms-2 btn btn-outline-light" onClick={() => handleLogout()}>Logout</Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
