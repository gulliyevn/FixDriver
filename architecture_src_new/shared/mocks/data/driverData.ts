import { 
  ExperienceOption, 
  CarBrand, 
  CarModel, 
  TariffOption, 
  YearOption, 
  DriverDataService,
  CarCategory,
  TariffType,
  PriceRange
} from '../types/driver';

/**
 * Driver data service implementation
 * Provides comprehensive and up-to-date car and driver information
 */
export class DriverDataHelper implements DriverDataService {
  private readonly EXPERIENCE_OPTIONS: ExperienceOption[] = [
    { label: 'До 1 года', value: '0-1', years: 0.5, description: 'Начинающий водитель' },
    { label: '1 год', value: '1', years: 1, description: '1 год опыта' },
    { label: '2 года', value: '2', years: 2, description: '2 года опыта' },
    { label: '3 года', value: '3', years: 3, description: '3 года опыта' },
    { label: '4 года', value: '4', years: 4, description: '4 года опыта' },
    { label: '5 лет', value: '5', years: 5, description: '5 лет опыта' },
    { label: '6 лет', value: '6', years: 6, description: '6 лет опыта' },
    { label: '7 лет', value: '7', years: 7, description: '7 лет опыта' },
    { label: '8 лет', value: '8', years: 8, description: '8 лет опыта' },
    { label: '9 лет', value: '9', years: 9, description: '9 лет опыта' },
    { label: '10 лет', value: '10', years: 10, description: '10 лет опыта' },
    { label: '11 лет', value: '11', years: 11, description: '11 лет опыта' },
    { label: '12 лет', value: '12', years: 12, description: '12 лет опыта' },
    { label: '13 лет', value: '13', years: 13, description: '13 лет опыта' },
    { label: '14 лет', value: '14', years: 14, description: '14 лет опыта' },
    { label: '15 лет', value: '15', years: 15, description: '15 лет опыта' },
    { label: '16 лет', value: '16', years: 16, description: '16 лет опыта' },
    { label: '17 лет', value: '17', years: 17, description: '17 лет опыта' },
    { label: '18 лет', value: '18', years: 18, description: '18 лет опыта' },
    { label: '19 лет', value: '19', years: 19, description: '19 лет опыта' },
    { label: '20 лет', value: '20', years: 20, description: '20 лет опыта' },
    { label: '21 год', value: '21', years: 21, description: '21 год опыта' },
    { label: '22 года', value: '22', years: 22, description: '22 года опыта' },
    { label: '23 года', value: '23', years: 23, description: '23 года опыта' },
    { label: '24 года', value: '24', years: 24, description: '24 года опыта' },
    { label: '25 лет', value: '25', years: 25, description: '25 лет опыта' },
    { label: '26 лет', value: '26', years: 26, description: '26 лет опыта' },
    { label: '27 лет', value: '27', years: 27, description: '27 лет опыта' },
    { label: '28 лет', value: '28', years: 28, description: '28 лет опыта' },
    { label: '29 лет', value: '29', years: 29, description: '29 лет опыта' },
    { label: '30 лет', value: '30', years: 30, description: '30 лет опыта' },
    { label: '30+ лет', value: '30+', years: 30, description: 'Более 30 лет опыта' }
  ];

