import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AES from 'crypto-js/aes';

import { accountActions } from '../../store/accountSlice';

import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';

import './Register.scss';

function Register(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountID = useSelector((store) => store.account.id);

  const [isInvalidPassword, setIsInValidPassword] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  useEffect(() => {
    if (accountID) {
      navigate(-1);
    }
  }, [navigate, accountID]);

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

    const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_PRIVATE_KEY).toString();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phoneNumber, email, encryptedPassword }),
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
          } else {
            setIsInvalidEmail(false);
          }
          return;
        }

        localStorage.setItem('glanzend-email', email);
        localStorage.setItem('glanzend-password', encryptedPassword);

        const { id } = data;

        dispatch(accountActions.setID(id));
      })
      .catch((err) => console.log(err));
  }

  function loginClickHandler() {
    navigate('/login', { replace: true });
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
              <input className="input" type="text" id="first-name" required></input>
            </div>
            <div className="form__top--input-container">
              <label className="label" htmlFor="last-name">
                Enter your last name
              </label>
              <input className="input" type="text" id="last-name" required></input>
            </div>
            <div className="form__top--input-container">
              <label className="label" htmlFor="phone-number">
                Enter your phone number
              </label>
              <input className="input" type="tel" id="phone-number" required></input>
            </div>
            <div className={`form__top--input-container ${isInvalidEmail ? 'invalid-email' : ''}`}>
              <label className="label" htmlFor="email">
                Enter your email
              </label>
              <input
                className={`input ${isInvalidEmail ? 'invalid' : ''}`}
                type="email"
                id="email"
                required
                autoComplete="username"
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
                required
                autoComplete="new-password"
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
                required
                autoComplete="new-password"
              ></input>
            </div>
          </div>
          <div className="form__ending">
            <div className="form__ending--policy">
              <input id="checkbox" type="checkbox" className="checkbox" required></input>
              <label htmlFor="checkbox" className="text">
                I agree with the{' '}
                <Link to="/privacy-policy" className="link">
                  Privacy policy
                </Link>
              </label>
            </div>
            <p className="form__ending--login">
              Already have an account? Please{' '}
              <span className="link" onClick={loginClickHandler}>
                Log in
              </span>{' '}
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
