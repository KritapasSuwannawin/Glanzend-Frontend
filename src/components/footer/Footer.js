import { Link } from 'react-router-dom';

import twitterIcon from '../../icon/Twitter Icon.svg';
import facebookIcon from '../../icon/Facebook Icon.svg';
import instagramIcon from '../../icon/Instagram Icon.svg';

import './Footer.scss';

function Footer(props) {
  const { showBorderTop } = props;

  return (
    <div className="footer-container">
      <div className={`footer ${showBorderTop ? 'border-top' : ''}`}>
        <div className="footer__left">
          <p className="footer__left--brand">Glänzend.*</p>
          <p className="footer__left--desc">
            Providing your everyday accessories<br></br> and stylish comfortable look.
          </p>
          <div className="footer__left--social-media-container">
            <a href="/" rel="noreferrer" target="_blank">
              <img src={twitterIcon} alt="" className="icon small"></img>
            </a>
            <a href="/" rel="noreferrer" target="_blank">
              <img src={facebookIcon} alt="" className="icon"></img>
            </a>
            <a href="/" rel="noreferrer" target="_blank">
              <img src={instagramIcon} alt="" className="icon"></img>
            </a>
          </div>
        </div>
        <div className="footer__right">
          <div className="column">
            <p className="column__title">Company</p>
            <Link to="#" className="column__link">
              About Us
            </Link>
            <Link to="#" className="column__link">
              Contact Us
            </Link>
            <Link to="#" className="column__link">
              Privacy Policy
            </Link>
            <Link to="#" className="column__link">
              Press
            </Link>
          </div>
          <div className="column">
            <p className="column__title">Information</p>
            <Link to="#" className="column__link">
              FAQ
            </Link>
            <Link to="#" className="column__link">
              Terms
            </Link>
            <Link to="#" className="column__link">
              Delivery Info
            </Link>
            <Link to="#" className="column__link">
              Size Guide
            </Link>
          </div>
          <div className="column">
            <p className="column__title">Order</p>
            <Link to="/cart" className="column__link">
              Cart
            </Link>
            <Link to="/wishlist" className="column__link">
              Wishlist
            </Link>
            <Link to="/account" className="column__link">
              My Account
            </Link>
            <Link to="/account" className="column__link">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
