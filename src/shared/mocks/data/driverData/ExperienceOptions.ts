/**
 * Experience Options for Drivers
 * Mock data for driver experience selection
 */

import { ExperienceOption } from '../../../../types/driver/driver';

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { label: 'Under 1 year', value: '0-1', years: 0.5, description: 'Beginner driver' },
  { label: '1 year', value: '1', years: 1, description: '1 year experience' },
  { label: '2 years', value: '2', years: 2, description: '2 years experience' },
  { label: '3 years', value: '3', years: 3, description: '3 years experience' },
  { label: '4 years', value: '4', years: 4, description: '4 years experience' },
  { label: '5 years', value: '5', years: 5, description: '5 years experience' },
  { label: '6 years', value: '6', years: 6, description: '6 years experience' },
  { label: '7 years', value: '7', years: 7, description: '7 years experience' },
  { label: '8 years', value: '8', years: 8, description: '8 years experience' },
  { label: '9 years', value: '9', years: 9, description: '9 years experience' },
  { label: '10 years', value: '10', years: 10, description: '10 years experience' },
  { label: '11 years', value: '11', years: 11, description: '11 years experience' },
  { label: '12 years', value: '12', years: 12, description: '12 years experience' },
  { label: '13 years', value: '13', years: 13, description: '13 years experience' },
  { label: '14 years', value: '14', years: 14, description: '14 years experience' },
  { label: '15 years', value: '15', years: 15, description: '15 years experience' },
  { label: '16 years', value: '16', years: 16, description: '16 years experience' },
  { label: '17 years', value: '17', years: 17, description: '17 years experience' },
  { label: '18 years', value: '18', years: 18, description: '18 years experience' },
  { label: '19 years', value: '19', years: 19, description: '19 years experience' },
  { label: '20 years', value: '20', years: 20, description: '20 years experience' },
  { label: '21 years', value: '21', years: 21, description: '21 years experience' },
  { label: '22 years', value: '22', years: 22, description: '22 years experience' },
  { label: '23 years', value: '23', years: 23, description: '23 years experience' },
  { label: '24 years', value: '24', years: 24, description: '24 years experience' },
  { label: '25 years', value: '25', years: 25, description: '25 years experience' },
  { label: '26 years', value: '26', years: 26, description: '26 years experience' },
  { label: '27 years', value: '27', years: 27, description: '27 years experience' },
  { label: '28 years', value: '28', years: 28, description: '28 years experience' },
  { label: '29 years', value: '29', years: 29, description: '29 years experience' },
  { label: '30 years', value: '30', years: 30, description: '30 years experience' },
  { label: '30+ years', value: '30+', years: 30, description: 'Over 30 years experience' }
];

export const getExperienceOptionByValue = (value: string): ExperienceOption | undefined => {
  return EXPERIENCE_OPTIONS.find(option => option.value === value);
};

export const getExperienceOptionsByYears = (minYears: number, maxYears: number): ExperienceOption[] => {
  return EXPERIENCE_OPTIONS.filter(option => 
    option.years >= minYears && option.years <= maxYears
  );
};
