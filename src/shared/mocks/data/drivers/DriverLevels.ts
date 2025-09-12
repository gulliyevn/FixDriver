/**
 * Driver Levels and Rankings
 * Mock data for driver level system
 */

export interface DriverLevel {
  id: string;
  name: string;
  level: string;
  rides: number;
  earnings: number;
  position: number;
  avatar: string | null;
}

export const DRIVER_LEVELS: DriverLevel[] = [
  {
    id: '1',
    name: 'Alexey Petrov',
    level: 'VIP 8',
    rides: 45,
    earnings: 1250,
    position: 1,
    avatar: null
  },
  {
    id: '2',
    name: 'Maria Ivanova',
    level: 'VIP 6',
    rides: 42,
    earnings: 1180,
    position: 2,
    avatar: null
  },
  {
    id: '3',
    name: 'Dmitry Sidorov',
    level: 'VIP 5',
    rides: 38,
    earnings: 1050,
    position: 3,
    avatar: null
  },
  {
    id: '4',
    name: 'Anna Kozlova',
    level: 'VIP 3',
    rides: 35,
    earnings: 980,
    position: 4,
    avatar: null
  },
  {
    id: '5',
    name: 'Sergey Novikov',
    level: 'VIP 2',
    rides: 32,
    earnings: 890,
    position: 5,
    avatar: null
  },
  {
    id: '6',
    name: 'Elena Morozova',
    level: 'VIP 1',
    rides: 28,
    earnings: 750,
    position: 6,
    avatar: null
  },
  {
    id: '7',
    name: 'Andrey Volkov',
    level: 'Emperor',
    rides: 25,
    earnings: 680,
    position: 7,
    avatar: null
  },
  {
    id: '8',
    name: 'Olga Lebedeva',
    level: 'Superstar',
    rides: 22,
    earnings: 620,
    position: 8,
    avatar: null
  },
  {
    id: '9',
    name: 'Igor Sokolov',
    level: 'Champion',
    rides: 20,
    earnings: 580,
    position: 9,
    avatar: null
  },
  {
    id: '10',
    name: 'Natalya Romanova',
    level: 'Reliable',
    rides: 18,
    earnings: 520,
    position: 10,
    avatar: null
  }
];

export const getDriverLevelById = (id: string): DriverLevel | undefined => {
  return DRIVER_LEVELS.find(level => level.id === id);
};

export const getDriverLevelsByPosition = (startPosition: number, endPosition: number): DriverLevel[] => {
  return DRIVER_LEVELS.filter(level => 
    level.position >= startPosition && level.position <= endPosition
  );
};

export const getTopDriverLevels = (limit: number = 5): DriverLevel[] => {
  return DRIVER_LEVELS.slice(0, limit);
};
