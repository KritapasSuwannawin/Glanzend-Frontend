import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { productActions } from '../store/productSlice';

import './ProductSidebar.scss';

function ProductSidebar(props) {
  const dispatch = useDispatch();

  const categoryArr = useSelector((store) => store.resource.categoryArr);
  const collectionArr = useSelector((store) => store.resource.collectionArr);
  const colorArr = useSelector((store) => store.resource.colorArr);

  const collectionID = useSelector((store) => store.product.collectionID);
  const categoryID = useSelector((store) => store.product.categoryID);
  const colorID = useSelector((store) => store.product.colorID);
  const minPrice = useSelector((store) => store.product.minPrice);
  const maxPrice = useSelector((store) => store.product.maxPrice);

  const [showAllColor, setShowAllColor] = useState(false);

  function collectionClickHandler() {
    dispatch(productActions.setCollectionID(this !== collectionID ? this : undefined));
  }

  function categoryClickHandler() {
    dispatch(productActions.setCategoryID(this !== categoryID ? this : undefined));
  }

  function colorClickHandler() {
    dispatch(productActions.setColorID(this !== colorID ? this : undefined));
  }

  function priceClickHandler() {
    dispatch(productActions.setMinPrice(this.minPrice !== minPrice ? this.minPrice : undefined));
    dispatch(productActions.setMaxPrice(this.maxPrice !== maxPrice ? this.maxPrice : undefined));
  }

  function allClickHandler() {
    dispatch(productActions.clearSearchHandler());
  }

  function showAllColorHandler() {
    setShowAllColor(true);
  }

  return (
    <div className="product-sidebar">
      <div className="section">
        <p className="section__title">Collection</p>
        {collectionArr.map((col, i) => (
          <p className={`section__choice ${collectionID === col.id ? 'active' : ''}`} key={i} onClick={collectionClickHandler.bind(col.id)}>
            {col.name}
          </p>
        ))}
      </div>
      <div className="section">
        <p className="section__title">Product Type</p>
        {categoryArr.map((cat, i) => (
          <p className={`section__choice ${categoryID === cat.id ? 'active' : ''}`} key={i} onClick={categoryClickHandler.bind(cat.id)}>
            {cat.name}
          </p>
        ))}
      </div>
      <div className="section">
        <p className="section__title">Color</p>
        <div className="section__color-container">
          {colorArr.slice(0, !showAllColor ? 9 : colorArr.length).map((color, i) => (
            <div
              className={`color ${colorID === color.id ? 'active' : ''}`}
              key={i}
              style={{ backgroundColor: `${color.code}` }}
              onClick={colorClickHandler.bind(color.id)}
            ></div>
          ))}
          {!showAllColor && (
            <div className="color plus" onClick={showAllColorHandler}>
              +
            </div>
          )}
        </div>
      </div>
      <div className="section">
        <p className="section__title">Color</p>
        <div
          className={`section__choice ${minPrice === 1 ? 'active' : ''}`}
          onClick={priceClickHandler.bind({ minPrice: 1, maxPrice: 25 })}
        >
          $1 - $25
        </div>
        <div
          className={`section__choice ${minPrice === 25 ? 'active' : ''}`}
          onClick={priceClickHandler.bind({ minPrice: 25, maxPrice: 50 })}
        >
          $25 - $50
        </div>
        <div
          className={`section__choice ${minPrice === 50 ? 'active' : ''}`}
          onClick={priceClickHandler.bind({ minPrice: 50, maxPrice: 100 })}
        >
          $50 - $100
        </div>
        <div
          className={`section__choice ${minPrice === 100 ? 'active' : ''}`}
          onClick={priceClickHandler.bind({ minPrice: 100, maxPrice: 150 })}
        >
          $100 - $150
        </div>
      </div>
      <div className="section">
        <p
          className={`section__title clickable ${!collectionID && !categoryID && !colorID && !minPrice ? 'active' : ''}`}
          onClick={allClickHandler}
        >
          All
        </p>
      </div>
    </div>
  );
}

export default ProductSidebar;
