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
            <p to="/about" className="column__link">
              About Us
            </p>
            <p to="/contact" className="column__link">
              Contact Us
            </p>
            <p to="/policy" className="column__link">
              Privacy Policy
            </p>
            <p to="/press" className="column__link">
              Press
            </p>
          </div>
          <div className="column">
            <p className="column__title">Information</p>
            <p to="/info/faq" className="column__link">
              FAQ
            </p>
            <p to="/info/term" className="column__link">
              Terms
            </p>
            <p to="/info/delivery" className="column__link">
              Delivery Info
            </p>
            <p to="/info/size" className="column__link">
              Size Guide
            </p>
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
            <p to="/shipping" className="column__link">
              Shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
