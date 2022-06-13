import { Link, NavLink, useLocation } from 'react-router-dom';

import searchIcon from '../icon/Search Icon.svg';
import userIcon from '../icon/User Icon.svg';
import cartIcon from '../icon/Cart Icon.svg';

import './Nav.scss';

function Nav(props) {
  const { pathname } = useLocation();

  return (
    <div className="nav-container">
      <div className="nav">
        <Link to="/" className="nav__logo">
          Glänzend.*
        </Link>
        <div className="nav__link-container">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <NavLink to="/product" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/wishlist" className="nav-link">
            Wishlist
          </NavLink>
        </div>
        <div className="nav__icon-container">
          <div>
            <img src={searchIcon} alt="" className="icon"></img>
          </div>
          <Link to="/account">
            <img src={userIcon} alt="" className="icon"></img>
          </Link>
          <Link to="/cart">
            <img src={cartIcon} alt="" className="icon"></img>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
