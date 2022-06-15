import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';

import { resourceActions } from '../store/resourceSlice';

import heartIcon from '../icon/Heart Icon.svg';
import leftArrowIcon from '../icon/Left Arrow Icon.svg';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './ProductDetail.scss';

function ProductDetail(props) {
  const { id } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const categoryArr = useSelector((store) => store.resource.categoryArr);
  const colorArr = useSelector((store) => store.resource.colorArr);
  const sizeArr = useSelector((store) => store.resource.sizeArr);

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [categoryID, setCategoryID] = useState();
  const [colorIDArr, setColorIDArr] = useState([]);
  const [sizeIDArr, setSizeIDArr] = useState([]);
  const [isInStock, setIsInStock] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [colorID, setColorID] = useState();
  const [sizeID, setSizeID] = useState();
  const [quantity, setQuantity] = useState(1);
  const [similarProductArr, setSimilarProductArr] = useState([]);

  useEffect(() => {
    if (colorArr.length === 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/product-startup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          const { status, data, message } = json;

          if (status !== 'success') {
            throw new Error(message);
          }

          const { colorArr, sizeArr } = data;
          dispatch(resourceActions.setColorArr(colorArr));
          dispatch(resourceActions.setSizeArr(sizeArr));
        })
        .catch((err) => console.log(err));
    }

    if (categoryArr.length === 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/home-startup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          const { status, data, message } = json;

          if (status !== 'success') {
            throw new Error(message);
          }

          const { categoryArr, collectionArr } = data;
          dispatch(resourceActions.setCategoryArr(categoryArr));
          dispatch(resourceActions.setCollectionArr(collectionArr));
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, categoryArr, colorArr]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status !== 'success') {
          throw new Error(message);
        }

        const {
          color_id_arr: colorIDArr,
          is_in_stock: isInStock,
          size_id_arr: sizeIDArr,
          category_id: categoryID,
          name,
          price,
        } = data.product;

        setName(name);
        setPrice(price);
        setCategoryID(categoryID);
        setColorIDArr(colorIDArr);
        setSizeIDArr(sizeIDArr);
        setIsInStock(isInStock);

        setIsLoading(false);
        setColorID(colorIDArr[0]);
        setSizeID(sizeIDArr[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
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
        const { status, data, message } = json;

        if (status !== 'success') {
          throw new Error(message);
        }

        const { productArr } = data;
        setSimilarProductArr(productArr.filter((product) => product.id !== Number(id)).slice(0, 4));
      })
      .catch((err) => console.log(err));
  }, [categoryID, id]);

  function getCategoryNameFromID(id) {
    return categoryArr.find((cat) => cat.id === id).name;
  }

  function getColorCodeFromID(id) {
    return colorArr.find((color) => color.id === id).code;
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

  function goBackHandler() {
    history.goBack();
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
                {categoryArr.length > 0 && (
                  <>
                    <Link to={`/product?category_id=${categoryID}`}>{getCategoryNameFromID(categoryID)}</Link>
                    {` > `}
                  </>
                )}
                <span className="name">{name}</span>
              </p>
              <div className="detail__right--name-container">
                <p className="name">{name}</p>
                <div className="add-to-wishlist">
                  <img src={heartIcon} alt="" className="add-to-wishlist__icon"></img>
                  <p className="add-to-wishlist__text">Add to Wishlist</p>
                </div>
              </div>
              <p className="detail__right--price">$ {Number(price).toFixed(2)}</p>
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
              <div className="detail__right--btn-container">
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
                <div className="action">
                  {isInStock ? (
                    <>
                      <div className="action__buy-btn">Buy</div>
                      <div className="action__add-to-cart-btn">Add to Cart</div>
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
      {similarProductArr.length > 0 && (
        <div className="similar-product-container">
          <div className="similar-product">
            <p className="similar-product__title">Similar Products</p>
            <div className="similar-product__card-container">
              {similarProductArr.map((product, i) => (
                <div className="card" key={i}>
                  <Link to={`/product/${product.id}`} className="card__img"></Link>
                  {categoryArr.length > 0 && (
                    <Link to={`/product?category_id=${product.category_id}`} className="card__category">
                      {getCategoryNameFromID(product.category_id)}
                    </Link>
                  )}
                  <Link to={`/product/${product.id}`} className="card__name">
                    {product.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="continue-shopping-container">
        <div className="continue-shopping">
          <img src={leftArrowIcon} alt="" className="continue-shopping__arrow" onClick={goBackHandler}></img>
          <p className="continue-shopping__text" onClick={goBackHandler}>
            Continue Shopping
          </p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ProductDetail;