  private readonly CAR_BRANDS: CarBrand[] = [
    {
      label: 'Mercedes-Benz',
      value: 'Mercedes',
      country: 'Germany',
      category: CarCategory.LUXURY,
      popularModels: ['E-Class', 'S-Class', 'C-Class', 'GLE', 'GLS']
    },
    {
      label: 'BMW',
      value: 'BMW',
      country: 'Germany',
      category: CarCategory.LUXURY,
      popularModels: ['5 Series', '7 Series', '3 Series', 'X5', 'X7']
    },
    {
      label: 'Audi',
      value: 'Audi',
      country: 'Germany',
      category: CarCategory.LUXURY,
      popularModels: ['A6', 'A8', 'A4', 'Q7', 'Q8']
    },
    {
      label: 'Toyota',
      value: 'Toyota',
      country: 'Japan',
      category: CarCategory.SEDAN,
      popularModels: ['Camry', 'Corolla', 'Avalon', 'RAV4', 'Highlander']
    },
    {
      label: 'Honda',
      value: 'Honda',
      country: 'Japan',
      category: CarCategory.SEDAN,
      popularModels: ['Accord', 'Civic', 'Insight', 'CR-V', 'Pilot']
    },
    {
      label: 'Nissan',
      value: 'Nissan',
      country: 'Japan',
      category: CarCategory.SEDAN,
      popularModels: ['Altima', 'Maxima', 'Sentra', 'Rogue', 'Murano']
    },
    {
      label: 'Hyundai',
      value: 'Hyundai',
      country: 'South Korea',
      category: CarCategory.SEDAN,
      popularModels: ['Sonata', 'Elantra', 'Accent', 'Tucson', 'Santa Fe']
    },
    {
      label: 'Kia',
      value: 'Kia',
      country: 'South Korea',
      category: CarCategory.SEDAN,
      popularModels: ['K5', 'Forte', 'Rio', 'Sportage', 'Telluride']
    },
    {
      label: 'Volkswagen',
      value: 'Volkswagen',
      country: 'Germany',
      category: CarCategory.SEDAN,
      popularModels: ['Passat', 'Jetta', 'Golf', 'Tiguan', 'Atlas']
    },
    {
      label: 'Ford',
      value: 'Ford',
      country: 'USA',
      category: CarCategory.SEDAN,
      popularModels: ['Fusion', 'Focus', 'Mustang', 'Escape', 'Explorer']
    },
    {
      label: 'Chevrolet',
      value: 'Chevrolet',
      country: 'USA',
      category: CarCategory.SEDAN,
      popularModels: ['Malibu', 'Cruze', 'Camaro', 'Equinox', 'Traverse']
    },
    {
      label: 'Tesla',
      value: 'Tesla',
      country: 'USA',
      category: CarCategory.ELECTRIC,
      popularModels: ['Model 3', 'Model S', 'Model X', 'Model Y']
    },
    {
      label: 'Lexus',
      value: 'Lexus',
      country: 'Japan',
      category: CarCategory.LUXURY,
      popularModels: ['ES', 'LS', 'IS', 'RX', 'GX']
    },
    {
      label: 'Infiniti',
      value: 'Infiniti',
      country: 'Japan',
      category: CarCategory.LUXURY,
      popularModels: ['Q50', 'Q70', 'Q60', 'QX50', 'QX80']
    },
    {
      label: 'Acura',
      value: 'Acura',
      country: 'Japan',
      category: CarCategory.LUXURY,
      popularModels: ['TLX', 'RLX', 'ILX', 'RDX', 'MDX']
    },
    {
      label: 'Genesis',
      value: 'Genesis',
      country: 'South Korea',
      category: CarCategory.LUXURY,
      popularModels: ['G80', 'G90', 'G70', 'GV80', 'GV70']
    },
    {
      label: 'Volvo',
      value: 'Volvo',
      country: 'Sweden',
      category: CarCategory.LUXURY,
      popularModels: ['S90', 'S60', 'V90', 'XC90', 'XC60']
    },
    {
      label: 'Jaguar',
      value: 'Jaguar',
      country: 'UK',
      category: CarCategory.LUXURY,
      popularModels: ['XF', 'XJ', 'XE', 'F-Pace', 'I-Pace']
    },
    {
      label: 'Land Rover',
      value: 'Land Rover',
      country: 'UK',
      category: CarCategory.LUXURY,
      popularModels: ['Range Rover', 'Discovery', 'Defender', 'Evoque', 'Velar']
    },
    {
      label: 'Porsche',
      value: 'Porsche',
      country: 'Germany',
      category: CarCategory.SPORTS,
      popularModels: ['911', 'Cayman', 'Boxster', 'Cayenne', 'Macan']
    },
    {
      label: 'Ferrari',
      value: 'Ferrari',
      country: 'Italy',
      category: CarCategory.SPORTS,
      popularModels: ['F8', '812', 'SF90', 'Roma', 'Portofino']
    },
    {
      label: 'Lamborghini',
      value: 'Lamborghini',
      country: 'Italy',
      category: CarCategory.SPORTS,
      popularModels: ['Huracan', 'Aventador', 'Urus', 'Revuelto']
    },
    {
      label: 'McLaren',
      value: 'McLaren',
      country: 'UK',
      category: CarCategory.SPORTS,
      popularModels: ['720S', '765LT', 'Artura', 'GT', 'Senna']
    }
  ];

