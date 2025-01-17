
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

export const getRequestOptions = (): RequestInit => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", processURL());

    const raw = JSON.stringify({
        "queryType": "full",
        "search": "ovan liners",
        "searchMode": "all",
        "searchFields": "UPC,Description,Brand,Size,Department,Category,Keywords",
        "speller": "lexicon",
        "queryLanguage": "en-us",
        "count": true,
        "top": 10
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return requestOptions
}