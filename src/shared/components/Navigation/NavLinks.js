import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className='nav-links'>
      {auth.token && (
        <li>
          <NavLink to='/' exact>
            DASHBOARD
          </NavLink>
        </li>
      )}
      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to='/u1/places'>MY DIVES</NavLink>
        </li>
      )} */}
      {auth.token && (
        <li>
          <NavLink to='/dives/new'>ADD DIVE</NavLink>
        </li>
      )}
      {auth.token && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
