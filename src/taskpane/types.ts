export interface Paper {
  title: string;
  authors: any[];
  year: number;
  venue: string;
  abstract: string | null;
  fullPaper: string | null;
  collection: string;
  DOI: string;
  idField: string;
  idType: string;
  idValue: string;
}

export type FilterType =
  | ""
  | "publication_year"
  | "publication_year_range"
  | "author_full_name"
  | "author_given_name"
  | "author_family_name"
  | "title"
  | "venue"
  | "doi"
  | "abstract_parsed"
  | "fullbody_parsed";

export interface AdvancedFilterState {
  id: string;
  filterType: FilterType;
  values: string[] | number[];
  /** "true" = positive filter, "false" = negated filter */
  condition: "true" | "false";
}