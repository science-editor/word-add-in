import { useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DOCUMENT_SEARCH, PAGINATED_SEARCH, SINGLE_PAPER_QUERY, ADD_PAPER_TO_ZOTERO } from "../schemas.js";
import { AdvancedFilterState, Paper } from "../types";
import { serializeAdvancedFilters } from "../utils/filters";

export function useEndocApi() {
  const [documentSearch] = useLazyQuery(DOCUMENT_SEARCH, { fetchPolicy: "network-only" });
  const [paginatedSearch] = useLazyQuery(PAGINATED_SEARCH, { fetchPolicy: "network-only" });
  const [singlePaper] = useLazyQuery(SINGLE_PAPER_QUERY, { fetchPolicy: "network-only" });
  const [addToZoteroMutation] = useMutation(ADD_PAPER_TO_ZOTERO);

  const search = useCallback(
    async (rankingVariable: string, keywords: string[], filters: AdvancedFilterState[]) => {
      const filterStrings = serializeAdvancedFilters(filters);
      const combined = filterStrings.length ? [...keywords, ...filterStrings] : keywords;

      const docRes = await documentSearch({
        variables: { ranking_variable: rankingVariable, keywords: combined },
      });

      if (docRes.data?.documentSearch?.status === "failure") {
        throw new Error(docRes.data?.documentSearch?.message || "Search failed");
      }

      const paperList = docRes.data?.documentSearch?.response?.paper_list;
      if (!paperList) return [] as Paper[];

      const metaRes = await paginatedSearch({
        variables: { paper_list: paperList, keywords: combined },
      });

      const fetched = metaRes.data?.paginatedSearch?.response || [];
      return (fetched as any[]).map((paper) => ({
        title: paper.Title,
        authors: paper.Author,
        year: paper.PublicationDate?.Year,
        venue: paper.Venue,
        abstract: null,
        fullPaper: null,
        collection: String(paper._id).split("_")[0],
        DOI: paper.DOI,
        idField: "id_int",
        idType: "int",
        idValue: String(paper.id_int),
      })) as Paper[];
    },
    [documentSearch, paginatedSearch]
  );

  const loadPaperContent = useCallback(
    async (paper: Paper) => {
      const res = await singlePaper({
        variables: {
          paper_id: {
            collection: paper.collection,
            id_field: paper.idField,
            id_type: paper.idType,
            id_value: paper.idValue,
          },
        },
      });

      const content = res.data?.singlePaper?.response?.Content;
      return {
        ...paper,
        abstract: content?.Abstract ?? null,
        fullPaper: content?.Fullbody_Parsed ?? null,
      } as Paper;
    },
    [singlePaper]
  );

  const addToZotero = useCallback(
    async (paper: Paper) => {
      const res = await addToZoteroMutation({
        variables: {
          zoteroCollectionId: "Endoc Word Add-In Collection",
          paper: {
            collection: paper.collection,
            id_field: paper.idField,
            id_type: paper.idType,
            id_value: paper.idValue,
          },
        },
      });
      return res.data?.addPaperToZotero as { status: "success" | "failure"; message?: string };
    },
    [addToZoteroMutation]
  );

  return { search, loadPaperContent, addToZotero };
}