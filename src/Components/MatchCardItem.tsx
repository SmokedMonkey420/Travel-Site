import React from "react";
import "./MatchCardItem.css";
import { Link } from "react-router-dom";

interface MatchCardItemProps {
  text: string;
  image: string; // Change type to string as we're passing URL
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
                src={image} // Use the passed image URL directly
              />
            ) : (
              <p>{text}</p>
            )}
            <h3>Your preferred tourist spot</h3>
          </figure>
        </Link>
      </li>
      <li className="result__cards__item">
        <Link className="result__cards__item__link">
          <figure className="result__cards__item__pic-wrap">
            {image ? (
              <img
                className="result__cards__item__img"
                alt="Uploaded"
                src={image} // Use the passed image URL directly
              />
            ) : (
              <img
                className="result__cards__item__img"
                alt="Placeholder"
                src={placeholderImageUrl}
              />
            )}
            <h3>Our recommended tourist spot</h3>
          </figure>
        </Link>
      </li>
    </>
  );
};

export default MatchCardItem;
