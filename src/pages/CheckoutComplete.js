import { Link } from 'react-router-dom';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './CheckoutComplete.scss';

function CheckoutComplete(props) {
  return (
    <div className="checkout-complete">
      <Nav></Nav>
      <div className="landing">
        <p className="landing__title">Checkout Completed!</p>
        <p className="landing__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
        </p>
        <Link to="/product" className="landing__btn">
          Back to Products
        </Link>
      </div>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default CheckoutComplete;
