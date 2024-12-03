import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/admin/Sidebar';
import Navbar from './components/admin/Navbar';
import Home from './components/admin/page/Home';
import AdminDashboard from './components/admin/page/AdminDashboard';
import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/main/Footer';
import MainHeader from './components/main/MainHeader';
import Blog from './components/main/blog/Blog';
import BlogDetail from './components/main/blog/BlogDetail';
import ContactForm from './components/main/contact/ContactForm';
import Login from './components/main/login/Login';
import Registration from './components/main/login/Registration';
import Club from './components/admin/Club/Club'
import Blogs from './components/admin/Blog/Blogs';
import Users from './components/admin/User/Users';


const App = () => {


  return (

    <Router>
      <Routes>
        {/* trang main */}
        <Route path="/" element={<MainLayout />}>
        
        </Route>

        <Route element={<><MainHeader/><Outlet /><Footer /></>}>
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />

        <Route path='/blog' element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact-us/" element={<ContactForm />} />

        </Route>

        {/* Trang  Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="home" element={<Home />} />
          <Route path="Users" element={<Users/>} />
          <Route path="Blogs" element={<Blogs/>} />
          <Route path="Club" element={<Club/>} />

        </Route>
      </Routes>
    </Router>

  );
}

export default App;

