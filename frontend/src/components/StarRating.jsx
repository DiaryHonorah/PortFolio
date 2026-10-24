import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'text-2xl' }) => {
    const [hover, setHover] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
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
        </div>
    );
};

export default StarRating;