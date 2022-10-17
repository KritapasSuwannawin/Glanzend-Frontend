import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AES from 'crypto-js/aes';

import { accountActions } from '../../store/accountSlice';

import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import './Login.scss';

function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isInvalidPassword, setIsInValidPassword] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const accountID = useSelector((store) => store.account.id);

  useEffect(() => {
    if (accountID) {
      navigate(-1);
    }
  }, [navigate, accountID]);

  function formSubmitHandler(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_PRIVATE_KEY).toString();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/login`, {
      method: 'POST',
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
          } else {
            setIsInvalidEmail(false);
          }

          if (message === 'Invalid password') {
            setIsInValidPassword(true);
          } else {
            setIsInValidPassword(false);
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

  return (
    <div className="login">
      <Nav></Nav>
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
