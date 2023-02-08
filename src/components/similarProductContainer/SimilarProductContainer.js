import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import leftArrowIcon from '../../icon/Left Arrow Icon.svg';

import './SimilarProductContainer.scss';

function SimilarProductContainer(props) {
  const { similarProductArr, title } = props;

  const navigate = useNavigate();

  const collectionArr = useSelector((store) => store.resource.collectionArr);

  function getCollectionNameFromID(id) {
    return collectionArr.find((col) => col.id === id).name;
  }

  function goBackHandler() {
    navigate('/product');
  }

  return (
    <>
      <div className="similar-product-container">
        <div className="similar-product">
          <p className="similar-product__title">{title || 'Similar Products'}</p>
          <div className="similar-product__card-container">
            {similarProductArr.map((product, i) => (
              <div className="card" key={i}>
                <Link to={`/product/${product.id}`}>
                  <img className="card__img" src={product.img_url} alt=""></img>
                </Link>
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
