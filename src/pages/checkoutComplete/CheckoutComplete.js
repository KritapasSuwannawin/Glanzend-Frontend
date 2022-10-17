import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { accountActions } from '../../store/accountSlice';

import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import './CheckoutComplete.scss';

function CheckoutComplete(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(accountActions.setCheckoutItemArr([]));
  }, [dispatch]);

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
