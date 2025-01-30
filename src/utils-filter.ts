import { SearchResult } from './utils'

export const filterStore = (items: SearchResult[]): SearchResult[] => {
    return items
}
export const filterDepartment = (items: SearchResult[]): SearchResult[] => {
    return items
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