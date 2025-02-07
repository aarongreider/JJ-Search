import { getimageURL, sanitizeDepartmentOrCategory, SearchResult } from "../../utils"
import './card.css'

interface CardProps {
    searchResult: SearchResult
    userIP: string
}

export function Card({ searchResult, userIP }: CardProps) {
    return <>
        {
            //!searchResult.FF_InStock && !searchResult.EG_InStock ? undefined :
            <div className="resultCard">

                {/* DEPT ICON */}
                <div style={{ display: "flex", flexDirection: "column", gap: '2px', alignItems: 'center', justifyContent: "center"}}>
                    <img className="deptIcon" src={getimageURL(searchResult.Department)}></img>

                    {/* IN STOCK INDICATOR */}
                    <div style={{ display: "flex", flexDirection: "row", gap: '2px', alignItems: 'center' }}>
                        <p className="stockIndicator" style={{ background: 'rgb(75 156 64)', opacity: `${searchResult.FF_InStock ? '1' : '.5'}` }}>
                            FF <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>{searchResult.FF_InStock ? 'check_circle' : 'cancel'}</span>
                        </p>
                        <p className="stockIndicator" style={{ background: 'rgb(225 154 4)', opacity: `${searchResult.EG_InStock ? '1' : '.5'}` }}>
                            EG <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>{searchResult.EG_InStock ? 'check_circle' : 'cancel'}</span>
                        </p>
                    </div>
                </div>

                {/* SEARCH RESULT DETAILS */}
                <div className="cardText">

                    {/* BRAND */}
                    <p>{searchResult.Brand}</p>

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
                    <h2 style={{ letterSpacing: "-.5px", transform: `${userIP == "74.219.230.226" || userIP == "70.62.236.130" ? '' : 'translateY(-4px)'}` }}>
                        {userIP == "74.219.230.226"
                            ? <><sup>$</sup>{searchResult.FF_RetailPrice}
                                {(searchResult.Size && !searchResult.Size.toLocaleLowerCase().includes("n/a")) ?
                                    <span className="small"> / </span>
                                    : undefined
                                }
                            </>
                            : userIP == "70.62.236.130"
                                ? <><sup>$</sup>{searchResult.EG_RetailPrice}
                                    {(searchResult.Size && !searchResult.Size.toLocaleLowerCase().includes("n/a")) ?
                                        <span className="small"> / </span>
                                        : undefined
                                    }
                                </> : undefined}

                        {(searchResult.Size && !searchResult.Size.toLocaleLowerCase().includes("n/a")) ?
                            <span className="small">{searchResult.Size.toLocaleLowerCase()}</span>
                            : undefined
                        }
                    </h2>
                </div>
            </div>
        }
    </>
}