import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import searchIcon from '../../icon/Search Icon.svg';
import userIcon from '../../icon/User Icon.svg';
import cartIcon from '../../icon/Cart Icon.svg';

import './Nav.scss';

function Nav(props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  useEffect(() => {
    setShowSearchBar(false);
    setShowHamburgerMenu(false);
  }, [pathname]);

  const fadeTransitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  function searchClickHandler() {
    setShowHamburgerMenu(false);
    setShowSearchBar((prev) => !prev);
  }

  function searchSubmitHandler(e) {
    e.preventDefault();
    const search = e.target[0].value.trim().toLowerCase().split(' ').join('_');

    setShowSearchBar(false);

    navigate(`/product${search.length > 0 ? `?search=${search}` : ''}`);
  }

  function hamburgerClickHandler() {
    setShowSearchBar(false);
    setShowHamburgerMenu((prev) => !prev);
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
            <Transition in={showSearchBar} timeout={150} mountOnEnter unmountOnExit>
              {(state) => (
                <form
                  className="search__form"
                  onSubmit={searchSubmitHandler}
                  style={{
                    ...fadeTransitionStyles[state],
                  }}
                >
                  <input placeholder="What are you looking for?" className="input"></input>
                </form>
              )}
            </Transition>
          </div>
          <Link to="/account" className="link desktop">
            <img src={userIcon} alt="" className="icon"></img>
          </Link>
          <Link to="/cart" className="link desktop">
            <img src={cartIcon} alt="" className="icon"></img>
          </Link>
          <div className="hamburger-menu">
            <div className="hamburger-menu__icon-container" onClick={hamburgerClickHandler}>
              <div className={`line first ${showHamburgerMenu ? 'active' : ''}`}></div>
              <div className={`line second ${showHamburgerMenu ? 'active' : ''}`}></div>
              <div className={`line third ${showHamburgerMenu ? 'active' : ''}`}></div>
            </div>
            <Transition in={showHamburgerMenu} timeout={150} mountOnEnter unmountOnExit>
              {(state) => (
                <div
                  className="hamburger-menu__menu"
                  style={{
                    ...fadeTransitionStyles[state],
                  }}
                >
                  <Link className={`hamburger-menu__menu--link ${pathname === '/' ? 'active' : ''}`} to="/">
                    Home
                  </Link>
                  <NavLink className={({ isActive }) => 'hamburger-menu__menu--link' + (isActive ? ' active' : '')} to="/product">
                    Product
                  </NavLink>
                  <NavLink className={({ isActive }) => 'hamburger-menu__menu--link' + (isActive ? ' active' : '')} to="/cart">
                    Cart
                  </NavLink>
                  <NavLink className={({ isActive }) => 'hamburger-menu__menu--link' + (isActive ? ' active' : '')} to="/wishlist">
                    Wishlist
                  </NavLink>
                  <NavLink className={({ isActive }) => 'hamburger-menu__menu--link' + (isActive ? ' active' : '')} to="/account">
                    Account
                  </NavLink>
                </div>
              )}
            </Transition>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
