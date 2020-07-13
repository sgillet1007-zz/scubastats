import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../logo250x72.png";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const authToken = localStorage.getItem("bt") || null;
  const user = localStorage.getItem("user") || null;
  const authenticated = authToken && user;

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <div className="wrapped-header">
          <h1 className="main-navigation__title">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </h1>
          <nav className="main-navigation__header-nav">
            <NavLinks />
          </nav>
          {authenticated && (
            <button
              className="main-navigation__menu-btn"
              onClick={openDrawerHandler}
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
