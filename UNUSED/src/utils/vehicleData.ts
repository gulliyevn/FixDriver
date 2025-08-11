export interface VehicleOption {
  label: string;
  value: string;
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

export interface VehicleModelOption {
  label: string;
  value: string;
}

// Категории автомобилей
export const vehicleCategories: VehicleOption[] = [
  { label: '🚗 База', value: 'base', icon: 'car-outline' },
  { label: '✨ Плюс', value: 'plus', icon: 'car-sport-outline' },
  { label: '👑 Премиум', value: 'premium', icon: 'diamond-outline' },
];

// Марки автомобилей по категориям
export const getVehicleBrandsByCategory = (category?: string): VehicleOption[] => {
  switch (category) {
    case 'base':
      return [
        { label: 'Lada', value: 'Lada' },
        { label: 'Chevrolet', value: 'Chevrolet' },
        { label: 'Daewoo', value: 'Daewoo' },
        { label: 'Hyundai', value: 'Hyundai' },
        { label: 'Kia', value: 'Kia' },
        { label: 'Renault', value: 'Renault' },
        { label: 'Nissan', value: 'Nissan' },
        { label: 'Ford', value: 'Ford' },
        { label: 'Volkswagen', value: 'Volkswagen' },
        { label: 'Skoda', value: 'Skoda' },
      ];
    case 'plus':
      return [
        { label: 'Toyota', value: 'Toyota' },
        { label: 'Honda', value: 'Honda' },
        { label: 'Mazda', value: 'Mazda' },
        { label: 'Subaru', value: 'Subaru' },
        { label: 'Mitsubishi', value: 'Mitsubishi' },
        { label: 'Peugeot', value: 'Peugeot' },
        { label: 'Citroen', value: 'Citroen' },
        { label: 'Opel', value: 'Opel' },
        { label: 'Volvo', value: 'Volvo' },
        { label: 'Lexus', value: 'Lexus' },
      ];
    case 'premium':
      return [
        { label: 'Mercedes-Benz', value: 'Mercedes-Benz' },
        { label: 'BMW', value: 'BMW' },
        { label: 'Audi', value: 'Audi' },
        { label: 'Porsche', value: 'Porsche' },
        { label: 'Jaguar', value: 'Jaguar' },
        { label: 'Land Rover', value: 'Land Rover' },
        { label: 'Cadillac', value: 'Cadillac' },
        { label: 'Lincoln', value: 'Lincoln' },
        { label: 'Infiniti', value: 'Infiniti' },
        { label: 'Acura', value: 'Acura' },
      ];
    default:
      return [
        { label: 'Выберите категорию сначала', value: 'select_category' },
      ];
  }
};

// Модели автомобилей по маркам
export const getVehicleModelsByBrand = (brand?: string): VehicleModelOption[] => {
  const modelsByBrand: Record<string, VehicleModelOption[]> = {
    'Toyota': [
      { label: 'Camry', value: 'Camry' },
      { label: 'Corolla', value: 'Corolla' },
      { label: 'Prius', value: 'Prius' },
      { label: 'RAV4', value: 'RAV4' },
      { label: 'Highlander', value: 'Highlander' },
      { label: 'Land Cruiser', value: 'Land Cruiser' },
      { label: 'Avalon', value: 'Avalon' },
    ],
    'Hyundai': [
      { label: 'Elantra', value: 'Elantra' },
      { label: 'Sonata', value: 'Sonata' },
      { label: 'Tucson', value: 'Tucson' },
      { label: 'Santa Fe', value: 'Santa Fe' },
      { label: 'Accent', value: 'Accent' },
      { label: 'Genesis', value: 'Genesis' },
    ],
    'Kia': [
      { label: 'Cerato', value: 'Cerato' },
      { label: 'Optima', value: 'Optima' },
      { label: 'Sportage', value: 'Sportage' },
      { label: 'Sorento', value: 'Sorento' },
      { label: 'Rio', value: 'Rio' },
      { label: 'Stinger', value: 'Stinger' },
    ],
    'Mercedes-Benz': [
      { label: 'C-Class', value: 'C-Class' },
      { label: 'E-Class', value: 'E-Class' },
      { label: 'S-Class', value: 'S-Class' },
      { label: 'GLE', value: 'GLE' },
      { label: 'GLS', value: 'GLS' },
      { label: 'A-Class', value: 'A-Class' },
      { label: 'CLS', value: 'CLS' },
    ],
    'BMW': [
      { label: '3 Series', value: '3 Series' },
      { label: '5 Series', value: '5 Series' },
      { label: '7 Series', value: '7 Series' },
      { label: 'X3', value: 'X3' },
      { label: 'X5', value: 'X5' },
      { label: 'X7', value: 'X7' },
      { label: 'i8', value: 'i8' },
    ],
    'Audi': [
      { label: 'A3', value: 'A3' },
      { label: 'A4', value: 'A4' },
      { label: 'A6', value: 'A6' },
      { label: 'A8', value: 'A8' },
      { label: 'Q3', value: 'Q3' },
      { label: 'Q5', value: 'Q5' },
      { label: 'Q7', value: 'Q7' },
    ],
    'Lada': [
      { label: 'Granta', value: 'Granta' },
      { label: 'Vesta', value: 'Vesta' },
      { label: 'XRAY', value: 'XRAY' },
      { label: 'Largus', value: 'Largus' },
      { label: 'Niva', value: 'Niva' },
      { label: 'Kalina', value: 'Kalina' },
      { label: 'Priora', value: 'Priora' },
    ],
    'Chevrolet': [
      { label: 'Aveo', value: 'Aveo' },
      { label: 'Cruze', value: 'Cruze' },
      { label: 'Malibu', value: 'Malibu' },
      { label: 'Tahoe', value: 'Tahoe' },
      { label: 'Traverse', value: 'Traverse' },
      { label: 'Equinox', value: 'Equinox' },
    ],
    'Daewoo': [
      { label: 'Matiz', value: 'Matiz' },
      { label: 'Nexia', value: 'Nexia' },
      { label: 'Lacetti', value: 'Lacetti' },
      { label: 'Gentra', value: 'Gentra' },
      { label: 'Cobalt', value: 'Cobalt' },
    ],
    'Renault': [
      { label: 'Logan', value: 'Logan' },
      { label: 'Sandero', value: 'Sandero' },
      { label: 'Duster', value: 'Duster' },
      { label: 'Captur', value: 'Captur' },
      { label: 'Koleos', value: 'Koleos' },
      { label: 'Megane', value: 'Megane' },
    ],
    'Nissan': [
      { label: 'Almera', value: 'Almera' },
      { label: 'Sentra', value: 'Sentra' },
      { label: 'Altima', value: 'Altima' },
      { label: 'Maxima', value: 'Maxima' },
      { label: 'Qashqai', value: 'Qashqai' },
      { label: 'X-Trail', value: 'X-Trail' },
      { label: 'Murano', value: 'Murano' },
    ],
    'Ford': [
      { label: 'Fiesta', value: 'Fiesta' },
      { label: 'Focus', value: 'Focus' },
      { label: 'Mondeo', value: 'Mondeo' },
      { label: 'Escape', value: 'Escape' },
      { label: 'Explorer', value: 'Explorer' },
      { label: 'Edge', value: 'Edge' },
    ],
    'Volkswagen': [
      { label: 'Polo', value: 'Polo' },
      { label: 'Golf', value: 'Golf' },
      { label: 'Passat', value: 'Passat' },
      { label: 'Tiguan', value: 'Tiguan' },
      { label: 'Touareg', value: 'Touareg' },
      { label: 'Arteon', value: 'Arteon' },
    ],
    'Skoda': [
      { label: 'Fabia', value: 'Fabia' },
      { label: 'Octavia', value: 'Octavia' },
      { label: 'Superb', value: 'Superb' },
      { label: 'Kamiq', value: 'Kamiq' },
      { label: 'Karoq', value: 'Karoq' },
      { label: 'Kodiaq', value: 'Kodiaq' },
    ],
    'Honda': [
      { label: 'Civic', value: 'Civic' },
      { label: 'Accord', value: 'Accord' },
      { label: 'CR-V', value: 'CR-V' },
      { label: 'Pilot', value: 'Pilot' },
      { label: 'HR-V', value: 'HR-V' },
      { label: 'Insight', value: 'Insight' },
    ],
    'Mazda': [
      { label: 'Mazda3', value: 'Mazda3' },
      { label: 'Mazda6', value: 'Mazda6' },
      { label: 'CX-3', value: 'CX-3' },
      { label: 'CX-5', value: 'CX-5' },
      { label: 'CX-9', value: 'CX-9' },
      { label: 'MX-5', value: 'MX-5' },
    ],
    'Subaru': [
      { label: 'Impreza', value: 'Impreza' },
      { label: 'Legacy', value: 'Legacy' },
      { label: 'Forester', value: 'Forester' },
      { label: 'Outback', value: 'Outback' },
      { label: 'Crosstrek', value: 'Crosstrek' },
      { label: 'Ascent', value: 'Ascent' },
    ],
    'Mitsubishi': [
      { label: 'Lancer', value: 'Lancer' },
      { label: 'Outlander', value: 'Outlander' },
      { label: 'Eclipse Cross', value: 'Eclipse Cross' },
      { label: 'ASX', value: 'ASX' },
      { label: 'Pajero', value: 'Pajero' },
    ],
    'Peugeot': [
      { label: '208', value: '208' },
      { label: '308', value: '308' },
      { label: '508', value: '508' },
      { label: '2008', value: '2008' },
      { label: '3008', value: '3008' },
      { label: '5008', value: '5008' },
    ],
    'Citroen': [
      { label: 'C3', value: 'C3' },
      { label: 'C4', value: 'C4' },
      { label: 'C5', value: 'C5' },
      { label: 'C3 Aircross', value: 'C3 Aircross' },
      { label: 'C5 Aircross', value: 'C5 Aircross' },
    ],
    'Opel': [
      { label: 'Corsa', value: 'Corsa' },
      { label: 'Astra', value: 'Astra' },
      { label: 'Insignia', value: 'Insignia' },
      { label: 'Mokka', value: 'Mokka' },
      { label: 'Crossland', value: 'Crossland' },
      { label: 'Grandland', value: 'Grandland' },
    ],
    'Volvo': [
      { label: 'S60', value: 'S60' },
      { label: 'S90', value: 'S90' },
      { label: 'V60', value: 'V60' },
      { label: 'V90', value: 'V90' },
      { label: 'XC40', value: 'XC40' },
      { label: 'XC60', value: 'XC60' },
      { label: 'XC90', value: 'XC90' },
    ],
    'Lexus': [
      { label: 'IS', value: 'IS' },
      { label: 'ES', value: 'ES' },
      { label: 'GS', value: 'GS' },
      { label: 'LS', value: 'LS' },
      { label: 'NX', value: 'NX' },
      { label: 'RX', value: 'RX' },
      { label: 'GX', value: 'GX' },
      { label: 'LX', value: 'LX' },
    ],
    'Porsche': [
      { label: '911', value: '911' },
      { label: 'Cayman', value: 'Cayman' },
      { label: 'Boxster', value: 'Boxster' },
      { label: 'Cayenne', value: 'Cayenne' },
      { label: 'Macan', value: 'Macan' },
      { label: 'Panamera', value: 'Panamera' },
    ],
    'Jaguar': [
      { label: 'XE', value: 'XE' },
      { label: 'XF', value: 'XF' },
      { label: 'XJ', value: 'XJ' },
      { label: 'F-Pace', value: 'F-Pace' },
      { label: 'E-Pace', value: 'E-Pace' },
      { label: 'I-Pace', value: 'I-Pace' },
    ],
    'Land Rover': [
      { label: 'Range Rover Evoque', value: 'Range Rover Evoque' },
      { label: 'Range Rover Velar', value: 'Range Rover Velar' },
      { label: 'Range Rover Sport', value: 'Range Rover Sport' },
      { label: 'Range Rover', value: 'Range Rover' },
      { label: 'Discovery', value: 'Discovery' },
      { label: 'Defender', value: 'Defender' },
    ],
    'Cadillac': [
      { label: 'ATS', value: 'ATS' },
      { label: 'CTS', value: 'CTS' },
      { label: 'CT6', value: 'CT6' },
      { label: 'XT4', value: 'XT4' },
      { label: 'XT5', value: 'XT5' },
      { label: 'XT6', value: 'XT6' },
      { label: 'Escalade', value: 'Escalade' },
    ],
    'Lincoln': [
      { label: 'MKZ', value: 'MKZ' },
      { label: 'Continental', value: 'Continental' },
      { label: 'Corsair', value: 'Corsair' },
      { label: 'Aviator', value: 'Aviator' },
      { label: 'Navigator', value: 'Navigator' },
    ],
    'Infiniti': [
      { label: 'Q50', value: 'Q50' },
      { label: 'Q60', value: 'Q60' },
      { label: 'Q70', value: 'Q70' },
      { label: 'QX30', value: 'QX30' },
      { label: 'QX50', value: 'QX50' },
      { label: 'QX60', value: 'QX60' },
      { label: 'QX80', value: 'QX80' },
    ],
    'Acura': [
      { label: 'ILX', value: 'ILX' },
      { label: 'TLX', value: 'TLX' },
      { label: 'RLX', value: 'RLX' },
      { label: 'CDX', value: 'CDX' },
      { label: 'RDX', value: 'RDX' },
      { label: 'MDX', value: 'MDX' },
      { label: 'NSX', value: 'NSX' },
    ],
  };

  return modelsByBrand[brand || ''] || [];
};

// Годы автомобилей
export const getVehicleYearOptions = (): VehicleOption[] => {
  const options: VehicleOption[] = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1990; year--) {
    options.push({
      label: year.toString(),
      value: year.toString(),
    });
  }
  return options;
}; 