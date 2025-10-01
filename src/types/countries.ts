export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format: string;
  emergencyNumber: string;
  currency: string;
  timezone: string;
  continent?: string;
}

export type CountryItem = {
  code: string;
  name: string;
};

