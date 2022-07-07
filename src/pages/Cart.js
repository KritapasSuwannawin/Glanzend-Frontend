import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Route, Redirect, Switch } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import SimilarProductContainer from '../components/SimilarProductContainer';
import Checkout from './Checkout';
import CheckoutComplete from './CheckoutComplete';
import './Cart.scss';

function Cart(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const accountID = useSelector((store) => store.account.id);
  const cartLineItemIDArr = useSelector((store) => store.account.cartLineItemIDArr);

  const [cartLineItemArr, setCartLineItemArr] = useState([]);
  const [isDoneStartup, setIsDoneStartup] = useState(false);
  const [checkedItemIDArr, setCheckedItemIDArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [similarProductArr, setSimilarProductArr] = useState([]);
  const [checkedItemArr, setCheckedItemArr] = useState([]);

  useEffect(() => {
    if (accountID) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/column?account_id=${accountID}&column=cart_line_item_id_arr`, {
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

          const { returnValue } = data;
          dispatch(accountActions.setCartLineItemIDArr(returnValue));

          setIsDoneStartup(true);
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, accountID]);

  useEffect(() => {
    if (!isDoneStartup) {
      return;
    }

    if (cartLineItemIDArr.length > 0 && accountID) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/account/line-item?line_item_id_arr=${cartLineItemIDArr}&type=cart&account_id=${accountID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const { status, data, message } = json;

          if (status === 'error') {
            throw new Error(message);
          }

          const { lineItemInfo } = data;
          setCartLineItemArr(lineItemInfo);
        })
        .catch((err) => console.log(err));
    } else {
      setCartLineItemArr([]);
    }
  }, [cartLineItemIDArr, accountID, isDoneStartup]);

  useEffect(() => {
    let total = 0;
    const checkedItemArr = [];

    checkedItemIDArr.forEach((id) => {
      const item = cartLineItemArr.find((item) => item.id === id);

      if (item) {
        total += item.price * item.quantity;
        checkedItemArr.push(item);
      }
    });

    setTotal(total);
    setCheckedItemArr(checkedItemArr);
  }, [checkedItemIDArr, cartLineItemArr]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product?limit=${cartLineItemIDArr.length + 4}`, {
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

        const { productArr } = data;
        setSimilarProductArr(productArr.filter((product) => !cartLineItemIDArr.includes(product.id)).slice(0, 4));
      })
      .catch((err) => console.log(err));
  }, [cartLineItemIDArr]);

  const toggleCheckItemHandler = useCallback((id, isChecked) => {
    if (isChecked) {
      setCheckedItemIDArr((prev) => {
        const arr = [...prev];

        if (!arr.includes(id)) {
          arr.push(id);
        }

        return arr;
      });
    } else {
      setCheckedItemIDArr((prev) => {
        const arr = [...prev];

        if (arr.includes(id)) {
          const index = arr.indexOf(id);
          arr.splice(index, 1);
        }

        return arr;
      });
    }

    setCartLineItemArr((prev) => {
      const updatedCartLineItemArr = [...prev];
      const index = updatedCartLineItemArr.findIndex((item) => item.id === id);
      if (index !== -1) {
        updatedCartLineItemArr[index] = { ...updatedCartLineItemArr[index], is_checked: isChecked };
      }
      return updatedCartLineItemArr;
    });
  }, []);

  function quantityChangeHandler(id, quantity) {
    setCartLineItemArr((prev) => {
      const updatedCartLineItemArr = [...prev];
      const index = updatedCartLineItemArr.findIndex((item) => item.id === id);
      if (index !== -1) {
        updatedCartLineItemArr[index] = { ...updatedCartLineItemArr[index], quantity };
      }
      return updatedCartLineItemArr;
    });
  }

  function checkoutClickHandler() {
    if (checkedItemArr.length > 0) {
      history.push('/cart/checkout');
    }
  }

  if (!accountID) {
    history.push('/register');
    return <></>;
  }

  return (
    <Switch>
      <Route exact path="/cart">
        <div className="cart">
          <Nav></Nav>
          <div className="title-container">
            <p className="title">My Cart</p>
          </div>
          <div className="main-container">
            <div className="main-container__left">
              {cartLineItemArr.length > 0 && (
                <>
                  {/* <div className="select-all">
              <input type="checkbox" className="select-all__checkbox" id="checkbox-1"></input>
              <label htmlFor="checkbox-1" className="select-all__label">
                Select All
              </label>
            </div> */}
                  {cartLineItemArr.map((item) => (
                    <div key={item.id} className="main-container__left--card">
                      <ItemCard
                        item={item}
                        toggleCheckItemHandler={toggleCheckItemHandler}
                        quantityChangeHandler={quantityChangeHandler}
                      ></ItemCard>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="main-container__right">
              <div className="main-container__right--summary">
                <p className="title">Summary</p>
                <div className="total">
                  <p className="text">Total</p>
                  <p className="number">${total.toFixed(2)}</p>
                </div>
                <div className="btn" onClick={checkoutClickHandler}>
                  Checkout
                </div>
              </div>
            </div>
          </div>
          {similarProductArr.length > 0 && <SimilarProductContainer similarProductArr={similarProductArr}></SimilarProductContainer>}
          <Footer showBorderTop></Footer>
        </div>
      </Route>
      <Route exact path="/cart/checkout">
        <Checkout checkedItemArr={checkedItemArr} total={total}></Checkout>
      </Route>
      <Route exact path="/cart/checkout/complete">
        <CheckoutComplete></CheckoutComplete>
      </Route>
      <Route path="/">
        <Redirect to="/cart"></Redirect>
      </Route>
    </Switch>
  );
}

export default Cart;
