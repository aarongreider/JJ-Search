import { SearchParams, SearchResult } from './utils'


export const orderItems = (params: SearchParams, items: SearchResult[]): SearchResult[] => {
    //console.log(params);
    
    return sortItems(filterByStore(filterByDepartment(filterByStock(items, params.showOOS), params.dept), params.store), params.sort)
}

export const getPaginated = (params: SearchParams ,results: SearchResult[], slice: number): SearchResult[] => {
    /* console.log(`before slice items`, orderItems(params, results));
    console.log(`after slice items`,orderItems(params, results).slice(0, slice));
    console.log(`all fetched results`, results.length); */
    
    return orderItems(params, results).slice(0, slice)
}

export const filterByStore = (items: SearchResult[], filterQuery: string): SearchResult[] => {

    if (filterQuery == "FF") {
        return items.filter((item) => {
            return (item.FF_InStock);
        })
    } else if (filterQuery == "EG") {
        return items.filter((item) => {
            return (item.EG_InStock);
        })
    } else { return items }
}

export const filterByStock = (items: SearchResult[], showOutOfStock: boolean): SearchResult[] => {
    if (!showOutOfStock) {
        return items.filter((item) => {
            return (item.FF_InStock || item.EG_InStock);
        })
    }
    return items
}

export const filterByDepartment = (items: SearchResult[], filterQuery: string): SearchResult[] => {
    if (filterQuery) {
        return items.filter((item) => {
            return (
                `${item.Department}`.includes(filterQuery)
            );
        })
    } else {
        return items
    }
}

export const sortItems = (items: SearchResult[], sortQuery: string): SearchResult[] => {

    if (sortQuery === '') {
        return items
    } else {
        switch (sortQuery) {
            case "price ascending":
                {
                    items.sort((a, b) => {
                        const aPrice = cleanPrice(a.FF_RetailPrice ? a.FF_RetailPrice : '0'); // Convert price to number
                        const bPrice = cleanPrice(b.FF_RetailPrice ? b.FF_RetailPrice : '0');

                        return aPrice - bPrice; // Ascending order by Price
                    })
                    break;
                }
            case "price descending":
                {
                    items.sort((a, b) => {
                        const aPrice = cleanPrice(a.FF_RetailPrice ? a.FF_RetailPrice : '0'); // Convert price to number
                        const bPrice = cleanPrice(b.FF_RetailPrice ? b.FF_RetailPrice : '0');

                        return bPrice - aPrice; // Ascending order by Price
                    })
                    break;
                }
            case "alphabetically":
                {
                    items.sort((a, b) => {
                        return a.Description?.localeCompare(b.Description);
                    })
                    break;
                }
        }
        return items
    }
}

const cleanPrice = (price: string): number => {
    // Remove non-numeric characters except periods (.) using a regex
    const cleanedPrice = `${price}`.replace(/[^0-9.]/g, '');
    return cleanedPrice === "" ? 0.0 : parseFloat(cleanedPrice); // Convert cleaned string to a float
};