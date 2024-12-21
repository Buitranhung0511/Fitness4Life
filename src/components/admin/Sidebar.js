import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ setMenuItems, isCollapsed }) => {
  const initialIndex = parseInt(localStorage.getItem('activeIndex')) || 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const menuItems = useMemo(() => [
    { label: 'Dashboard', icon: 'bxs-dashboard', path: '/admin/dashboard' },
    { label: 'User', icon: 'bxs-user-rectangle', path: '/admin/users' },
    { label: 'Blogs', icon: 'bx-analyse', path: '/admin/Blogs' },
    { label: 'Club', icon: 'bx-buildings', path: '/admin/Club' },
    { label: 'Room', icon: 'bx-message-square-dots', path: '/admin/Room' },
    { label: 'Branch', icon: 'bx-message-square-dots', path: '/admin/Branch' },
    { label: 'Trainer', icon: 'bx-message-square-dots', path: '/admin/Trainer' },
    { label: 'Booking', icon: 'bxs-hand-up', path: '/admin/Booking' },
    { label: 'Promotion', icon: 'bx-cog', path: '/admin/Promotion' },
    { label: 'Post', icon: 'bx-cog', path: '/admin/post' },
    { label: 'Settings', icon: 'bx-cog', path: '/admin/home' }

  ], []); // Menu items

  useEffect(() => {
    setMenuItems(menuItems); // Pass menu items to parent
  }, [menuItems, setMenuItems]);

  const handleSetActiveIndex = (index) => {
    setActiveIndex(index);
    localStorage.setItem('activeIndex', index);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'close' : ''}`}> {/* Apply collapse class if isCollapsed is true */}
      <a href="#" className="logo">
        <i className="bx bx-code-alt"></i>
        <div className="logo-name"><span>Fitness4</span>Life</div>
      </a>
      <ul className="side-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={index === activeIndex ? 'active' : ''}
          >
            <a href={item.path} onClick={() => handleSetActiveIndex(index)}>
              <i className={`bx ${item.icon}`}></i>{item.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="side-menu">
        <li>
          <Link className="btn btn-outline-light me-2" to="/login">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
