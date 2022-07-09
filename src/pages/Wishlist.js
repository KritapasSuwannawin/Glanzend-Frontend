import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import './Wishlist.scss';

function Wishlist(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const accountID = useSelector((store) => store.account.id);
  const wishlistLineItemIDArr = useSelector((store) => store.account.wishlistLineItemIDArr);

  const [wishlistLineItemArr, setWishlistLineItemArr] = useState([]);
  const [isDoneStartup, setIsDoneStartup] = useState(false);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [checkedItemIDArr, setCheckedItemIDArr] = useState([]);

  useEffect(() => {
    let cancel = false;

    if (accountID) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/column?account_id=${accountID}&column=wishlist_line_item_id_arr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (cancel) {
            return;
          }

          const { status, data, message } = json;

          if (status === 'error') {
            throw new Error(message);
          }

          const { returnValue } = data;
          dispatch(accountActions.setWishlistLineItemIDArr(returnValue));

          setIsDoneStartup(true);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      cancel = true;
    };
  }, [dispatch, accountID]);

  useEffect(() => {
    let cancel = false;

    if (!isDoneStartup) {
      return;
    }

    if (wishlistLineItemIDArr.length > 0 && accountID) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/account/line-item?line_item_id_arr=${wishlistLineItemIDArr}&type=wishlist&account_id=${accountID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          if (cancel) {
            return;
          }

          const { status, data, message } = json;

          if (status === 'error') {
            throw new Error(message);
          }

          const { lineItemInfo } = data;
          setWishlistLineItemArr(lineItemInfo);
        })
        .catch((err) => console.log(err));
    } else {
      setWishlistLineItemArr([]);
    }

    return () => {
      cancel = true;
    };
  }, [wishlistLineItemIDArr, accountID, isDoneStartup]);

  function showInStockOnlyClickHandler(e) {
    setShowOnlyInStock(e.target.checked);
  }

  function addToCartClickHandler() {
    if (checkedItemIDArr.length === 0) {
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/column`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID,
        lineItemIDArr: checkedItemIDArr,
        operationType: 'wishlist to cart',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        dispatch(accountActions.setWishlistLineItemIDArr(wishlistLineItemIDArr.filter((itemID) => !checkedItemIDArr.includes(itemID))));
        setCheckedItemIDArr([]);
      })
      .catch((err) => console.log(err));
  }

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
  }, []);

  if (!accountID) {
    history.push('/register');
    return <></>;
  }

  return (
    <div className="wishlist">
      <Nav></Nav>
      <div className="title-container">
        <p className="title">Wishlist</p>
      </div>
      <div className="card-container">
        {wishlistLineItemArr.length > 0 && (
          <>
            {/* <div className="select-all">
              <input type="checkbox" className="select-all__checkbox" id="checkbox-1"></input>
              <label htmlFor="checkbox-1" className="select-all__label">
                Select All
              </label>
            </div> */}
            {wishlistLineItemArr
              .filter((item) => {
                if (showOnlyInStock) {
                  return item.is_in_stock === true;
                }

                return true;
              })
              .map((item) => (
                <div key={item.id} className="card">
                  <ItemCard item={item} toggleCheckItemHandler={toggleCheckItemHandler}></ItemCard>
                </div>
              ))}
            <div className="add-to-cart">
              <div className="add-to-cart__btn" onClick={addToCartClickHandler}>
                Add to Cart
              </div>
              <div className="add-to-cart__in-stock">
                <input
                  type="checkbox"
                  className="add-to-cart__in-stock--checkbox"
                  id="checkbox-2"
                  onClick={showInStockOnlyClickHandler}
                  defaultChecked={showOnlyInStock}
                ></input>
                <label htmlFor="checkbox-2" className="add-to-cart__in-stock--label">
                  Show in stock only
                </label>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default Wishlist;
