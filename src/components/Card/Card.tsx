//import { useEffect } from "react"
import { getimageURL, sanitizeDepartmentOrCategory, SearchResult } from "../../utils"
import './card.css'

interface CardProps {
    searchResult: SearchResult
}

export function Card({ searchResult }: CardProps) {
    return <>
        {
            //!searchResult.FF_InStock && !searchResult.EG_InStock ? undefined :
            <div className="resultCard">

                {/* DEPT ICON */}
                <img className="deptIcon" src={getimageURL(searchResult.Department)}></img>

                {/* SEARCH RESULT DETAILS */}
                <div className="cardText">
                    <div className="flex" style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>

                        {/* BRAND */}
                        <p>{searchResult.Brand}</p>

                        {/* IN STOCK INDICATOR */}
                        {(searchResult.FF_InStock && searchResult.EG_InStock) ?
                            undefined : searchResult.FF_InStock ?
                                <p className="stockIndicator" style={{ background: 'rgb(75 156 64)' }}>FF Only</p> : searchResult.EG_InStock ?
                                    <p className="stockIndicator" style={{ background: 'rgb(225 154 4)' }}>EG Only</p> :
                                    <p className="stockIndicator" style={{ background: 'rgb(226 116 58)' }}>Out of Stock</p>
                        }
                    </div>

                    {/* DESCRIPTION */}
                    <h2 style={{ textTransform: "capitalize" }}>{searchResult.Description.toLocaleLowerCase()}</h2>

                    {/* DEPARTMENT AND CATEGORY */}
                    <p style={{ display: "flex", alignItems: "flex-start", transform: "translateX(-5px) translateY(2px)" }}>
                        <span className="material-symbols-outlined" style={{ fontWeight: 300, fontSize: '20px', transform: 'translateY(-3.5px)' }}>location_on</span>
                        {sanitizeDepartmentOrCategory(searchResult.Department)}
                        {(searchResult.Category && searchResult.Department && searchResult.Category !== searchResult.Department) ?
                            <>
                                &nbsp;/&nbsp;
                                {sanitizeDepartmentOrCategory(searchResult.Category)}
                            </>
                            : undefined}
                    </p>

                    {/* PRICE AND SIZE */}
                    <h2 style={{ letterSpacing: "-.5px" }}>
                        <sup>$</sup>
                        {searchResult.FF_RetailPrice}
                        {(searchResult.Size && !searchResult.Size.toLocaleLowerCase().includes("n/a")) ?
                            <span className="small"> / {searchResult.Size.toLocaleLowerCase()}</span>
                            : undefined
                        }
                    </h2>
                </div>
            </div>
        }
    </>
}