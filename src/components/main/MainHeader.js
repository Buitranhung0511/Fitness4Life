import React from 'react';
import logo from '../../assets/images/logo.png'; // Import the logo image
import { Link } from 'react-router-dom';

const MainHeader = () => {
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
              <li className="scroll">
      <a href="/login">
        <i className="fa fa-sign-in" aria-hidden="true"></i> Login
      </a>
    </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
