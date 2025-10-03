import { Country } from "../types/countries";
import { ASIA } from "./countries/asia";
import { EUROPE } from "./countries/europe";
import { AFRICA } from "./countries/africa";
import { AMERICA } from "./countries/america";
import { OCEANIA } from "./countries/oceania";

const withContinent = (list: Country[], continent: string): Country[] =>
  list.map((c) => ({ ...c, continent }));

// Merge and deduplicate by ISO code. Preference order keeps Europe over Asia where duplicates exist (e.g., CY, TR).
const merged: Country[] = [
  ...withContinent(AFRICA, "Africa"),
  ...withContinent(AMERICA, "America"),
  ...withContinent(ASIA, "Asia"),
  ...withContinent(EUROPE, "Europe"),
  ...withContinent(OCEANIA, "Oceania"),
];

const byCode = new Map<string, Country>();
for (const c of merged) {
  // Later continents in the list overwrite earlier ones to prefer Europe over Asia for duplicates
  byCode.set(c.code, c);
}

export const COUNTRIES_FULL: Country[] = Array.from(byCode.values());

export type CountryItem = { code: string; name: string };

export const COUNTRIES_SIMPLE: CountryItem[] = COUNTRIES_FULL.map(
  (country) => ({
    code: country.code,
    name: country.name,
  }),
);
