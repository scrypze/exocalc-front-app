import { Link } from 'react-router-dom';
import type { Star } from '../../types';
import defaultStarImage from '../../assets/base.jpeg';
import './StarCard.css';

interface StarCardProps {
  star: Star;
  onAddToSelectedStars?: (starId: number) => void;
  onRemoveFromSelectedStars?: (starId: number) => void;
  isAuthenticated?: boolean;
  showRemoveButton?: boolean;
  isAddedToSelectedStars?: boolean;
}

export const StarCard = ({ 
  star, 
  onAddToSelectedStars, 
  onRemoveFromSelectedStars, 
  isAuthenticated = false,
  showRemoveButton = false,
  isAddedToSelectedStars = false
}: StarCardProps) => {
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
        <div className="star-card-buttons">
        <Link to={`/star/${star.id}`} className="details-button">
          Подробнее
        </Link>
          {isAuthenticated && onAddToSelectedStars && !showRemoveButton && !isAddedToSelectedStars && (
            <button
              onClick={() => onAddToSelectedStars(star.id)}
              className="add-to-application-button"
            >
              В заявку
            </button>
          )}
          {isAuthenticated && isAddedToSelectedStars && !showRemoveButton && (
            <span className="star-added-indicator">В заявке</span>
          )}
          {showRemoveButton && onRemoveFromSelectedStars && (
            <button
              onClick={() => onRemoveFromSelectedStars(star.id)}
              className="remove-from-application-button"
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
