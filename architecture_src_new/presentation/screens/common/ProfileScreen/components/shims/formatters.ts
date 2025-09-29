export const formatBalance = (value: number): string => {
  try {
    return new Intl.NumberFormat('ru-RU').format(value);
  } catch {
    return String(value);
  }
};


