import React from "react";
import "./MatchCardItem.css";
import { Link } from "react-router-dom";
interface MatchCardItemProps {
  text: string;
  image: string;
}
const MatchCardItem: React.FC<MatchCardItemProps> = ({ text, image }) => {
  const placeholderImageUrl = "images/image2.jpg";
  return (
    <>
      <li className="search__cards__item">
        <Link className="search__cards__item__link">
          <figure className="search__cards__item__pic-wrap">
            {image ? (
              <img
                className="search__cards__item__img"
                alt="Uploaded"
                src={image}
              />
            ) : (
              <p className="text__card__item">{text}</p>
            )}
          </figure>
          <div className="search__cards__item__text">
            <h3>Your preferred tourist spot</h3>
          </div>
        </Link>
      </li>
      <li className="result__cards__item">
        <Link className="result__cards__item__link">
          <figure className="result__cards__item__pic-wrap">
            <img
              className="result__cards__item__img"
              alt="Placeholder"
              src={placeholderImageUrl}
            />
          </figure>
          <div className="result__cards__item__text">
            <h3>Our best match tourist spot</h3>
          </div>
        </Link>
      </li>
    </>
  );
};

export default MatchCardItem;
