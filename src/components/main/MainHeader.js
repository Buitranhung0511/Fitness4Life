import React, { useContext } from 'react';
import logo from '../../assets/images/logo.png'; // Import the logo image
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../helpers/DataContext';
import { Modal } from 'antd';

const MainHeader = () => {
  const { isLoggedIn, handleLogout } = useContext(DataContext);

  const navigate = useNavigate();

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đăng xuất?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: () => {
        handleLogout(); // Thực hiện logout
        navigate('/login'); // Chuyển hướng đến trang login
      },
    });
  };
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
              <li className="scroll"><a href="/clubs">Clubs</a></li>
              <li className="scroll"><Link to="/bookingMain">Booking</Link></li>
              <li className="scroll"><Link to="/packageMain">Membership</Link></li>
              <li className="scroll"><Link to="/blogS">Blog</Link></li>
              <li className="scroll"><Link to="/contact-us">Contact</Link></li>
              <li className="scroll"><Link to="/forums">forum</Link></li>
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
                    <Link className="ms-2 btn btn-outline-light" onClick={(confirmLogout)}>Logout</Link>
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
