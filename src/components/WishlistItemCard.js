// import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import crossIcon from '../icon/Cross Icon.svg';

import './WishlistItemCard.scss';

function WishlistItemCard(props) {
  const { toggleCheckItemHandler, item } = props;

  const {
    id: itemID,
    price,
    product_id: productID,
    product_name: productName,
    // size_name: sizeName,
    // color_name: colorName,
    is_in_stock: isInStock,
    is_checked: isChecked,
  } = item;

  const dispatch = useDispatch();

  const accountID = useSelector((store) => store.account.id);

  // const [quantity, setQuantity] = useState(props.item.quantity);

  useEffect(() => {
    toggleCheckItemHandler(itemID, isChecked);
  }, [itemID, isChecked, toggleCheckItemHandler]);

  function checkboxClickHandler(e) {
    const isChecked = e.target.checked;

    if (!isInStock) {
      e.target.checked = !isChecked;
      return;
    }

    toggleCheckItemHandler(itemID, isChecked);
    updateDatabase('is_checked', isChecked);
  }

  // function plusQuantityClickHandler() {
  //   setQuantity((quantity) => {
  //     const newValue = quantity + 1;

  //     updateDatabase('quantity', newValue);

  //     return newValue;
  //   });
  // }

  // function minusQuantityClickHandler() {
  //   if (quantity > 1) {
  //     setQuantity((quantity) => {
  //       const newValue = quantity - 1;

  //       updateDatabase('quantity', newValue);

  //       return newValue;
  //     });
  //   }
  // }

  function updateDatabase(column, value) {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/line-item`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemID,
        column,
        value,
      }),
    }).catch((err) => console.log(err));
  }

  function crossClickHandler() {
    toggleCheckItemHandler(itemID, false);
    dispatch(accountActions.removeIDFromWishlistLineItemIDArr(itemID));

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/line-item`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemID,
        accountID,
        type: 'wishlist',
      }),
    }).catch((err) => console.log(err));
  }

  return (
    <div className="wishlist-item-card">
      <div className="left">
        <input
          type="checkbox"
          className="left__checkbox"
          onClick={checkboxClickHandler}
          disabled={!isInStock}
          defaultChecked={isChecked}
        ></input>
        <div className="left__img-container">
          <div className="img"></div>
        </div>
        <img src={crossIcon} alt="" className="left__icon" onClick={crossClickHandler}></img>
        <div className="left__detail-container">
          <Link to={`/product/${productID}`} className="name">
            {productName}
          </Link>
          <p className="price">$ {price.toFixed(2)}</p>
          {/* <p className="size-color">
            Size: {sizeName} | Color: {colorName}
          </p> */}
          <div className="bottom-container">
            {/* <div className="bottom-container__minus-btn" onClick={minusQuantityClickHandler}>
              -
            </div>
            <p className="bottom-container__quantity">{quantity}</p>
            <div className="bottom-container__plus-btn" onClick={plusQuantityClickHandler}>
              +
            </div> */}
            <p className="bottom-container__status">
              Status: <span className={isInStock ? 'in-stock' : 'out-of-stock'}>{isInStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="right">
        <img src={crossIcon} alt="" className="right__icon" onClick={crossClickHandler}></img>
      </div>
    </div>
  );
}

export default WishlistItemCard;