  private readonly CAR_MODELS: CarModel[] = [
    // Mercedes-Benz
    {
      label: 'E-Class',
      value: 'E-Class',
      brand: 'Mercedes',
      yearFrom: 2016,
      category: CarCategory.LUXURY,
      tariff: TariffType.PREMIUM,
      features: ['Luxury sedan', 'Advanced safety', 'Premium interior'],
      priceRange: PriceRange.HIGH
    },
    {
      label: 'S-Class',
      value: 'S-Class',
      brand: 'Mercedes',
      yearFrom: 2014,
      category: CarCategory.LUXURY,
      tariff: TariffType.LUXURY,
      features: ['Flagship luxury', 'Executive comfort', 'Cutting-edge tech'],
      priceRange: PriceRange.PREMIUM
    },
    {
      label: 'C-Class',
      value: 'C-Class',
      brand: 'Mercedes',
      yearFrom: 2015,
      category: CarCategory.LUXURY,
      tariff: TariffType.PLUS,
      features: ['Compact luxury', 'Sporty handling', 'Premium features'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'GLE',
      value: 'GLE',
      brand: 'Mercedes',
      yearFrom: 2015,
      category: CarCategory.SUV,
      tariff: TariffType.PREMIUM,
      features: ['Luxury SUV', 'Spacious interior', 'Off-road capability'],
      priceRange: PriceRange.HIGH
    },
    {
      label: 'GLS',
      value: 'GLS',
      brand: 'Mercedes',
      yearFrom: 2016,
      category: CarCategory.SUV,
      tariff: TariffType.LUXURY,
      features: ['Full-size luxury SUV', '7-seater', 'Premium comfort'],
      priceRange: PriceRange.PREMIUM
    },

    // BMW
    {
      label: '5 Series',
      value: '5 Series',
      brand: 'BMW',
      yearFrom: 2017,
      category: CarCategory.LUXURY,
      tariff: TariffType.PREMIUM,
      features: ['Executive sedan', 'Sporty driving', 'Luxury comfort'],
      priceRange: PriceRange.HIGH
    },
    {
      label: '7 Series',
      value: '7 Series',
      brand: 'BMW',
      yearFrom: 2015,
      category: CarCategory.LUXURY,
      tariff: TariffType.LUXURY,
      features: ['Flagship luxury', 'Ultimate comfort', 'Advanced technology'],
      priceRange: PriceRange.PREMIUM
    },
    {
      label: '3 Series',
      value: '3 Series',
      brand: 'BMW',
      yearFrom: 2019,
      category: CarCategory.LUXURY,
      tariff: TariffType.PLUS,
      features: ['Compact luxury', 'Sporty dynamics', 'Premium quality'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'X5',
      value: 'X5',
      brand: 'BMW',
      yearFrom: 2019,
      category: CarCategory.SUV,
      tariff: TariffType.PREMIUM,
      features: ['Luxury SUV', 'Dynamic driving', 'Premium interior'],
      priceRange: PriceRange.HIGH
    },
    {
      label: 'X7',
      value: 'X7',
      brand: 'BMW',
      yearFrom: 2019,
      category: CarCategory.SUV,
      tariff: TariffType.LUXURY,
      features: ['Full-size luxury SUV', 'Ultimate space', 'Premium comfort'],
      priceRange: PriceRange.PREMIUM
    },

    // Toyota
    {
      label: 'Camry',
      value: 'Camry',
      brand: 'Toyota',
      yearFrom: 2018,
      category: CarCategory.SEDAN,
      tariff: TariffType.PLUS,
      features: ['Reliable sedan', 'Comfortable ride', 'Good fuel economy'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'Corolla',
      value: 'Corolla',
      brand: 'Toyota',
      yearFrom: 2020,
      category: CarCategory.COMPACT,
      tariff: TariffType.STANDARD,
      features: ['Compact sedan', 'Fuel efficient', 'Reliable'],
      priceRange: PriceRange.LOW
    },
    {
      label: 'Avalon',
      value: 'Avalon',
      brand: 'Toyota',
      yearFrom: 2019,
      category: CarCategory.SEDAN,
      tariff: TariffType.PLUS,
      features: ['Full-size sedan', 'Premium comfort', 'Spacious interior'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'RAV4',
      value: 'RAV4',
      brand: 'Toyota',
      yearFrom: 2019,
      category: CarCategory.SUV,
      tariff: TariffType.STANDARD,
      features: ['Compact SUV', 'Versatile', 'Good fuel economy'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'Highlander',
      value: 'Highlander',
      brand: 'Toyota',
      yearFrom: 2020,
      category: CarCategory.SUV,
      tariff: TariffType.PLUS,
      features: ['Midsize SUV', '3-row seating', 'Family friendly'],
      priceRange: PriceRange.MEDIUM
    },

    // Hyundai
    {
      label: 'Sonata',
      value: 'Sonata',
      brand: 'Hyundai',
      yearFrom: 2020,
      category: CarCategory.SEDAN,
      tariff: TariffType.STANDARD,
      features: ['Midsize sedan', 'Modern design', 'Good value'],
      priceRange: PriceRange.LOW
    },
    {
      label: 'Elantra',
      value: 'Elantra',
      brand: 'Hyundai',
      yearFrom: 2021,
      category: CarCategory.COMPACT,
      tariff: TariffType.STANDARD,
      features: ['Compact sedan', 'Stylish design', 'Good features'],
      priceRange: PriceRange.LOW
    },
    {
      label: 'Genesis',
      value: 'Genesis',
      brand: 'Hyundai',
      yearFrom: 2017,
      category: CarCategory.LUXURY,
      tariff: TariffType.PLUS,
      features: ['Luxury sedan', 'Premium quality', 'Good value'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'Tucson',
      value: 'Tucson',
      brand: 'Hyundai',
      yearFrom: 2022,
      category: CarCategory.SUV,
      tariff: TariffType.STANDARD,
      features: ['Compact SUV', 'Modern design', 'Good features'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'Santa Fe',
      value: 'Santa Fe',
      brand: 'Hyundai',
      yearFrom: 2019,
      category: CarCategory.SUV,
      tariff: TariffType.PLUS,
      features: ['Midsize SUV', 'Spacious', 'Family oriented'],
      priceRange: PriceRange.MEDIUM
    },

    // Tesla
    {
      label: 'Model 3',
      value: 'Model 3',
      brand: 'Tesla',
      yearFrom: 2017,
      category: CarCategory.ELECTRIC,
      tariff: TariffType.PLUS,
      features: ['Electric sedan', 'Autopilot', 'Fast charging'],
      priceRange: PriceRange.MEDIUM
    },
    {
      label: 'Model S',
      value: 'Model S',
      brand: 'Tesla',
      yearFrom: 2012,
      category: CarCategory.ELECTRIC,
      tariff: TariffType.LUXURY,
      features: ['Electric luxury', 'Long range', 'Ludicrous mode'],
      priceRange: PriceRange.HIGH
    },
    {
      label: 'Model X',
      value: 'Model X',
      brand: 'Tesla',
      yearFrom: 2015,
      category: CarCategory.ELECTRIC,
      tariff: TariffType.LUXURY,
      features: ['Electric SUV', 'Falcon doors', '7-seater'],
      priceRange: PriceRange.HIGH
    },
    {
      label: 'Model Y',
      value: 'Model Y',
      brand: 'Tesla',
      yearFrom: 2020,
      category: CarCategory.ELECTRIC,
      tariff: TariffType.PLUS,
      features: ['Electric SUV', 'Compact', 'Good range'],
      priceRange: PriceRange.MEDIUM
    }
  ];

  private readonly TARIFF_OPTIONS: TariffOption[] = [
    {
      label: 'Economy',
      value: TariffType.ECONOMY,
      description: 'Базовый тариф для экономичных поездок',
      priceMultiplier: 0.8,
      features: ['Базовое обслуживание', 'Стандартные условия', 'Экономичная цена']
    },
    {
      label: 'Standard',
      value: TariffType.STANDARD,
      description: 'Стандартный тариф для повседневных поездок',
      priceMultiplier: 1.0,
      features: ['Стандартное обслуживание', 'Хорошие условия', 'Сбалансированная цена']
    },
    {
      label: 'Plus',
      value: TariffType.PLUS,
      description: 'Улучшенный тариф с дополнительными услугами',
      priceMultiplier: 1.3,
      features: ['Улучшенное обслуживание', 'Дополнительные услуги', 'Комфортные условия']
    },
    {
      label: 'Premium',
      value: TariffType.PREMIUM,
      description: 'Премиум тариф для требовательных клиентов',
      priceMultiplier: 1.6,
      features: ['Премиум обслуживание', 'Люкс автомобили', 'VIP условия']
    },
    {
      label: 'Business',
      value: TariffType.BUSINESS,
      description: 'Бизнес тариф для корпоративных клиентов',
      priceMultiplier: 1.4,
      features: ['Бизнес обслуживание', 'Профессиональные водители', 'Корпоративные скидки']
    },
    {
      label: 'Luxury',
      value: TariffType.LUXURY,
      description: 'Люкс тариф для эксклюзивных поездок',
      priceMultiplier: 2.0,
      features: ['Люкс обслуживание', 'Элитные автомобили', 'Персональный менеджер']
    }
  ];

  /**
   * Get experience options
   */
  getExperienceOptions(): ExperienceOption[] {
    return this.EXPERIENCE_OPTIONS;
  }

  /**
   * Get car brands
   */
  getCarBrands(): CarBrand[] {
    return this.CAR_BRANDS;
  }

  /**
   * Get car models by brand
   */
  getCarModelsByBrand(brand: string): CarModel[] {
    return this.CAR_MODELS.filter(model => model.brand === brand);
  }

  /**
   * Get year options
   */
  getYearOptions(): YearOption[] {
    const currentYear = new Date().getFullYear();
    const yearOptions: YearOption[] = [];
    
    for (let year = currentYear + 1; year >= 1990; year--) {
      yearOptions.push({
        label: year.toString(),
        value: year.toString(),
        year: year
      });
    }
    
    return yearOptions;
  }

  /**
   * Get tariff options
   */
  getTariffOptions(t: (key: string) => string): TariffOption[] {
    return this.TARIFF_OPTIONS.map(tariff => ({
      ...tariff,
      label: t(`auth.register.tariff${tariff.value}`) || tariff.label
    }));
  }

  /**
   * Get car by model
   */
  getCarByModel(model: string): CarModel | null {
    return this.CAR_MODELS.find(car => car.value === model) || null;
  }

  /**
   * Get brand by model
   */
  getBrandByModel(model: string): CarBrand | null {
    const car = this.getCarByModel(model);
    if (!car) return null;
    
    return this.CAR_BRANDS.find(brand => brand.value === car.brand) || null;
  }

  /**
   * Get models by tariff
   */
  getModelsByTariff(tariff: TariffType): CarModel[] {
    return this.CAR_MODELS.filter(model => model.tariff === tariff);
  }

  /**
   * Get models by year
   */
  getModelsByYear(year: number): CarModel[] {
    return this.CAR_MODELS.filter(model => 
      year >= model.yearFrom && (!model.yearTo || year <= model.yearTo)
    );
  }

  /**
   * Get popular models
   */
  getPopularModels(): CarModel[] {
    return this.CAR_MODELS.filter(model => 
      ['E-Class', 'S-Class', '5 Series', '7 Series', 'Camry', 'Corolla', 'Model 3'].includes(model.value)
    );
  }

  /**
   * Get models by category
   */
  getModelsByCategory(category: CarCategory): CarModel[] {
    return this.CAR_MODELS.filter(model => model.category === category);
  }

  /**
   * Search models by query
   */
  searchModels(query: string): CarModel[] {
    const lowerQuery = query.toLowerCase();
    return this.CAR_MODELS.filter(model => 
      model.label.toLowerCase().includes(lowerQuery) ||
      model.brand.toLowerCase().includes(lowerQuery) ||
      model.category.toLowerCase().includes(lowerQuery)
    );
  }
}

// Default instance for backward compatibility
export const driverData = new DriverDataHelper();

// Legacy function exports for smooth migration
export const experienceOptions = driverData.getExperienceOptions();
export const carBrands = driverData.getCarBrands();
export const carModelsByBrand = (brand: string) => driverData.getCarModelsByBrand(brand);
export const getYearOptions = () => driverData.getYearOptions();
export const getTariffOptions = (t: (key: string) => string) => driverData.getTariffOptions(t);
