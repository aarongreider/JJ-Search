export const PostType = { search: "Search", suggestor: "Suggestor" }

const processURL = (): string => {
    const pathname = window.location.hash;
    //const pathname = "https://junglejims.com/item-search-new/#key";
    const cleanPath = pathname.replace(/\//g, '');

    if (cleanPath) {
        // Split the last segment by hyphens
        const words = cleanPath.split('#');
        const location = words[words.length - 1]
        //console.log(words, location);  // Outputs an array of words split by hyphen
        console.log(location);
        return location
    } else {
        //console.log("No valid segment found.");
        return ""
    }
}

export const getRequestOptions = (searchTerm: string, postType: string): RequestInit => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", processURL());
    
    let raw;

    if (postType == PostType.search) {
        raw = JSON.stringify({
            "queryType": "full",
            "search": searchTerm,
            "searchMode": "all",
            "searchFields": "UPC,Description,Brand,Size,Department,Category,Keywords",
            "speller": "lexicon",
            "queryLanguage": "en-us",
            "count": true,
            "top": 1000
        });
    } else if (postType == PostType.suggestor) {
        raw = JSON.stringify({
            "filter": "",
            "highlightPostTag": "</em>",
            "highlightPreTag": "<em>",
            "minimumCoverage": 80,
            "orderby": "",
            "search": searchTerm,
            "searchFields": "Description",
            "select": "UPC,Description,Brand,Department",
            "suggesterName": "sg-itemsearch",
            "top": 10
          });
    }

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    return requestOptions
}