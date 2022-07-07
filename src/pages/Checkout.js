import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import deliveryTruckIcon from '../icon/Delivery Truck Icon.svg';
import returnIcon from '../icon/Return Icon.svg';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Checkout.scss';

function Checkout(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const collectionArr = useSelector((store) => store.resource.collectionArr);
  const accountID = useSelector((store) => store.account.id);
  const checkoutItemArr = useSelector((store) => store.account.checkoutItemArr);

  const [isFetching, setIsFetching] = useState(false);

  const firstNameRef = useRef();
  const lasttNameRef = useRef();
  const addressRef = useRef();
  const zipCodeRef = useRef();
  const cityRef = useRef();
  const countryRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();
  const cardNumberRef = useRef();
  const securityCodeRef = useRef();
  const expirationDateRef = useRef();

  const checkoutItemIDArr = checkoutItemArr.map((item) => item.id);
  const total = checkoutItemArr.reduce((prev, current) => prev + current.price * current.quantity, 0);

  useEffect(() => {
    if (accountID && firstNameRef.current) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account?id=${accountID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          const { status, data, message } = json;

          if (status === 'error') {
            throw new Error(message);
          }

          const { first_name, last_name, address, zip_code, city, country, phone_number, email } = data.account;
          first_name && (firstNameRef.current.value = first_name);
          last_name && (lasttNameRef.current.value = last_name);
          address && (addressRef.current.value = address);
          zip_code && (zipCodeRef.current.value = zip_code);
          city && (cityRef.current.value = city);
          country && (countryRef.current.value = country);
          phone_number && (phoneNumberRef.current.value = phone_number);
          email && (emailRef.current.value = email);
        })
        .catch((err) => console.log(err));
    }
  }, [accountID]);

  function getCollectionNameFromID(id) {
    return collectionArr.find((col) => col.id === id).name;
  }

  function submitHandler(e) {
    e.preventDefault();

    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const address = e.target[2].value;
    const zipCode = e.target[3].value;
    const city = e.target[4].value;
    const country = e.target[5].value;
    const phoneNumber = e.target[6].value;
    const email = e.target[7].value;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID,
        firstName,
        lastName,
        address,
        zipCode,
        city,
        country,
        phoneNumber,
        email,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/column`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID,
        lineItemIDArr: checkoutItemIDArr,
        operationType: 'checkout',
        lineItem: checkoutItemArr[0],
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        dispatch(accountActions.setCheckoutItemArr([]));
        history.replace('/cart/checkout/complete');
      })
      .catch((err) => console.log(err))
      .finally(() => setIsFetching(false));
  }

  function backHandler() {
    history.replace('/cart');
  }

  if (checkoutItemArr.length === 0) {
    return <Redirect to="/cart"></Redirect>;
  }

  return (
    <div className="checkout">
      <Nav></Nav>
      <div className="title-container">
        <p className="title">Checkout</p>
      </div>
      <form className="content-container" onSubmit={submitHandler}>
        <div className="address">
          <div className="address__input-container left">
            <label htmlFor="first-name">First Name</label>
            <input required type="text" id="first-name" ref={firstNameRef}></input>
          </div>
          <div className="address__input-container right">
            <label htmlFor="last-name">Last Name</label>
            <input required type="text" id="last-name" ref={lasttNameRef}></input>
          </div>
          <div className="address__input-container left long">
            <label htmlFor="address">Address</label>
            <input required type="text" id="address" ref={addressRef}></input>
          </div>
          <div className="address__input-container right short">
            <label htmlFor="zip-code">ZIP Code</label>
            <input required type="text" id="zip-code" ref={zipCodeRef}></input>
          </div>
          <div className="address__input-container left">
            <label htmlFor="city">City</label>
            <input required type="text" id="city" ref={cityRef}></input>
          </div>
          <div className="address__input-container right">
            <label htmlFor="country">Country</label>
            <input required type="text" id="country" ref={countryRef}></input>
          </div>
          <div className="address__input-container left">
            <label htmlFor="phone">Phone Number</label>
            <input required type="text" id="phone" ref={phoneNumberRef}></input>
          </div>
          <div className="address__input-container right">
            <label htmlFor="email">Email</label>
            <input required type="email" id="email" ref={emailRef}></input>
          </div>
          <div className="address__input-container left">
            <label htmlFor="card-no">Card Number</label>
            <input required type="text" id="card-no" ref={cardNumberRef}></input>
          </div>
          <div className="address__input-container right">
            <label htmlFor="security-code">Security Code</label>
            <input required type="text" id="security-code" ref={securityCodeRef}></input>
          </div>
          <div className="address__input-container left">
            <label htmlFor="expiration-date">Expiration Date</label>
            <input required type="text" id="expiration-date" placeholder="MM/YY" ref={expirationDateRef}></input>
          </div>
        </div>
        <div className="summary">
          <div className="summary__order">
            <p className="summary__order--title">Order</p>
            <div className="summary__order--item-container">
              {checkoutItemArr.map((item) => (
                <div key={item.id || Math.random()} className="card">
                  <div className="card__img"></div>
                  <div className="card__detail">
                    <Link to={`/product?collection_id=${item.collection_id}`} className="card__detail--collection">
                      {getCollectionNameFromID(item.collection_id)}
                    </Link>
                    <div className="card__detail--name-price">
                      <Link to={`/product/${item.product_id}`} className="name">
                        {item.product_name}
                      </Link>
                      <p className="price">${item.price * item.quantity}</p>
                    </div>
                    <p className="card__detail--spec">Size: {item.size_name}</p>
                    <p className="card__detail--spec">Color: {item.color_name}</p>
                    <p className="card__detail--spec">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary__order--detail">
              <div className="sub-detail">
                <p className="text">Subtotal</p>
                <p className="number">${total}</p>
              </div>
              <div className="sub-detail">
                <p className="text">Shipping</p>
                <p className="number">$10</p>
              </div>
              <div className="sub-detail total">
                <p className="text">Total</p>
                <p className="number">${total + 10}</p>
              </div>
              <div className="btn-container">
                <p className="back-btn" onClick={backHandler}>
                  Back to cart
                </p>
                <button type="submit" className="submit-btn">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="perk-container">
        <div className="perk">
          <div className="perk__icon-container">
            <img src={deliveryTruckIcon} alt="" className="icon"></img>
          </div>
          <div className="perk__text-container">
            <p className="top">Delivery Service</p>
            <p className="bottom">Track the progress of your order via SMS.</p>
          </div>
        </div>
        <div className="perk">
          <div className="perk__icon-container">
            <img src={returnIcon} alt="" className="icon"></img>
          </div>
          <div className="perk__text-container">
            <p className="top">Return Policy</p>
            <p className="bottom">Return the product in 30 days if you are not satisfied.</p>
          </div>
        </div>
      </div>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default Checkout;
