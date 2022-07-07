import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';

import { accountActions } from '../store/accountSlice';

import heartIcon from '../icon/Heart Icon.svg';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SimilarProductContainer from '../components/SimilarProductContainer';
import './ProductDetail.scss';

function ProductDetail(props) {
  const { id: productID } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const collectionArr = useSelector((store) => store.resource.collectionArr);
  const colorArr = useSelector((store) => store.resource.colorArr);
  const sizeArr = useSelector((store) => store.resource.sizeArr);

  const accountID = useSelector((store) => store.account.id);

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [categoryID, setCategoryID] = useState();
  const [collectionID, setCollectionID] = useState();
  const [colorIDArr, setColorIDArr] = useState([]);
  const [sizeIDArr, setSizeIDArr] = useState([]);
  const [isInStock, setIsInStock] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [colorID, setColorID] = useState();
  const [sizeID, setSizeID] = useState();
  const [quantity, setQuantity] = useState(1);
  const [similarProductArr, setSimilarProductArr] = useState([]);

  useEffect(() => {
    let cancel = false;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/${productID}`, {
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

        const {
          color_id_arr: colorIDArr,
          is_in_stock: isInStock,
          size_id_arr: sizeIDArr,
          category_id: categoryID,
          collection_id: collectionID,
          name,
          price,
        } = data.product;

        setName(name);
        setPrice(price);
        setCategoryID(categoryID);
        setCollectionID(collectionID);
        setColorIDArr(colorIDArr);
        setSizeIDArr(sizeIDArr);
        setIsInStock(isInStock);

        setIsLoading(false);
        setColorID(colorIDArr[0]);
        setSizeID(sizeIDArr[0]);
      })
      .catch((err) => console.log(err));

    return () => {
      cancel = true;
    };
  }, [productID]);

  useEffect(() => {
    let cancel = false;

    if (!categoryID) {
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product?category_id=${categoryID}&limit=5`, {
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

        const { productArr } = data;
        setSimilarProductArr(productArr.filter((product) => product.id !== Number(productID)).slice(0, 4));
      })
      .catch((err) => console.log(err));

    return () => {
      cancel = true;
    };
  }, [categoryID, productID]);

  function getCollectionNameFromID(id) {
    return collectionArr.find((col) => col.id === id).name;
  }

  function getColorCodeFromID(id) {
    return colorArr.find((color) => color.id === id).code;
  }

  function getColorNameFromID(id) {
    return colorArr.find((color) => color.id === id).name;
  }

  function getSizeNameFromID(id) {
    return sizeArr.find((size) => size.id === id).name;
  }

  function colorClickHandler() {
    setColorID(this);
  }

  function sizeClickHandler() {
    setSizeID(this);
  }

  function plusQuantityClickHandler() {
    setQuantity((quantity) => quantity + 1);
  }

  function minusQuantityClickHandler() {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1);
    }
  }

  function addToWishListHandler() {
    if (!accountID) {
      history.push('/register');
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/line-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID,
        productID,
        quantity,
        sizeID,
        colorID,
        type: 'wishlist',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        if (status === 'fail') {
          console.log(message);
          return;
        }
      })
      .catch((err) => console.log(err));
  }

  function addToCartHandler() {
    if (!accountID) {
      history.push('/register');
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/line-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountID,
        productID,
        quantity,
        sizeID,
        colorID,
        type: 'cart',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        if (status === 'fail') {
          console.log(message);
          return;
        }
      })
      .catch((err) => console.log(err));
  }

  function buyHandler() {
    if (!accountID) {
      history.push('/register');
      return;
    }

    dispatch(
      accountActions.setCheckoutItemArr([
        {
          account_id: accountID,
          collection_id: collectionID,
          color_id: colorID,
          color_name: getColorNameFromID(colorID),
          id: undefined,
          is_checked: undefined,
          is_in_stock: isInStock,
          price: price,
          product_id: productID,
          product_name: name,
          quantity: quantity,
          size_id: sizeID,
          size_name: getSizeNameFromID(sizeID),
          type: undefined,
        },
      ])
    );

    history.push('/cart/checkout');
  }

  return (
    <div className="product-detail">
      <Nav></Nav>
      <div className="title-container">
        <p className="title">Product Details</p>
      </div>
      {!isLoading && (
        <div className="detail-container">
          <div className="detail">
            <div className="detail__left">
              <div className="detail__left--main-img"></div>
              <div className="detail__left--small-img-container">
                <div className="small-img"></div>
                <div className="small-img"></div>
                <div className="small-img"></div>
              </div>
            </div>
            <div className="detail__right">
              <p className="detail__right--link">
                {collectionArr.length > 0 && (
                  <>
                    <Link to={`/product?colleciton_id=${collectionID}`}>{getCollectionNameFromID(collectionID)}</Link>
                    {` > `}
                  </>
                )}
                <span className="name">{name}</span>
              </p>
              <div className="detail__right--name-container">
                <p className="name">{name}</p>
                <div className="add-to-wishlist" onClick={addToWishListHandler}>
                  <img src={heartIcon} alt="" className="add-to-wishlist__icon"></img>
                  <p className="add-to-wishlist__text">Add to Wishlist</p>
                </div>
              </div>
              <p className="detail__right--price">${Number(price).toFixed(2)}</p>
              <p className="detail__right--desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec varius augue. Duis mauris arcu.
              </p>
              <div className="detail__right--color-container">
                {colorArr.length > 0 &&
                  colorIDArr.map((id, i) => (
                    <div
                      className={`color ${colorID === id ? 'active' : ''}`}
                      key={i}
                      style={{ backgroundColor: `${getColorCodeFromID(id)}` }}
                      onClick={colorClickHandler.bind(id)}
                    ></div>
                  ))}
              </div>
              <div className="detail__right--size-container">
                {sizeArr.length > 0 &&
                  sizeIDArr.map((id, i) => (
                    <p className={`size ${sizeID === id ? 'active' : ''}`} key={i} onClick={sizeClickHandler.bind(id)}>
                      {getSizeNameFromID(id)}
                    </p>
                  ))}
              </div>
              <div className={`detail__right--btn-container ${!isInStock ? 'out-of-stock' : ''}`}>
                {isInStock && (
                  <div className="quantity">
                    <p className="quantity__text">Quantity</p>
                    <div className="quantity__btn">
                      <div className="quantity__btn--minus-btn" onClick={minusQuantityClickHandler}>
                        -
                      </div>
                      <div className="quantity__btn--number">{quantity}</div>
                      <div className="quantity__btn--plus-btn" onClick={plusQuantityClickHandler}>
                        +
                      </div>
                    </div>
                  </div>
                )}
                <div className="action">
                  {isInStock ? (
                    <>
                      <div className="action__buy-btn" onClick={buyHandler}>
                        Buy
                      </div>
                      <div className="action__add-to-cart-btn" onClick={addToCartHandler}>
                        Add to Cart
                      </div>
                    </>
                  ) : (
                    <div className="action__out-of-stock-btn">Out of Stock</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {similarProductArr.length > 0 && <SimilarProductContainer similarProductArr={similarProductArr}></SimilarProductContainer>}
      <Footer showBorderTop></Footer>
    </div>
  );
}

export default ProductDetail;
