import { Link } from 'react-router-dom';
import type { Star } from '../../types';
import defaultStarImage from '../../assets/base.jpeg';
import './StarCard.css';

interface StarCardProps {
  star: Star;
}

export const StarCard = ({ star }: StarCardProps) => {
  const imageSrc = star.imagePath && star.imagePath.trim() !== '' 
    ? star.imagePath 
    : defaultStarImage;

  return (
    <div className="star-card">
      <div className="star-image">
        <img src={imageSrc} alt={star.title} />
      </div>
      <div className="star-info">
        <h3 className="star-title">{star.title}</h3>
        <p className="star-description">{star.description}</p>
        <div className="star-actions">
          <Link to={`/star/${star.id}`} className="details-button">
            Подробнее
          </Link>
          <button
            className="details-button add-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Добавить в заявку
          </button>
        </div>
      </div>
    </div>
  );
};
