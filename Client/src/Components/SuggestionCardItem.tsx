import React from "react";
import { Link } from "react-router-dom";
import "./SuggestionCardItem.css";

function SuggestionCardItem(props) {
  return (
    <>
      <li className="suggestion__cards__item">
        <Link className="suggestion__cards__item__link" to={props.path}>
          <figure className="suggestion__cards__item__pic-wrap">
            <img
              className="suggestion__cards__item__img"
              alt="Travel Image"
              src={props.src}
            />
          </figure>
          <div className="suggestion__cards__item__info">
            <h1 className="suggestion__cards__item__name">{props.name}</h1>
            <p className="suggestion__cards__item__description">
              {props.description}
            </p>
          </div>
        </Link>
      </li>
    </>
  );
}

export default SuggestionCardItem;
