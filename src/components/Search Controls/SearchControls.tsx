import { useEffect, useRef, useState } from "react"
import { getSuggestors, SearchParams, SearchResult, Suggestor } from "../../utils"
//import './App.css'

interface SearchControlsProps {
    searchParams: SearchParams
    searchResults: SearchResult[]
    totalServerMatches: number
    numUp: number
    numItemsOutOfStock: number
    triggerSearch: boolean

    setTriggerSearch: (trigger: boolean) => void
    setSearchParams: (params: SearchParams) => void
}

export default function SearchControls({ searchParams, searchResults, numUp, numItemsOutOfStock, triggerSearch, setTriggerSearch, setSearchParams }: SearchControlsProps) {
    const [suggestors, setSuggestors] = useState<Suggestor[]>([])
    const [displaySuggestors, setDisplaySuggestors] = useState<boolean>(false)
    const [activeSuggestorIndex, setActiveSuggestorIndex] = useState<number>(-1)
    const [departments, setDepartments] = useState<string[]>([])
    const [navHeight, setNavHeight] = useState<number>(50)
    const searchBar = useRef<HTMLInputElement>(null)


    useEffect(() => {
        setDisplaySuggestors(false)
        if (searchBar.current) {
            searchBar.current.blur()
        }
    }, [triggerSearch])

    useEffect(() => {
        // evaluate if the current department value is valid after search results change
        const newDepartments = [...new Set(searchResults.map(item => item.Department))]
        if (!departments.includes(searchParams.dept)) {
            setSearchParams({ ...searchParams, dept: '' })
        }
        setDepartments(newDepartments)
    }, [searchResults])

    useEffect(() => {
        setActiveSuggestorIndex(-1)
    }, [displaySuggestors])

    useEffect(() => {
        // handle incrimenting and decrementing the suggestor with arrow keys
        const handleKeyDown = (e: KeyboardEvent) => {
            if (searchBar.current && document.activeElement === searchBar.current) {

                if (e.key == "ArrowDown") {
                    e.preventDefault();
                    if (activeSuggestorIndex < suggestors.length - 1) {
                        setActiveSuggestorIndex(activeSuggestorIndex + 1)
                    } else {
                        setActiveSuggestorIndex(0)
                    }
                } else if (e.key == "ArrowUp") {
                    e.preventDefault();
                    if (activeSuggestorIndex > 0) {
                        setActiveSuggestorIndex(activeSuggestorIndex - 1)
                    } else {
                        setActiveSuggestorIndex(suggestors.length - 1)
                    }
                }
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [displaySuggestors, activeSuggestorIndex])

    useEffect(() => {
        if (searchParams.query) {
            fetchSuggestors()
        }
    }, [searchParams.query])

    useEffect(() => { // window size listener
        const handleResize = () => {
            setNavHeight(import.meta.env.PROD ? document.getElementById('nav')?.offsetHeight ?? 50 : 0)
        };

        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize); // Check on resize

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup
        };
    }, [window.innerWidth, window.innerHeight]);

    const selectSuggestor = (suggestor: Suggestor) => {
        setSearchParams({ ...searchParams, query: suggestor.Description.toLocaleLowerCase() })
        setTriggerSearch(!triggerSearch)
    }

    const fetchSuggestors = async () => {
        try {
            const data = await getSuggestors(searchParams.query)
            setSuggestors(data)
            //console.log(data);

        } catch (e) {
            console.log("Error fetching suggestors", e);
        }
    }

    const searchSuggestor = (suggestor: string) => {
        setSearchParams({ ...searchParams, query: suggestor });
        setTriggerSearch(!triggerSearch)
    }
    const sortRef = useRef<HTMLSelectElement>(null)
    const storeRef = useRef<HTMLSelectElement>(null)
    const deptRef = useRef<HTMLSelectElement>(null)

    return <>
        {/* SEARCH BAR */}
        <div className='inputWrapper' style={{ top: `${navHeight + 10}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%', position: 'relative', marginBottom: `${displaySuggestors ? '5px' : 0}` }}>
                <span className="material-symbols-outlined" style={{ cursor: 'default' }}>search</span>
                <input type="text" ref={searchBar} style={{ background: "none", border: "none", outline: 'none', width: '100%', paddingLeft: '2px' }}
                    placeholder="Search..."
                    value={searchParams.query}
                    onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value, })}
                    onKeyDown={(e) =>
                        e.key === "Enter" ?
                            activeSuggestorIndex < 0 ?
                                setTriggerSearch(!triggerSearch)
                                : searchSuggestor(suggestors[activeSuggestorIndex].Description.toLowerCase())
                            : undefined}
                    onFocus={() => { setDisplaySuggestors(true) }}
                    onBlur={() => setTimeout(() => { setDisplaySuggestors(false) }, 200)}
                />
                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={() => { setSearchParams({ ...searchParams, query: "" }); setSuggestors([]) }}>close</span>
                {displaySuggestors && <hr />}
            </div>
            {/* SUGGESTORS */}
            {displaySuggestors && <ul className='suggestorContainer' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {displaySuggestors ? suggestors.map((suggestor, index) => {
                    return <li key={index} className={`${index == activeSuggestorIndex ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%' }} onClick={() => {
                        selectSuggestor(suggestor)
                    }}>
                        <span style={{ color: 'rgb(172, 172, 172)' }} className="material-symbols-outlined">search</span>
                        <button key={index} className="suggestor" style={{ whiteSpace: "nowrap" }}
                            dangerouslySetInnerHTML={{
                                __html: suggestor['@search.text'],
                            }} />
                        <span className='suggestorBrand'>{suggestor.Brand.toLocaleLowerCase()}</span>
                    </li>

                }) : undefined
                }
            </ul>}
        </div>
        {/* SEARCH CONTROLS */}
        <div id='searchControls'>



            {/* FILTERING */}
            <div id="filterBar" style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', }}>

                {/* SORT */}
                <div className="filterButton" onClick={() => { sortRef?.current?.showPicker() }}>
                    <select ref={sortRef} onChange={(e) => { setSearchParams({ ...searchParams, sort: e.currentTarget.value }) }}>
                        <option value="">Relevance</option>
                        <option value="price descending">Most $</option>
                        <option value="price ascending">Least $</option>
                        <option value="alphabetically">A-Z</option>
                    </select>
                    <span className="material-symbols-outlined chevDown">chevron_right</span>
                </div>

                {/* FILTER STORE */}
                <div className="filterButton" onClick={() => { storeRef?.current?.showPicker() }}>
                    <select ref={storeRef} onChange={(e) => { setSearchParams({ ...searchParams, store: e.currentTarget.value, showOOS: false }) }}>
                        <option value="">Both Stores</option>
                        <option value="FF">Fairfield</option>
                        <option value="EG">Eastgate</option>
                    </select>
                    <span className="material-symbols-outlined chevDown">chevron_right</span>
                </div>

                {/* FILTER DEPARTMENT */}
                <div className="filterButton" onClick={() => { deptRef?.current?.showPicker() }}>
                    <select ref={deptRef} value={searchParams.dept} onChange={(e) => { setSearchParams({ ...searchParams, dept: e.currentTarget.value }) }}>
                        <option key="0" value="">All Departments</option>
                        {departments.map((department, index) => {
                            return <option key={index + 1} value={department}>{department}</option>
                        })}
                    </select>
                    <span className="material-symbols-outlined chevDown">chevron_right</span>
                </div>

                {/* TOGGLE SOLD OUT */}
                <div
                    className={`filterButton ${searchParams.store ? "disabled" : ""}`}
                    style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: "flex-end" }}
                    onClick={() => setSearchParams({ ...searchParams, showOOS: !searchParams.showOOS })}
                >
                    <input type='checkbox'
                        disabled={searchParams.store ? true : false}
                        checked={searchParams.showOOS}
                        onChange={(e) => { setSearchParams({ ...searchParams, showOOS: e.currentTarget.checked }) }}>
                    </input>
                    <p style={{ margin: 0 }}>Show Out of Stock</p>
                </div>
            </div>

            {/* NUMBER OF RESULTS */}
            <p style={{ width: '100%', textAlign: 'right', margin: 0, padding: '0 6px', fontSize: '14px', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-.1px' }}>
                Showing {numUp} Results. {numItemsOutOfStock} Items Out of Stock.
            </p>
        </div>
    </>

}