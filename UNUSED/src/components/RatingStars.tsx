import React from 'react';
import { View, Text } from 'react-native';
import { RatingStarsStyles } from '../styles/components/RatingStars.styles';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  size = 16, 
  showNumber = false 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];

    // Полные звезды
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={`full-${i}`} style={[RatingStarsStyles.star, { fontSize: size }]}>
          ⭐
        </Text>
      );
    }

    // Половина звезды
    if (hasHalfStar) {
      stars.push(
        <Text key="half" style={[RatingStarsStyles.star, { fontSize: size }]}>
          ⭐
        </Text>
      );
    }

    // Пустые звезды
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} style={[RatingStarsStyles.star, RatingStarsStyles.emptyStar, { fontSize: size }]}>
          ⭐
        </Text>
      );
    }

    return stars;
  };

  return (
    <View style={RatingStarsStyles.container}>
      <View style={RatingStarsStyles.starsContainer}>
        {renderStars()}
      </View>
      {showNumber && (
        <Text style={RatingStarsStyles.ratingText}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

export default RatingStars;
