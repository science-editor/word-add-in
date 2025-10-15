import { AdvancedFilterState } from "../types";

export const initialAdvancedFilter = (): AdvancedFilterState => ({
  id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
  filterType: "",
  values: [],
  condition: "true",
});

export function serializeAdvancedFilters(filters: AdvancedFilterState[]): string[] {
  const out: string[] = [];

  for (const f of filters) {
    if (
      !f.filterType ||
      (!f.values.length &&
        [
          "publication_year",
          "author_full_name",
          "author_given_name",
          "author_family_name",
          "title",
          "venue",
          "doi",
        ].includes(f.filterType))
    ) {
      continue;
    }

    const conditionStr = f.condition === "true" ? "" : "!";
    let field = "";
    let valuesStr = "";

    switch (f.filterType) {
      case "publication_year":
        field = "PublicationDate.Year";
        valuesStr = f.values.length ? ":" + (f.values as (string | number)[]).join("|") : "";
        break;
      case "publication_year_range":
        field = "PublicationDate.Year";
        valuesStr = f.values.length ? ":" + (f.values as (string | number)[]).join("..") : "";
        break;
      case "author_full_name":
        field = "Author.FullName";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "author_given_name":
        field = "Author.GivenName";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "author_family_name":
        field = "Author.FamilyName";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "title":
        field = "Title";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "venue":
        field = "Venue";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "doi":
        field = "DOI";
        valuesStr = f.values.length ? ":" + (f.values as string[]).join("|") : "";
        break;
      case "abstract_parsed":
        field = "AvailableField:Content.Abstract_Parsed";
        break;
      case "fullbody_parsed":
        field = "AvailableField:Content.Fullbody_Parsed";
        break;
      default:
        continue;
    }

    out.push(`${conditionStr}${field}${valuesStr}`);
  }

  return out;
}