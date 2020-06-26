export interface Country {
  name: string;
  code: string;
}

export interface Countries {
  countries: Country[];
}

export type CountriesType = Countries;
