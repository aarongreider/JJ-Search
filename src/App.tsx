import { useEffect, useRef, useState } from 'react'
import { getSearchData, getSuggestors, SearchResult, setDevelopmentStyles, setWPStyles, Suggestor } from './utils'
import { Card } from './components/Card/Card'
import './App.css'
import { filterDepartment, filterStore, sortItems } from './utils-filter'

function App() {
  const [resultsLoaded, setResultsLoaded] = useState<boolean>(false)
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResult] = useState<SearchResult[]>([])
  const [suggestors, setSuggestors] = useState<Suggestor[]>([])
  const [displaySuggestors, setDisplaySuggestors] = useState<boolean>(false)
  const [sortQuery, setSortQuery] = useState<string>("")
  const [filterDept, setFilterDept] = useState<string>("")
  const [storeQuery, setStoreQuery] = useState<string>("")
  const searchBar = useRef<HTMLInputElement>(null)

  useEffect(() => {
    import.meta.env.PROD ? undefined : setDevelopmentStyles()
    console.log("version .6");
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

  const orderItems = (items: SearchResult[]): SearchResult[] => {
    return sortItems(filterStore(filterDepartment(items)), sortQuery)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>

        {/* SEARCH BAR */}
        <div className='inputWrapper' style={{ paddingBottom: `${displaySuggestors ? '15px' : 0}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%', position: 'relative', marginBottom: `${displaySuggestors ? '5px' : 0}` }}>
            <span className="material-symbols-outlined" style={{ cursor: 'default' }}>search</span>
            <input type="text" ref={searchBar} style={{ background: "none", border: "none", outline: 'none', width: '100%', paddingLeft: '2px' }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? setTriggerSearch(!triggerSearch) : undefined}
              onFocus={() => { setDisplaySuggestors(true) }}
              onBlur={() => setTimeout(() => { setDisplaySuggestors(false) }, 200)}
            />
            <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={() => { setSearchQuery(""); setSuggestors([]) }}>close</span>
            {displaySuggestors && <hr />}
          </div>




          {/* SUGGESTORS */}
          <ul className='suggestorContainer' style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {displaySuggestors ? suggestors.map((suggestor, index) => {
              return <>
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '100%' }} onClick={() => {
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

        {/* NUMBER OF RESULTS */}
        <p style={{ width: '100%', textAlign: 'right', margin: 0, padding: '0 6px' }}>
          {searchResults.length} Results. {searchResults.filter((result) => result.FF_InStock === false && result.EG_InStock === false).length} Items Out of Stock.
        </p>

        {/* RESULTS AND FILTERING */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>

          {/* SEARCH RESULTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

          {/* FILTERING */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select>
              <option value="">Relevance</option>
              <option value="price descending">Most $</option>
              <option value="price ascending">Least $</option>
              <option value="alphabetically">A-Z</option>
            </select>
            <select>
              <option value="">Both Stores</option>
              <option value="FF">Fairfield</option>
              <option value="EG">Eastgate</option>
            </select>
            <select>
              <option value="">All Departments</option>
              <option value="Bakery">Bakery</option>
              <option value="Beer">Beer</option>
              <option value="Candy">Candy</option>
              <option value="Cheese">Cheese</option>
              <option value="Cigars">Cigars</option>
              <option value="Cookware">Cookware</option>
              <option value="Dairy">Dairy</option>
              <option value="Deli">Deli</option>
              <option value="Grocery">Grocery</option>
              <option value="HBA<">HBA</option>
              <option value="Supplements">Supplements</option>
              <option value="International">International</option>
              <option value="Liquor">Liquor</option>
              <option value="Meat">Meat</option>
              <option value="Health Food">Health Food</option>
              <option value="Olive Bar">Olive Bar</option>
              <option value="Pets">Pets</option>
              <option value="Produce">Produce</option>
              <option value="Seafood">Seafood</option>
              <option value="Pop">Pop</option>
              <option value="Wine">Wine</option>
              <option value="International Produce">International Produce</option>
              <option value="Toys">Toys</option>
            </select>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
