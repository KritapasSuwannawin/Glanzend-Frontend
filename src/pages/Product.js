import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { productActions } from '../store/productSlice';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ProductSidebar from '../components/ProductSidebar';
import ProductItemCard from '../components/ProductItemCard';
import './Product.scss';

function Product(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();

  const collectionID = useSelector((store) => store.product.collectionID);
  const categoryID = useSelector((store) => store.product.categoryID);
  const colorID = useSelector((store) => store.product.colorID);
  const minPrice = useSelector((store) => store.product.minPrice);
  const maxPrice = useSelector((store) => store.product.maxPrice);
  const offset = useSelector((store) => store.product.offset);
  const view = useSelector((store) => store.product.view);
  const currentProductArr = useSelector((store) => store.product.currentProductArr);

  const [showLoadMore, setShowLoadMore] = useState(true);
  const [isDoneStartup, setIsDoneStartup] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    if (searchRef.current !== search) {
      searchRef.current = search;

      if (offset > 0) {
        dispatch(productActions.setOffset(0));
        return;
      }
    }

    const offsetLimit = `${search.length > 0 ? '&' : '?'}offset=${offset}&limit=${view}`;

    console.log(`${process.env.REACT_APP_BACKEND_URL}/api/product${search}${offsetLimit}`);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product${search}${offsetLimit}`, {
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

        dispatch(productActions.setCurrentProductArr(productArr));

        if (productArr.length < view) {
          setShowLoadMore(false);
        } else {
          setShowLoadMore(true);
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch, search, offset, view]);

  useEffect(() => {
    dispatch(productActions.clearSearchHandler());

    if (search.length > 0) {
      const searchArr = search.slice(1, search.length).split('&');

      searchArr.forEach((searchQuery) => {
        const [key, value] = searchQuery.split('=');
        key === 'collection_id' && dispatch(productActions.setCollectionID(+value));
        key === 'category_id' && dispatch(productActions.setCategoryID(+value));
        key === 'color_id' && dispatch(productActions.setColorID(+value));
        key === 'min_price' && dispatch(productActions.setMinPrice(+value));
        key === 'max_price' && dispatch(productActions.setMaxPrice(+value));
      });
    }

    setIsDoneStartup(true);
  }, [dispatch, search]);

  useEffect(() => {
    if (!isDoneStartup) {
      return;
    }

    let queryString = '';

    if (collectionID) {
      queryString += `${queryString.length > 0 ? '&' : '?'}collection_id=${collectionID}`;
    }

    if (categoryID) {
      queryString += `${queryString.length > 0 ? '&' : '?'}category_id=${categoryID}`;
    }

    if (colorID) {
      queryString += `${queryString.length > 0 ? '&' : '?'}color_id=${colorID}`;
    }

    if (minPrice && maxPrice) {
      queryString += `${queryString.length > 0 ? '&' : '?'}min_price=${minPrice}&max_price=${maxPrice}`;
    }

    history.replace(`/product${queryString}`);
  }, [dispatch, history, isDoneStartup, collectionID, categoryID, colorID, minPrice, maxPrice]);

  function loadMoreHandler() {
    dispatch(productActions.setOffset(offset + view));
  }

  return (
    <div className="product">
      <Nav></Nav>
      <div className="main-container">
        <div className="main">
          <p className="main__title">Our Products</p>
          <div className="main__content">
            <ProductSidebar></ProductSidebar>
            <div className="right">
              <div className="right__item-container">
                {currentProductArr.map((product) => (
                  <div key={product.id} className="item">
                    <ProductItemCard
                      id={product.id}
                      name={product.name}
                      collectionID={product.collection_id}
                      sizeIDArr={product.size_id_arr}
                      price={product.price}
                    ></ProductItemCard>
                  </div>
                ))}
              </div>
              {showLoadMore && (
                <div className="right__load-more-btn" onClick={loadMoreHandler}>
                  Show More
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Product;
