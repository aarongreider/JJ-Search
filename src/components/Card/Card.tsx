//import { useEffect } from "react"
import { getimageURL, sanitizeDepartmentOrCategory, SearchResult } from "../../utils"
import './card.css'

interface CardProps {
    searchResult: SearchResult
}

export function Card({ searchResult }: CardProps) {
    return <>
        <div className="card">
            <img className="deptIcon" src={getimageURL(searchResult.Department)}></img>
            <div className="cardText">
                <p>{searchResult.Brand}</p>
                <h2 style={{ textTransform: "capitalize" }}>{searchResult.Description.toLocaleLowerCase()}</h2>
                <p style={{ display: "flex", alignItems: "flex-end", transform: "translateX(-5px)" }}>
                    <span className="material-symbols-outlined" style={{ fontWeight: 300, fontSize: '20px' }}>location_on</span>
                    {sanitizeDepartmentOrCategory(searchResult.Department)}
                    {(searchResult.Category && searchResult.Department && searchResult.Category !== searchResult.Department) ?
                        <span>
                            &nbsp;/&nbsp;
                            {sanitizeDepartmentOrCategory(searchResult.Category)}
                        </span>
                        : undefined}
                </p>
                <h2 style={{ letterSpacing: "-.5px" }}>
                    <sup>$</sup>
                    {searchResult.FF_RetailPrice}
                    {(searchResult.Size && !searchResult.Size.toLocaleLowerCase().includes("n/a")) ? <span className="small"> / {searchResult.Size.toLocaleLowerCase()}</span> : undefined}
                </h2>
            </div>
        </div>
    </>
}