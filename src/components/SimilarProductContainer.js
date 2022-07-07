import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { resourceActions } from '../store/resourceSlice';

import leftArrowIcon from '../icon/Left Arrow Icon.svg';

import './SimilarProductContainer.scss';

function SimilarProductContainer(props) {
  const { similarProductArr } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const collectionArr = useSelector((store) => store.resource.collectionArr);

  useEffect(() => {
    if (collectionArr.length === 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/home-startup`, {
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

          const { categoryArr, collectionArr } = data;
          dispatch(resourceActions.setCategoryArr(categoryArr));
          dispatch(resourceActions.setCollectionArr(collectionArr));
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, collectionArr]);

  function getCollectionNameFromID(id) {
    return collectionArr.find((col) => col.id === id).name;
  }

  function goBackHandler() {
    history.push('/product');
  }

  return (
    <>
      <div className="similar-product-container">
        <div className="similar-product">
          <p className="similar-product__title">Similar Products</p>
          <div className="similar-product__card-container">
            {similarProductArr.map((product, i) => (
              <div className="card" key={i}>
                <Link to={`/product/${product.id}`} className="card__img"></Link>
                {collectionArr.length > 0 && (
                  <Link to={`/product?collection_id=${product.collection_id}`} className="card__collection">
                    {getCollectionNameFromID(product.collection_id)}
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
      <div className="continue-shopping-container">
        <div className="continue-shopping">
          <img src={leftArrowIcon} alt="" className="continue-shopping__arrow" onClick={goBackHandler}></img>
          <p className="continue-shopping__text" onClick={goBackHandler}>
            Continue Shopping
          </p>
        </div>
      </div>
    </>
  );
}

export default SimilarProductContainer;
