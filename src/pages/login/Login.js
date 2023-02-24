import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AES from 'crypto-js/aes';

import { accountActions } from '../../store/accountSlice';

import Footer from '../../components/footer/Footer';
import './Login.scss';

function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInValidPassword] = useState(false);
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);

  const accountID = useSelector((store) => store.account.id);

  useEffect(() => {
    if (accountID) {
      navigate(-1);
    }
  }, [navigate, accountID]);

  function formSubmitHandler(e) {
    e.preventDefault();

    setIsInvalidEmail(false);
    setIsInValidPassword(false);
    setIsPasswordTooShort(false);

    const email = e.target[0].value;
    const password = e.target[1].value;

    if (password.length < 8) {
      setIsPasswordTooShort(true);
      return;
    }

    const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_PRIVATE_KEY).toString();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, encryptedPassword }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        if (status === 'fail') {
          if (message === 'This email was not yet registered') {
            setIsInvalidEmail(true);
          }

          if (message === 'Invalid password') {
            setIsInValidPassword(true);
          }

          return;
        }

        const { id } = data;

        dispatch(accountActions.setID(id));
      })
      .catch((err) => console.log(err.message));
  }

  return (
    <div className="login">
      <div className="form-container">
        <form className="form" onSubmit={formSubmitHandler}>
          <p className="form__title">Login</p>
          <div className="form__top">
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
            <div
              className={`form__top--input-container ${isInvalidPassword ? 'invalid-password' : ''} ${
                isPasswordTooShort ? 'password-too-short' : ''
              }`}
            >
              <label className="label" htmlFor="password">
                Enter your password
              </label>
              <input
                className={`input ${isInvalidPassword || isPasswordTooShort ? 'invalid' : ''}`}
                type="password"
                id="password"
                required
                autoComplete="new-password"
              ></input>
            </div>
          </div>
          <button type="submit" className="form__btn">
            Log In
          </button>
        </form>
      </div>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default Login;
