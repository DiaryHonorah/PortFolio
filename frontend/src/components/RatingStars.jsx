import React, { useState } from 'react';

const RatingStars = ({ 
    rating = 0, 
    onRate = null, 
    readonly = false, 
    size = 'text-2xl',
    showValue = false 
}) => {
    const [hover, setHover] = useState(0);

    const handleClick = (e, value) => {
        // Empêcher la soumission du formulaire
        e.preventDefault();
        e.stopPropagation();
        
        if (!readonly && onRate) {
            onRate(value);
        }
    };

    const handleMouseEnter = (e, star) => {
        e.preventDefault();
        if (!readonly) setHover(star);
    };

    const handleMouseLeave = (e) => {
        e.preventDefault();
        if (!readonly) setHover(0);
    };

    return (
        <div className="flex items-center gap-0.5" onClick={(e) => e.preventDefault()}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={(e) => handleClick(e, star)}
                    onMouseEnter={(e) => handleMouseEnter(e, star)}
                    onMouseLeave={handleMouseLeave}
                    disabled={readonly}
                    className={`${size} transition ${
                        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                    }`}
                    aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                >
                    <span className={
                        star <= (hover || rating) 
                            ? 'text-yellow-400' 
                            : 'text-gray-600'
                    }>
                        ★
                    </span>
                </button>
            ))}
            {showValue && rating > 0 && (
                <span className="text-gray-400 text-sm ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default RatingStars;