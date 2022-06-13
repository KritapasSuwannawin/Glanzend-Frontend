import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import shoppingBagIcon from '../icon/Shopping Bag Icon.svg';

import './ProductItemCard.scss';

function ProductItemCard(props) {
  const { id, name, collectionID, sizeIDArr, price } = props;

  const collectionArr = useSelector((store) => store.resource.collectionArr);
  const sizeArr = useSelector((store) => store.resource.sizeArr);

  function mapCollectionIDToName(collectionID) {
    if (collectionArr.length === 0) {
      return '';
    }

    const collection = collectionArr.find((collection) => collection.id === collectionID);
    return collection.name;
  }

  function mapSizeIDToName(sizeID) {
    if (sizeArr.length === 0) {
      return '';
    }

    const size = sizeArr.find((size) => size.id === sizeID);
    return size.name;
  }

  return (
    <div className="product-item-card">
      <div className="product-item-card__img"></div>
      <Link to={`/product?collection_id=${collectionID}`} className="product-item-card__collection">
        {mapCollectionIDToName(collectionID)}
      </Link>
      <p className="product-item-card__name">{name}</p>
      <div className="product-item-card__size-container">
        {sizeIDArr.map((sizeID, i) => (
          <p className="size" key={i}>
            {mapSizeIDToName(sizeID)}
          </p>
        ))}
      </div>
      <div className="product-item-card__price">
        <img src={shoppingBagIcon} alt="" className="product-item-card__price--icon"></img>
        <p className="product-item-card__price--amount">$ {price}</p>
      </div>
    </div>
  );
}

export default ProductItemCard;
