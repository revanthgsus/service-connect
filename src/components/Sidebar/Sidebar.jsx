import React from 'react';
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, handleCloseSidebar, sidebarRef, sidebarItems }) => {

  return (
    <div className='sidebar-container'>
      <aside className={`sidebar-section ${isOpen ? "open" : "closed"}`} ref={sidebarRef}>
        {sidebarItems.map((item, index) => (
          <ul key={index} className='sidebar-link'>
            <li>
              <NavLink
                to={`/${item.link}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={handleCloseSidebar}
                aria-label={item.title}>
                <span>{item.icon}</span>
                <span className='sidebar-content'>{item.title}</span>
              </NavLink>
            </li>
          </ul>
        ))}
      </aside>
    </div>
  )
}

export default Sidebar