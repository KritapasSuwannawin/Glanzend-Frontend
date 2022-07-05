import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import leftArrowIcon from '../icon/Left Arrow Icon.svg';

import './SimilarProductContainer.scss';

function SimilarProductContainer(props) {
  const { similarProductArr, categoryArr, getCategoryNameFromID } = props;

  const history = useHistory();

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
