// @ts-ignore
import { getRequestOptions } from "./utils-fetch";

export const fetchData = async () => {
    try {
        const response = await fetch("https://jjp-search.search.windows.net/indexes/jjsearchindex/docs/search?api-version=2024-11-01-preview", getRequestOptions());
        const result = await response.text();
        console.log(result)
    } catch (error) {
        console.error(error);
    };
}
