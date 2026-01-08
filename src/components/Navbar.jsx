import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import "../index.css";
const Navbar = ({ isDark, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const links = (
    <>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/services"
        >
          Services
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/projects"
        >
          Projects
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/blog"
        >
          Blog
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/about"
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/contact"
        >
          Contact
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/dashboard"
        >
          Dashboard
        </NavLink>
      </li> */}
    </>
  );

  return (
    <nav className="bg-[#0F172A]">
      <div className="navbar  text-white max-w-7xl mx-auto py-4 px-6 md:px-12 sticky top-0 z-50 shadow-lg">
        {/* Logo Section */}
        <div className="navbar-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-cyan-400 rounded-lg flex items-center justify-center relative shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              <img src="/logo.png" className="p-1" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                Amin<span className="text-primary">WebTech</span>
              </span>
              <span className="text-xs text-gray-400 font-light">
                Digital Excellence
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 text-sm font-medium text-gray-300">
            {links}
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-end">
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-gray-300 hover:text-white"
              title="Toggle theme (Press 'd')"
            >
              {isDark ? (
                <span className="material-icons-outlined">light_mode</span>
              ) : (
                <span className="material-icons-outlined">dark_mode</span>
              )}
            </button>

            {/* Admin Button */}
            <Link
              to="/admin"
              className="btn btn-sm bg-[#0097B2] hover:bg-[#00869e] text-white border-none"
            >
              <span className="material-icons-outlined text-lg">
                account_circle
              </span>
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <div className="dropdown dropdown-end lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle text-gray-300 hover:text-white"
              >
                <span className="material-icons-outlined">menu</span>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {links}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
