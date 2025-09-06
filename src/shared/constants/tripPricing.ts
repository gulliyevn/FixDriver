// Constants for calculating driver trip costs
export const TRIP_PRICING = {
  // Base trip cost (in AFc)
  BASE_PRICE: 8,
  
  // Additional cost per kilometer
  PRICE_PER_KM: 1.5,
  
  // Additional cost per minute
  PRICE_PER_MINUTE: 0.2,
  
  // Minimum trip cost
  MIN_PRICE: 5,
  
  // Maximum trip cost (excluding VIP)
  MAX_PRICE: 25,
  
  // Multipliers for different driver levels
  LEVEL_MULTIPLIERS: {
    1: 1.0,    // Starter - base rate
    2: 1.1,    // Ambitious - +10%
    3: 1.2,    // Reliable - +20%
    4: 1.3,    // Champion - +30%
    5: 1.4,    // Superstar - +40%
    6: 1.5,    // Emperor - +50%
    7: 2.0,    // VIP - +100%
  },
  
  // Rating bonuses
  RATING_BONUSES: {
    4.5: 0.05,  // +5% for rating 4.5+
    4.7: 0.10,  // +10% for rating 4.7+
    4.9: 0.15,  // +15% for rating 4.9+
    5.0: 0.20,  // +20% for rating 5.0
  },
  
  // Time-based bonuses
  TIME_BONUSES: {
    PEAK_HOURS: 0.15,    // +15% during peak hours (7-9, 17-19)
    NIGHT_HOURS: 0.25,   // +25% at night (22-6)
    WEEKEND: 0.10,       // +10% on weekends
  }
};

// Function for calculating trip cost
export const calculateTripPrice = (params: {
  distance: number;        // distance in km
  duration: number;        // time in minutes
  driverLevel: number;     // driver level
  rating: number;          // driver rating
  isPeakHours?: boolean;   // peak hours
  isNightHours?: boolean;  // night hours
  isWeekend?: boolean;     // weekend
}): number => {
  const { distance, duration, driverLevel, rating, isPeakHours, isNightHours, isWeekend } = params;
  
  // Base cost
  let basePrice = TRIP_PRICING.BASE_PRICE;
  basePrice += distance * TRIP_PRICING.PRICE_PER_KM;
  basePrice += duration * TRIP_PRICING.PRICE_PER_MINUTE;
  
  // Apply level multiplier
  const levelMultiplier = TRIP_PRICING.LEVEL_MULTIPLIERS[driverLevel as keyof typeof TRIP_PRICING.LEVEL_MULTIPLIERS] || 1.0;
  let finalPrice = basePrice * levelMultiplier;
  
  // Apply rating bonus
  if (rating >= 5.0) {
    finalPrice *= (1 + TRIP_PRICING.RATING_BONUSES[5.0]);
  } else if (rating >= 4.9) {
    finalPrice *= (1 + TRIP_PRICING.RATING_BONUSES[4.9]);
  } else if (rating >= 4.7) {
    finalPrice *= (1 + TRIP_PRICING.RATING_BONUSES[4.7]);
  } else if (rating >= 4.5) {
    finalPrice *= (1 + TRIP_PRICING.RATING_BONUSES[4.5]);
  }
  
  // Apply time-based bonuses
  if (isPeakHours) {
    finalPrice *= (1 + TRIP_PRICING.TIME_BONUSES.PEAK_HOURS);
  }
  if (isNightHours) {
    finalPrice *= (1 + TRIP_PRICING.TIME_BONUSES.NIGHT_HOURS);
  }
  if (isWeekend) {
    finalPrice *= (1 + TRIP_PRICING.TIME_BONUSES.WEEKEND);
  }
  
  // Limit minimum and maximum cost
  finalPrice = Math.max(TRIP_PRICING.MIN_PRICE, finalPrice);
  finalPrice = Math.min(TRIP_PRICING.MAX_PRICE, finalPrice);
  
  // Return integer part of price
  return Math.floor(finalPrice);
};

// Function for generating random trip (for testing)
export const generateRandomTrip = (driverLevel: number, rating: number = 4.8): {
  distance: number;
  duration: number;
  price: number;
  isPeakHours: boolean;
  isNightHours: boolean;
  isWeekend: boolean;
} => {
  // Random distance from 2 to 15 km
  const distance = Math.random() * 13 + 2;
  
  // Random time from 10 to 45 minutes
  const duration = Math.random() * 35 + 10;
  
  // Random time of day
  const hour = Math.floor(Math.random() * 24);
  const isPeakHours = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  const isNightHours = hour >= 22 || hour <= 6;
  
  // Random day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = Math.floor(Math.random() * 7);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const price = calculateTripPrice({
    distance,
    duration,
    driverLevel,
    rating,
    isPeakHours,
    isNightHours,
    isWeekend,
  });
  
  return {
    distance: Math.round(distance * 10) / 10,
    duration: Math.round(duration),
    price: Math.floor(price), // Show only integer part of price
    isPeakHours,
    isNightHours,
    isWeekend,
  };
};
