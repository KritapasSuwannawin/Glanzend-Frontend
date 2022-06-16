import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

import './Register.scss';

function Register(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isInvalidPassword, setIsInValidPassword] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  function formSubmitHandler(e) {
    e.preventDefault();

    const password = e.target[4].value;
    const confirmPassword = e.target[5].value;

    if (password !== confirmPassword) {
      setIsInValidPassword(true);
      return;
    } else {
      setIsInValidPassword(false);
    }

    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const phoneNumber = e.target[2].value;
    const email = e.target[3].value;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phoneNumber, email, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        if (status === 'fail') {
          if (message === 'This email was already used') {
            setIsInvalidEmail(true);
          }
          return;
        }

        const { id } = data;

        setIsInvalidEmail(false);
        dispatch(accountActions.setID(id));
        history.goBack();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="register">
      <Nav></Nav>
      <div className="form-container">
        <form className="form" onSubmit={formSubmitHandler}>
          <p className="form__title">Register</p>
          <div className="form__top">
            <div className="form__top--input-container">
              <label className="label" htmlFor="first-name">
                Enter your first name
              </label>
              <input className="input" type="text" id="first-name" autoComplete="new-password" required></input>
            </div>
            <div className="form__top--input-container">
              <label className="label" htmlFor="last-name">
                Enter your last name
              </label>
              <input className="input" type="text" id="last-name" autoComplete="new-password" required></input>
            </div>
            <div className="form__top--input-container">
              <label className="label" htmlFor="phone-number">
                Enter your phone number
              </label>
              <input className="input" type="tel" id="phone-number" autoComplete="new-password" required></input>
            </div>
            <div className={`form__top--input-container ${isInvalidEmail ? 'invalid-email' : ''}`}>
              <label className="label" htmlFor="email">
                Enter your email
              </label>
              <input
                className={`input ${isInvalidEmail ? 'invalid' : ''}`}
                type="email"
                id="email"
                autoComplete="new-password"
                required
              ></input>
            </div>
            <div className={`form__top--input-container ${isInvalidPassword ? 'invalid-password' : ''}`}>
              <label className="label" htmlFor="password">
                Enter your password
              </label>
              <input
                className={`input ${isInvalidPassword ? 'invalid' : ''}`}
                type="password"
                id="password"
                autoComplete="new-password"
                required
              ></input>
            </div>
            <div className={`form__top--input-container ${isInvalidPassword ? 'invalid-password' : ''}`}>
              <label className="label" htmlFor="confirm-password">
                Confirm your password
              </label>
              <input
                className={`input ${isInvalidPassword ? 'invalid' : ''}`}
                type="password"
                id="confirm-password"
                autoComplete="new-password"
                required
              ></input>
            </div>
          </div>
          <div className="form__ending">
            <div className="form__ending--policy">
              <input type="checkbox" className="checkbox" required></input>
              <p className="text">
                I agree with the{' '}
                <Link to="/privacy-policy" className="link">
                  Privacy policy
                </Link>
              </p>
            </div>
            <p className="form__ending--login">
              Already have an account? Please{' '}
              <Link to="/login" className="link">
                Log in
              </Link>{' '}
              here
            </p>
          </div>
          <button type="submit" className="form__btn">
            Register
          </button>
        </form>
      </div>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default Register;
