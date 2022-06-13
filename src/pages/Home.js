import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { resourceActions } from '../store/resourceSlice';

import snowIcon from '../icon/Snow Icon.svg';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import './Home.scss';

function Home() {
  const dispatch = useDispatch();

  const categoryArr = useSelector((store) => store.resource.categoryArr);
  const collectionArr = useSelector((store) => store.resource.collectionArr);

  useEffect(() => {
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
  }, [dispatch, categoryArr]);

  return (
    <div className="home">
      <Nav></Nav>
      <div className="landing-container">
        <div className="landing">
          <p className="landing__title">
            Sprakling on<br></br>your body.
          </p>
          <p className="landing__desc">
            Best quality jewelry products are available in our website.<br></br>Never go out of the style with our new featured collections.
            <br></br>Discover our accessories collections and be the best, confident you.
          </p>
          <Link to="/product" className="landing__btn">
            Discover Now
          </Link>
          <p className="landing__brand">Glänzend.*</p>
        </div>
      </div>
      <div className="why-us-container">
        <div className="why-us">
          <div className="why-us__left">
            <p className="why-us__left--title">
              Why<br></br>choose<br></br>us?
            </p>
          </div>
          <div className="why-us__right">
            <p className="why-us__right--desc">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>
            <div className="why-us__right--value-container">
              <p className="value">
                <span className="value__bullet-point">*</span>
                <span className="value__text">Made by high-quality material</span>
              </p>
              <p className="value">
                <span className="value__bullet-point">*</span>
                <span className="value__text">Lots of promo and discounts</span>
              </p>
              <p className="value">
                <span className="value__bullet-point">*</span>
                <span className="value__text">Fast and safe delivery</span>
              </p>
              <p className="value">
                <span className="value__bullet-point">*</span>
                <span className="value__text">Easy purchaseand payment</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="category-container">
        <div className="category">
          <p className="category__title">Categories</p>
          <div className="category__card-container">
            {categoryArr.slice(0, 3).map((category) => (
              <Link to={`/product?category_id=${category.id}`} className="card" key={category.id}>
                <div className="card__img"></div>
                <p className="card__name">{category.name}</p>
              </Link>
            ))}
            <Link to="/product" className="card">
              <div className="card__img"></div>
              <p className="card__name">View All</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="collection-container">
        <div className="collection">
          <p className="collection__title">
            Featured<br></br>Collections
          </p>
          <div className="collection__card-container">
            {collectionArr.slice(0, 3).map((collection) => (
              <Link to={`/product?collection_id=${collection.id}`} className="card" key={collection.id}>
                <div className="card__img"></div>
                <p className="card__name">{collection.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="offer-container">
        <div className="offer">
          <p className="offer__title">
            <img src={snowIcon} alt="" className="offer__title--snow"></img>
            <span className="offer__title--text">
              Special<br></br>Offer
            </span>
            <img src={snowIcon} alt="" className="snow"></img>
          </p>
          <div className="offer__detail-container">
            <div className="detail">
              <p className="detail__number">50%</p>
              <p className="detail__name">
                First<br></br>Purchase
              </p>
            </div>
            <div className="offer__detail-container--separator"></div>
            <div className="detail">
              <p className="detail__number">25%</p>
              <p className="detail__name">
                For<br></br>Member
              </p>
            </div>
            <div className="offer__detail-container--separator"></div>
            <div className="detail">
              <p className="detail__number">30%</p>
              <p className="detail__name">
                Summer<br></br>Sale
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
