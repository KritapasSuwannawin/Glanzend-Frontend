import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AES from 'crypto-js/aes';

import { accountActions } from '../../store/accountSlice';

import Footer from '../../components/footer/Footer';

import './Register.scss';

function Register(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountID = useSelector((store) => store.account.id);

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState(false);
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);

  useEffect(() => {
    if (accountID) {
      navigate(-1);
    }
  }, [navigate, accountID]);

  function formSubmitHandler(e) {
    e.preventDefault();

    setIsInvalidEmail(false);
    setIsPasswordNotMatch(false);
    setIsPasswordTooShort(false);

    // const password = e.target[4].value;
    // const confirmPassword = e.target[5].value;
    const password = e.target[2].value.trim();
    const confirmPassword = e.target[3].value.trim();

    if (password !== confirmPassword) {
      setIsPasswordNotMatch(true);
      return;
    }

    if (password.length < 8) {
      setIsPasswordTooShort(true);
      return;
    }

    const [firstName, lastName] = e.target[0].value.trim().split(' ');
    // const firstName = e.target[0].value;
    // const lastName = e.target[1].value;
    // const phoneNumber = e.target[2].value;
    // const email = e.target[3].value;
    const email = e.target[1].value.trim();

    const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_PRIVATE_KEY).toString();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName: lastName || '', phoneNumber: '', email, encryptedPassword }),
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

        dispatch(accountActions.setID(id));
      })
      .catch((err) => console.log(err.message));
  }

  function loginClickHandler() {
    navigate('/login', { replace: true });
  }

  return (
    <div className="register">
      <div className="form-container">
        <form className="form" onSubmit={formSubmitHandler}>
          <p className="form__title">Register</p>
          <div className="form__top">
            <div className="form__top--input-container">
              <label className="label" htmlFor="name">
                Enter your name
              </label>
              <input className="input" type="text" id="name" required></input>
            </div>
            {/* <div className="form__top--input-container">
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
            </div> */}
            {/* <div className="form__top--input-container">
              <label className="label" htmlFor="phone-number">
                Enter your phone number
              </label>
              <input className="input" type="tel" id="phone-number" required></input>
            </div> */}
            <div className={`form__top--input-container ${isInvalidEmail ? 'invalid-email' : ''} `}>
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
            <div
              className={`form__top--input-container ${isPasswordNotMatch ? 'password-not-match' : ''} ${
                isPasswordTooShort ? 'password-too-short' : ''
              }`}
            >
              <label className="label" htmlFor="password">
                Enter your password
              </label>
              <input
                className={`input ${isPasswordNotMatch || isPasswordTooShort ? 'invalid' : ''}`}
                type="password"
                id="password"
                required
                autoComplete="new-password"
              ></input>
            </div>
            <div
              className={`form__top--input-container ${isPasswordNotMatch ? 'password-not-match' : ''} ${
                isPasswordTooShort ? 'password-too-short' : ''
              }`}
            >
              <label className="label" htmlFor="confirm-password">
                Confirm your password
              </label>
              <input
                className={`input ${isPasswordNotMatch || isPasswordTooShort ? 'invalid' : ''}`}
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
                <Link to="#" className="link">
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
