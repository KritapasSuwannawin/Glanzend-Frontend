import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import searchIcon from '../../icon/Search Icon.svg';
import userIcon from '../../icon/User Icon.svg';
import cartIcon from '../../icon/Cart Icon.svg';

import './Nav.scss';

function Nav(props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [showSearchBar, setShowSearchBar] = useState(false);

  function searchClickHandler() {
    setShowSearchBar((prev) => !prev);
  }

  function searchSubmitHandler(e) {
    e.preventDefault();
    const search = e.target[0].value.trim().toLowerCase().split(' ').join('_');

    setShowSearchBar(false);

    navigate(`/product${search.length > 0 ? `?search=${search}` : ''}`);
  }

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
          <NavLink to="/product" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Products
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Wishlist
          </NavLink>
        </div>
        <div className="nav__icon-container">
          <div className="search">
            <img src={searchIcon} alt="" className="icon" onClick={searchClickHandler}></img>
            {showSearchBar && (
              <form className="search__form" onSubmit={searchSubmitHandler}>
                <input placeholder="What are you looking for?" className="input"></input>
              </form>
            )}
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
