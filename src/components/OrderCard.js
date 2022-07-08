import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import deliveryIcon from '../icon/Delivery Icon.svg';
import packageIcon from '../icon/Package Icon.svg';
import upArrowIcon from '../icon/Up Arrow Icon.svg';
import downArrowIcon from '../icon/Down Arrow Icon.svg';

import './OrderCard.scss';

function OrderCard(props) {
  const {
    id,
    account_id: accountID,
    line_item_id_arr: lineItemIDArr,
    order_date: orderDate,
    address,
    city,
    country,
    zip_code: zipCode,
  } = props.order;

  const [lineItemArr, setLineItemArr] = useState([]);
  const [isDropDown, setIsDropDown] = useState(false);

  useEffect(() => {
    let cancel = false;

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/account/line-item?line_item_id_arr=${lineItemIDArr}&type=order&account_id=${accountID}`,
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
        setLineItemArr(lineItemInfo);
      })
      .catch((err) => console.log(err));

    return () => {
      cancel = true;
    };
  }, [lineItemIDArr, accountID]);

  function toggleDropDownHandler() {
    setIsDropDown((prev) => !prev);
  }

  const status = Math.floor((Date.now() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24)) < 3 ? 'Going to you' : 'Delivered';

  return (
    <div key={id} className="order-card">
      <div className={`header ${isDropDown ? 'hideBorder' : ''}`}>
        <div className="header__left">
          <p className="header__left--id">ORDER{id}</p>
          <div className="header__left--dot"></div>
          <p className="header__left--date">
            {new Date(orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <div className="header__left--dot"></div>
          <p className={`header__left--status ${status === 'Going to you' ? 'orange' : 'green'}`}>
            {status} <img src={status === 'Going to you' ? deliveryIcon : packageIcon} alt="" className="icon"></img>
          </p>
        </div>
        <div className="header__right">
          <img src={!isDropDown ? downArrowIcon : upArrowIcon} alt="" className="header__right--icon" onClick={toggleDropDownHandler}></img>
        </div>
      </div>
      {isDropDown && (
        <div className="body">
          {lineItemArr.map((item) => (
            <div key={item.id} className="body__item-card">
              <div className="body__item-card--left">
                <div className="img"></div>
                <Link to={`/product/${item.product_id}`} className="name">
                  {item.product_name} ({item.size_name})
                </Link>
                <p className="quantity">x{item.quantity}</p>
              </div>
              <div className="body__item-card--right">
                <p className="amount">${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="body__detail top">
            <p className="body__detail--left">Shipping fee</p>
            <p className="body__detail--right">$10</p>
          </div>
          <div className="body__detail">
            <p className="body__detail--left">Order amount</p>
            <p className="body__detail--right big">
              ${lineItemArr.reduce((prev, current) => prev + current.price * current.quantity, 0) + 10}
            </p>
          </div>
          <div className="body__detail">
            <p className="body__detail--left">Delivered to</p>
            <p className="body__detail--right">
              {address}, {city}, {country}, {zipCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
