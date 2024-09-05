import React from "react";
import { useAuthServiceContext } from "../../../auth/AuthContext";

const Layout = ({ children }) => {
  const { isLoggedIn, user, logout } = useAuthServiceContext();

  const navLinks = isLoggedIn() ? (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <span className="navbar-text mr-3">
        <strong>{`Welcome ${user.username}`}</strong>
      </span>
      <li className="nav-item">
        <button onClick={logout} className="nav-link">
          Logout
        </button>
      </li>
    </ul>
  ) : (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <li className="nav-item">
        <a href="/register" className="nav-link">
          Register
        </a>
      </li>
      <li className="nav-item">
        <a href="/login" className="nav-link">
          Login
        </a>
      </li>
    </ul>
  );

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark position-sticky top-0 z-1">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="/">
              PyMessenger
            </a>
          </div>
          {navLinks}
        </div>
      </nav>
      {children}
    </>
  );
};

export default Layout;
