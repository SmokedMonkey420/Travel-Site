import { Link } from "react-router-dom";

const RecommendationCard = ({ src, name, description, path }) => {
  return (
    <li className="suggestion__card__item">
      <div className="suggestion__card__image">
        <img src={src} alt={name} />
      </div>
      <div className="suggestion__card__info">
        <h5 className="suggestion__card__name">{name}</h5>
        <p className="suggestion__card__description">{description}</p>
        <Link to={path} className="suggestion__card__link">
          Learn more
        </Link>
      </div>
    </li>
  );
};

export default RecommendationCard;
