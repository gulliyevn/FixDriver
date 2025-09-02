export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  route: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  earnings: number;
  clientName?: string;
}

export const scheduleItemsMock: ScheduleItem[] = [
  {
    id: '1',
    day: 'Понедельник',
    time: '08:00 - 18:00',
    route: 'Дом → Офис → Дом',
    status: 'scheduled',
    earnings: 450,
    clientName: 'Иван Петров'
  },
  {
    id: '2',
    day: 'Вторник',
    time: '08:00 - 18:00',
    route: 'Дом → Офис → Дом',
    status: 'completed',
    earnings: 420,
    clientName: 'Мария Сидорова'
  },
  {
    id: '3',
    day: 'Среда',
    time: '08:00 - 18:00',
    route: 'Дом → Офис → Дом',
    status: 'scheduled',
    earnings: 380,
    clientName: 'Алексей Козлов'
  }
]; 