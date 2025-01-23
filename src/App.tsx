import { useEffect, useState } from 'react'
import { getSearchData, getSuggestors, SearchResult, Suggestor } from './utils'
import { Card } from './components/Card/Card'

function App() {
  const [resultsLoaded, setResultsLoaded] = useState<boolean>(false)
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResult] = useState<SearchResult[]>([])
  const [suggestors, setSuggestors] = useState<Suggestor[]>([])
  const [displaySuggestors, setDisplaySuggestors] = useState<boolean>(false)

  useEffect(() => {
    console.log("version .4");
    fetchSearchResult()
  }, [])

  useEffect(() => {
    fetchSearchResult()
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
    setSearchQuery(suggestor.Description)
    setTriggerSearch(!triggerSearch)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

        {/* SEARCH BAR */}
        <div className='inputWrapper' style={{display:'flex', alignItems:'center', gap: '3px', background:"white", borderRadius: "10px", padding: "5px"}}>
          <span className="material-symbols-outlined">search</span>
          <input type="text" style={{background:"none", border: "none", width: '100%'}}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? setTriggerSearch(!triggerSearch) : undefined}
            onFocus={() => { setDisplaySuggestors(true) }}
            onBlur={() => setTimeout(() => { setDisplaySuggestors(false) }, 200)}
          />
          <span className="material-symbols-outlined" onClick={()=>{setSearchQuery(""); setSuggestors([])}}>close</span>
        </div>

        {/* SUGGESTORS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {displaySuggestors ? suggestors.map((suggestor, index) => {
            return <>
              <button key={index} onClick={() => {
                selectSuggestor(suggestor)
              }}>
                {suggestor.Description}
              </button>
            </>
          }) : undefined
          }
        </div>

        {/* SEARCH RESULTS */}
        <div style={{display:'flex', flexDirection: 'column', gap: '10px'}}>
          {resultsLoaded ? searchResults.map((result, index) => {
            return <Card searchResult={result}></Card>
          }) :
            <img src='public/soup.gif' style={{
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

export default App
