import { getRequestOptions, PostType } from "./utils-fetch";

export const NumResultsToFetch = 1000
export const NumResultsIncriment = 30


export type DataFetch = {
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

export type Suggestor = {
    "@search.text": string
    Brand: string
    Department: string
    Description: string
    UPC: string
}

export type SearchParams = {
    query: string,
    sort: string,
    dept: string,
    store: string,
    showOOS: boolean
}

export const getSuggestors = async (searchTerm: string): Promise<Suggestor[]> => {
    try {
        //const response = await fetch("https://jjp-search.search.windows.net/indexes/jjsearchindex/docs/search?api-version=2024-11-01-preview", getRequestOptions());
        const response = await fetch(
            import.meta.env.PROD ?
                "https://jjp-search.search.windows.net/indexes('jjsearchindex')/docs/search.post.suggest?api-version=2024-11-01-preview" :
                "/api/indexes('jjsearchindex')/docs/search.post.suggest?api-version=2024-11-01-preview",
            getRequestOptions(searchTerm, PostType.suggestor)
        );
        const result = await response.text();
        const parsedResult: DataFetch = JSON.parse(result)
        //console.log(parsedResult.value)
        return parsedResult.value as Suggestor[]
    } catch (error) {
        console.error(error);
        return []
    };
}

export const sanitizeDepartmentOrCategory = (string: string) => {
    return string
        //.replace(/\bINTL\b/g, '')
        .replace(/\bNF SS\b/g, '')
        .replace(/\bNF \b/g, '')
        .replace(/\bHBA\b/g, "HEALTH & BEAUTY")
        .replace(/\bFRZ\b/g, "FROZEN")
        .replace(/\b AND \b/g, " & ")
        .trim()
}

export const getimageURL = (department: string): string => {
    let renderDept;

    switch (department) {
        case "TOBACCO & CIGARETTES":
            renderDept = "Cigars"
            break;
        case "ORGANIC PRODUCE":
            renderDept = "Produce"
            break;
        case "PET":
            renderDept = "Pets"
            break;
        case "HBA":
            renderDept = "HBA"
            break;
        case "WINE NON-FOOD":
            renderDept = "Wine"
            break;
        case "HEALTH FOOD":
            renderDept = "Health-Food"
            break;
        case "CHEESE SHOP":
            renderDept = "Cheese"
            break;
        case "INTL PRODUCE":
            renderDept = "International-Produce"
            break;
        case "FROZEN":
            renderDept = "Dairy"
            break;
        case "MILK":
            renderDept = "Dairy"
            break;
        case "EC RENTAL":
            renderDept = "International"
            break;
        case "N/A BEER & WINE":
            renderDept = "Beer"
            break;
        default: renderDept = toTitleCase(department)
    }
    return `https://junglejims.com/wp-content/uploads/Item-Search_${renderDept}.png`
}

const toTitleCase = (str: string) => {
    return str
        .toLowerCase() // Convert the entire string to lowercase
        .split(' ')    // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' ');    // Join the words back into a single string
}


export const setDevelopmentStyles = () => {
    const DevelopmentStyles = [
        '<link rel="stylesheet" href="./src/Default CSS/907ce8a0_ai1ec_parsed_css.css">',
        '<link rel="stylesheet" href="./src/Default CSS/ajax-load-more.min.css">',
        '<link rel="stylesheet" href="./src/Default CSS/all.css">',
        '<link rel="stylesheet" href="./src/Default CSS/bootstrap.min.css">',
        '<link rel="stylesheet" href="./src/Default CSS/calendar.css">',
        '<link rel="stylesheet" href="./src/Default CSS/czo1ptk.css">',
        '<link rel="stylesheet" href="./src/Default CSS/item-search-frontend.css">',
        '<link rel="stylesheet" href="./src/Default CSS/jquery.fancybox.css">',
        '<link rel="stylesheet" href="./src/Default CSS/jquery.fancybox.min.css">',
        '<link rel="stylesheet" href="./src/Default CSS/js_composer.min.css">',
        '<link rel="stylesheet" href="./src/Default CSS/perfect-columns.css">',
        '<link rel="stylesheet" href="./src/Default CSS/print.min.css">',
        '<link rel="stylesheet" href="./src/Default CSS/style-wp.css">',
        '<link rel="stylesheet" href="./src/Default CSS/style.css">',
        '<link rel="stylesheet" href="./src/Default CSS/style2.css">',
        '<link rel="stylesheet" href="./src/Default CSS/styles__ltr.css">',
        '<link rel="stylesheet" href="./src/Default CSS/styles.css">',
        '<link rel="stylesheet" href="./src/Default CSS/v4-shims.css">',
    ]
    DevelopmentStyles.forEach(style => {
        const template = document.createElement('template');
        template.innerHTML = style.trim(); // Avoid whitespace issues
        document.head.appendChild(template.content);
    });
}

export const setWPStyles = () => {

    // get scrollbar width
    const scrollbarWidth = document.documentElement.clientWidth - window.innerWidth

    // brute force the correct widths and overflow properties
    const wrapper: HTMLDivElement | null = document.getElementById('wrapper') as HTMLDivElement
    const root: HTMLDivElement | null = document.getElementById("root") as HTMLDivElement
    const btn: HTMLLinkElement | null = document.querySelector("#header > div > div.header-holder > div.sub-nav > a")
    const header: HTMLLinkElement | null = document.querySelector("#header")

    const wrapperStyle = {
        overflow: 'visible',
        width: `calc(100svw + ${scrollbarWidth}px)`
    }
    const rootStyle = {
        width: `calc(100svw + ${scrollbarWidth}px)`
    }

    const btnStyle = {
        width: 'auto',
        whiteSpace: 'normal', // Equivalent to text wrapping
        overflow: 'visible'
    };

    const navStyle = {
        position: 'relative',
        zIndex: 101,
    };

    // Apply each style from the object to the element
    wrapper && Object.assign(wrapper.style, wrapperStyle);
    root && Object.assign(root.style, rootStyle);
    btn && Object.assign(btn.style, btnStyle);
    header && Object.assign(header.style, navStyle);

}