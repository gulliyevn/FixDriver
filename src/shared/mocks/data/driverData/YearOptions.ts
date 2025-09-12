/**
 * Year Options for Vehicles
 * Mock data for vehicle year selection
 */

import { YearOption } from '../../../../types/driver/driver';

export const YEAR_OPTIONS: YearOption[] = [
  { label: '2024', value: '2024', year: 2024 },
  { label: '2023', value: '2023', year: 2023 },
  { label: '2022', value: '2022', year: 2022 },
  { label: '2021', value: '2021', year: 2021 },
  { label: '2020', value: '2020', year: 2020 },
  { label: '2019', value: '2019', year: 2019 },
  { label: '2018', value: '2018', year: 2018 },
  { label: '2017', value: '2017', year: 2017 },
  { label: '2016', value: '2016', year: 2016 },
  { label: '2015', value: '2015', year: 2015 },
  { label: '2014', value: '2014', year: 2014 },
  { label: '2013', value: '2013', year: 2013 },
  { label: '2012', value: '2012', year: 2012 },
  { label: '2011', value: '2011', year: 2011 },
  { label: '2010', value: '2010', year: 2010 },
  { label: '2009', value: '2009', year: 2009 },
  { label: '2008', value: '2008', year: 2008 },
  { label: '2007', value: '2007', year: 2007 },
  { label: '2006', value: '2006', year: 2006 },
  { label: '2005', value: '2005', year: 2005 },
  { label: '2004', value: '2004', year: 2004 },
  { label: '2003', value: '2003', year: 2003 },
  { label: '2002', value: '2002', year: 2002 },
  { label: '2001', value: '2001', year: 2001 },
  { label: '2000', value: '2000', year: 2000 },
  { label: '1999', value: '1999', year: 1999 },
  { label: '1998', value: '1998', year: 1998 },
  { label: '1997', value: '1997', year: 1997 },
  { label: '1996', value: '1996', year: 1996 },
  { label: '1995', value: '1995', year: 1995 },
  { label: '1994', value: '1994', year: 1994 },
  { label: '1993', value: '1993', year: 1993 },
  { label: '1992', value: '1992', year: 1992 },
  { label: '1991', value: '1991', year: 1991 },
  { label: '1990', value: '1990', year: 1990 },
  { label: '1989', value: '1989', year: 1989 },
  { label: '1988', value: '1988', year: 1988 },
  { label: '1987', value: '1987', year: 1987 },
  { label: '1986', value: '1986', year: 1986 },
  { label: '1985', value: '1985', year: 1985 },
  { label: '1984', value: '1984', year: 1984 },
  { label: '1983', value: '1983', year: 1983 },
  { label: '1982', value: '1982', year: 1982 },
  { label: '1981', value: '1981', year: 1981 },
  { label: '1980', value: '1980', year: 1980 }
];

export const getYearOptionByValue = (value: string): YearOption | undefined => {
  return YEAR_OPTIONS.find(option => option.value === value);
};

export const getYearOptionsByRange = (startYear: number, endYear: number): YearOption[] => {
  return YEAR_OPTIONS.filter(option => 
    option.year >= startYear && option.year <= endYear
  );
};

export const getRecentYearOptions = (years: number = 10): YearOption[] => {
  const currentYear = new Date().getFullYear();
  return YEAR_OPTIONS.filter(option => 
    option.year >= currentYear - years
  );
};

export const getYearOptionsByDecade = (decade: number): YearOption[] => {
  const startYear = decade;
  const endYear = decade + 9;
  return YEAR_OPTIONS.filter(option => 
    option.year >= startYear && option.year <= endYear
  );
};
