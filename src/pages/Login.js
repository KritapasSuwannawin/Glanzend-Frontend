import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Login.scss';

function Login(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isInvalidPassword, setIsInValidPassword] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  function formSubmitHandler(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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

        const { id } = data;

        dispatch(accountActions.setID(id));
        history.goBack();
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
