import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Account.scss';

function Account(props) {
  const history = useHistory();

  const accountID = useSelector((store) => store.account.id);

  const firstNameRef = useRef();
  const lasttNameRef = useRef();
  const addressRef = useRef();
  const zipCodeRef = useRef();
  const cityRef = useRef();
  const countryRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();

  useEffect(() => {
    if (accountID) {
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

  function formSubmitHandler(e) {
    e.preventDefault();

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
  }

  if (!accountID) {
    history.push('/register');
    return <></>;
  }

  return (
    <div className="account">
      <Nav></Nav>
      <div className="title-container">
        <p className="title">My Account</p>
      </div>
      <form className="form" onSubmit={formSubmitHandler}>
        <div className="form__input-container left">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" ref={firstNameRef}></input>
        </div>
        <div className="form__input-container right">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" ref={lasttNameRef}></input>
        </div>
        <div className="form__input-container left long">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" ref={addressRef}></input>
        </div>
        <div className="form__input-container right short">
          <label htmlFor="zip-code">ZIP Code</label>
          <input type="text" id="zip-code" ref={zipCodeRef}></input>
        </div>
        <div className="form__input-container left">
          <label htmlFor="city">City</label>
          <input type="text" id="city" ref={cityRef}></input>
        </div>
        <div className="form__input-container right">
          <label htmlFor="country">Country</label>
          <input type="text" id="country" ref={countryRef}></input>
        </div>
        <div className="form__input-container left">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" ref={phoneNumberRef}></input>
        </div>
        <div className="form__input-container right">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailRef}></input>
        </div>
        <button type="submit" className="form__btn">
          Save Change
        </button>
      </form>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default Account;