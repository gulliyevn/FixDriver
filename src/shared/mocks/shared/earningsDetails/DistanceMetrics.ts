/**
 * 📏 DISTANCE METRICS MOCK DATA
 * 
 * Mock data for distance and performance metrics.
 * Clean implementation with English comments and data.
 */

export interface DistanceMetricItem {
  metric: string;
  value: string;
  icon: string;
  description?: string;
}

export const mockDistanceMetrics: DistanceMetricItem[] = [
  {
    metric: 'Total Distance',
    value: '1,247 km',
    icon: '📏',
    description: 'Total distance driven this month'
  },
  {
    metric: 'Average Trip Distance',
    value: '5.8 km',
    icon: '📐',
    description: 'Average distance per trip'
  },
  {
    metric: 'Longest Trip',
    value: '23.4 km',
    icon: '🏁',
    description: 'Longest single trip this month'
  },
  {
    metric: 'Shortest Trip',
    value: '0.8 km',
    icon: '📍',
    description: 'Shortest single trip this month'
  },
  {
    metric: 'Fuel Efficiency',
    value: '8.2 L/100km',
    icon: '⛽',
    description: 'Average fuel consumption'
  },
  {
    metric: 'Carbon Footprint',
    value: '156 kg CO₂',
    icon: '🌱',
    description: 'Total emissions this month'
  }
];

/**
 * Get distance metrics by category
 */
export const getDistanceMetricsByCategory = (category: string): DistanceMetricItem[] => {
  return mockDistanceMetrics.filter(metric => 
    metric.metric.toLowerCase().includes(category.toLowerCase())
  );
};

/**
 * Get metric by name
 */
export const getMetricByName = (name: string): DistanceMetricItem | undefined => {
  return mockDistanceMetrics.find(metric => metric.metric === name);
};

/**
 * Get all metrics with descriptions
 */
export const getAllMetricsWithDescriptions = (): DistanceMetricItem[] => {
  return mockDistanceMetrics.filter(metric => metric.description);
};

/**
 * Format metric value for display
 */
export const formatMetricValue = (metric: DistanceMetricItem): string => {
  return `${metric.value} (${metric.description})`;
};
