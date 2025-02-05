import { useEffect, useRef, useState } from 'react'
import { getSearchData, getSuggestors, SearchResult, setDevelopmentStyles, setWPStyles, Suggestor } from './utils'
import { Card } from './components/Card/Card'
import './App.css'
import { filterByStock, filterByDepartment, filterByStore, sortItems } from './utils-filter'
//import {  useNavigate } from 'react-router-dom'

export default function App() {
  const [resultsLoaded, setResultsLoaded] = useState<boolean>(false)
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResult] = useState<SearchResult[]>([])
  const [suggestors, setSuggestors] = useState<Suggestor[]>([])
  const [displaySuggestors, setDisplaySuggestors] = useState<boolean>(false)
  const [activeSuggestorIndex, setActiveSuggestorIndex] = useState<number>(-1)
  const [sortQuery, setSortQuery] = useState<string>("")
  const [deptQuery, setDeptQuery] = useState<string>("")
  const [storeQuery, setStoreQuery] = useState<string>("")
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false)
  const searchBar = useRef<HTMLInputElement>(null)

  //const navigate = useNavigate()

  useEffect(() => {
    import.meta.env.PROD ? undefined : setDevelopmentStyles()
    console.log("version .7");
    setTimeout(setWPStyles, 500);
    fetchSearchResult()
  }, [])

  useEffect(() => {
    fetchSearchResult()
    setDisplaySuggestors(false)
    if (searchBar.current) {
      searchBar.current.blur()
    }
  }, [triggerSearch])

  useEffect(() => {
    if (searchQuery && searchQuery !== "") {
      fetchSuggestors()
    }
  }, [searchQuery])

  useEffect(() => {
    setActiveSuggestorIndex(-1)
  }, [displaySuggestors])

  useEffect(() => {
    // handle incrimenting and decrementing the suggestor with arrow keys
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key, activeSuggestorIndex);
      console.log("suggestors", suggestors.length, suggestors);


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


  const fetchSearchResult = async () => {
    try {
      setResultsLoaded(false)
      const data = await getSearchData(searchQuery)
      setSearchResult(data);
      setResultsLoaded(true)
    } catch (e) {
      console.log("Error fetching search data", e);
    }
  }

  const fetchSuggestors = async () => {
    try {
      const data = await getSuggestors(searchQuery)
      setSuggestors(data)
      console.log(data);

    } catch (e) {
      console.log("Error fetching suggestors", e);
    }
  }

  const selectSuggestor = (suggestor: Suggestor) => {
    setSearchQuery(suggestor.Description.toLocaleLowerCase())
    setTriggerSearch(!triggerSearch)
  }

  const searchSuggestor = (suggestor: string) => {
    setSearchQuery(suggestor);
    setTriggerSearch(!triggerSearch)
  }

  const orderItems = (items: SearchResult[]): SearchResult[] => {
    return sortItems(filterByStore(filterByDepartment(filterByStock(items, showOutOfStock), deptQuery), storeQuery), sortQuery)
  }


  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative', maxWidth: '800px' }}>
        {/* SEARCH BAR */}
        <div className='inputWrapper' style={{ paddingBottom: `${displaySuggestors ? '15px' : 0}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%', position: 'relative', marginBottom: `${displaySuggestors ? '5px' : 0}` }}>
            <span className="material-symbols-outlined" style={{ cursor: 'default' }}>search</span>
            <input type="text" ref={searchBar} style={{ background: "none", border: "none", outline: 'none', width: '100%', paddingLeft: '2px' }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" ?
                  activeSuggestorIndex < 0 ?
                    setTriggerSearch(!triggerSearch)
                    : searchSuggestor(suggestors[activeSuggestorIndex].Description.toLowerCase())
                  : undefined}
              onFocus={() => { setDisplaySuggestors(true) }}
              onBlur={() => setTimeout(() => { setDisplaySuggestors(false) }, 200)}
            />
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={() => { setSearchQuery(""); setSuggestors([]) }}>close</span>
            {displaySuggestors && <hr />}
          </div>
          {/* SUGGESTORS */}
          <ul className='suggestorContainer' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {displaySuggestors ? suggestors.map((suggestor, index) => {
              return <>
                <li key={index} className={`${index == activeSuggestorIndex ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%' }} onClick={() => {
                  selectSuggestor(suggestor)
                }}>
                  <span style={{ color: 'rgb(172, 172, 172)' }} className="material-symbols-outlined">search</span>
                  <button key={index} className="suggestor" style={{ whiteSpace: "nowrap" }}
                    dangerouslySetInnerHTML={{
                      __html: suggestor['@search.text'],
                    }} />
                  <span className='suggestorBrand'>{suggestor.Brand.toLocaleLowerCase()}</span>
                </li>
              </>
            }) : undefined
            }
          </ul>
        </div>
        {/* FILTERING */}
        <div id="filterBar" style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', }}>
          {/* SORT */}
          <select className="filter" onChange={(e) => { setSortQuery(e.currentTarget.value) }}>
            <option value="">Relevance</option>
            <option value="price descending">Most $</option>
            <option value="price ascending">Least $</option>
            <option value="alphabetically">A-Z</option>
          </select>
          {/* FILTER STORE */}
          <select className="filter" onChange={(e) => { setStoreQuery(e.currentTarget.value); setShowOutOfStock(false) }}>
            <option value="">Both Stores</option>
            <option value="FF">Fairfield</option>
            <option value="EG">Eastgate</option>
          </select>
          {/* FILTER DEPARTMENT */}
          <select className="filter" onChange={(e) => { setDeptQuery(e.currentTarget.value) }}>
            <option value="">All Departments</option>
            {[...new Set(searchResults.map(item => item.Department))].map((department, index) => { return <option key={index} value={department}>{department}</option> })}
          </select>
          {/* TOGGLE SOLD OUT */}
          <div className={`filter ${storeQuery ? "disabled" : ""}`} style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: "flex-end" }}>
            <input type='checkbox'
              disabled={storeQuery ? true : false}
              checked={showOutOfStock}
              onChange={(e) => { setShowOutOfStock(e.currentTarget.checked) }}>
            </input>
            <p style={{ margin: 0 }}>Show Out of Stock</p>
          </div>
        </div>
        {/* NUMBER OF RESULTS */}
        <p style={{ width: '100%', textAlign: 'right', margin: 0, padding: '0 6px' }}>
          {searchResults.length} Results. {searchResults.filter((result) => result.FF_InStock === false && result.EG_InStock === false).length} Items Out of Stock.
        </p>
        {/* SEARCH RESULTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {resultsLoaded ? orderItems(searchResults).map((result, index) => {
            return <Card key={index} searchResult={result}></Card>
          }) :
            <img src='https://junglejims.com/wp-content/uploads/soup.gif' style={{
              width: "40px",
              filter: `
                      drop-shadow(0 2px 1px rgba(0, 0, 0, 0.4))
                      drop-shadow(1px 4px 5px rgba(0, 0, 0, 0.2))`
            }} />}
        </div>
      </div>
    </>
  )
}
