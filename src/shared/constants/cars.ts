// Centralized car-related constants used in driver registration

export type CarBrandOption = { label: string; value: string };
export type CarModelOption = { label: string; value: string; tariff?: string };

export const carBrands: CarBrandOption[] = [
  { label: 'Mercedes', value: 'Mercedes' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'BMW', value: 'BMW' },
  { label: 'Hyundai', value: 'Hyundai' },
];

export const carModelsByBrand: Record<string, CarModelOption[]> = {
  Mercedes: [
    { label: 'E-class', value: 'E-class', tariff: 'Standard' },
    { label: 'S-class', value: 'S-class', tariff: 'Business' },
    { label: 'C-class', value: 'C-class', tariff: 'Economy' },
    { label: 'GLS', value: 'GLS', tariff: 'Premium' },
  ],
  Toyota: [
    { label: 'Camry', value: 'Camry', tariff: 'Standard' },
    { label: 'Corolla', value: 'Corolla', tariff: 'Economy' },
    { label: 'Avalon', value: 'Avalon', tariff: 'Premium' },
    { label: 'Land Cruiser', value: 'Land Cruiser', tariff: 'Business' },
  ],
  BMW: [
    { label: '5 Series', value: '5 Series', tariff: 'Standard' },
    { label: '7 Series', value: '7 Series', tariff: 'Business' },
    { label: '3 Series', value: '3 Series', tariff: 'Economy' },
    { label: '8 Series', value: '8 Series', tariff: 'Premium' },
  ],
  Hyundai: [
    { label: 'Sonata', value: 'Sonata', tariff: 'Economy' },
    { label: 'Genesis', value: 'Genesis', tariff: 'Premium' },
    { label: 'Elantra', value: 'Elantra', tariff: 'Standard' },
    { label: 'Equus', value: 'Equus', tariff: 'Business' },
  ],
};

// Generate year options from currentYear+1 down to 1990
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions: { label: string; value: string }[] = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    yearOptions.push({ label: String(year), value: String(year) });
  }
  return yearOptions;
};


