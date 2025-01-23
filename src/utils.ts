import { getRequestOptions, PostType } from "./utils-fetch";

type DataFetch = {
    "@odata.context": string,
    "@odata.count": number
    "value": SearchResult[] | Suggestor[]
}

export type SearchResult = {
    "@search.score": number
    Brand: string
    Category: string
    Department: string
    Description: string
    EG_InStock: boolean
    EG_RetailPrice: string
    FF_InStock: boolean
    FF_RetailPrice: string
    Keywords: string
    Size: string
    UPC: string
}

export const getSearchData = async (searchTerm: string): Promise<SearchResult[]> => {
    try {
        //const response = await fetch("https://jjp-search.search.windows.net/indexes/jjsearchindex/docs/search?api-version=2024-11-01-preview", getRequestOptions());
        const response = await fetch("/api/indexes/jjsearchindex/docs/search?api-version=2024-11-01-preview", getRequestOptions(searchTerm, PostType.search));
        const result = await response.text();
        const parsedResult: DataFetch = JSON.parse(result)
        console.log(parsedResult.value)
        return parsedResult.value as SearchResult[]
    } catch (error) {
        console.error(error);
        return []
    };
}

export type Suggestor = {
    "@search.text": string
    Brand: string
    Department: string
    Description: string
    UPC: string
}

export const getSuggestors = async (searchTerm: string): Promise<Suggestor[]> => {
    try {
        //const response = await fetch("https://jjp-search.search.windows.net/indexes/jjsearchindex/docs/search?api-version=2024-11-01-preview", getRequestOptions());
        const response = await fetch("/api/indexes('jjsearchindex')/docs/search.post.suggest?api-version=2024-11-01-preview", getRequestOptions(searchTerm, PostType.suggestor));
        const result = await response.text();
        const parsedResult: DataFetch = JSON.parse(result)
        console.log(parsedResult.value)
        return parsedResult.value as Suggestor[]
    } catch (error) {
        console.error(error);
        return []
    };
}

export const sanitizeDepartmentOrCategory = (string: string) => {
    return string
        .replace(/\bINTL\b/g, '')
        .replace(/\bNF SS\b/g, '')
        .replace(/\bNF \b/g, '')
        .replace(/\bHBA\b/g, "HEALTH & BEAUTY")
        .replace(/\bFRZ\b/g, "FROZEN")
        .replace(/\b AND \b/g, " & ")
        .trim()
}
