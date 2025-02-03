import { SearchResult } from './utils'

export const filterByStore = (items: SearchResult[], filterQuery: string): SearchResult[] => {
    if (filterQuery) {
        if (filterQuery == "Fairfield") {
            return items.filter((item) => {
                return (item.FF_InStock);
            })
        } else {
            return items.filter((item) => {
                return (item.EG_InStock);
            })
        }
    } else {
        return items
    }
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