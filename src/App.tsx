import { useEffect, useState } from 'react'
import { NumResultsIncriment, SearchParams, SearchResult, setDevelopmentStyles, setWPStyles } from './utils'
import { getSearchData as fetchSearchData } from './utils-fetch'
import { orderItems, getPaginated } from './utils-filter'
import { Card } from './components/Card/Card'
import SearchControls from './components/Search Controls/SearchControls'
import './App.css'
import LoadingIndicator from './components/LoadingIndicator'



export default function App() {
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', sort: '', dept: '', store: '', showOOS: false })

  const [initialResultsLoaded, setInitialResultsLoaded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)

  const [searchResults, setSearchResult] = useState<SearchResult[]>([])
  const [paginatedResults, setPaginatedResults] = useState<SearchResult[]>([])
  const [numResultsToDisplay, setNumResultsToDisplay] = useState<number>(NumResultsIncriment)
  const [totalServerMatches, setTotalServerMatches] = useState<number>(0)

  const [numItemsOutOfStock, setNumItemsOutOfStock] = useState<number>(0)

  useEffect(() => {
    import.meta.env.PROD ? undefined : setDevelopmentStyles()
    console.log("version .8");
    setTimeout(setWPStyles, 500);
  }, [])

  /* useEffect(() => {
    console.log('')

    console.log(`results before filtering ${orderItems(searchParams, searchResults).length}`, orderItems(searchParams, searchResults));
    console.log(`results after filtering ${paginatedResults.length}`);
    console.log(`slice length ${numResultsToDisplay}`);
    console.log(`fetch incriment ${NumResultsToFetch} // total fetched ${searchResults.length}`);


    console.log(`searchResults.length >= totalServerMatches,`, searchResults.length, totalServerMatches, searchResults.length >= totalServerMatches);
  }) */

  useEffect(() => {
    const filteredItems = orderItems(searchParams, searchResults) // untruncated unsliced

    if (searchResults.length % 1000 > 0) {
      // if total fetched has a remainder, then all results have been fetched
    }
    else if ((numResultsToDisplay >= searchResults.length - NumResultsIncriment)) {
      getSearchResult(true)
    } else if ((filteredItems.length <= numResultsToDisplay)) {
      getSearchResult(true)
    }

    setPaginatedResults(getPaginated(searchParams, searchResults, numResultsToDisplay))

    let outOfStock = searchResults.filter((result) => result.FF_InStock === false && result.EG_InStock === false).length
    setNumItemsOutOfStock(outOfStock)

  }, [searchResults, searchParams, numResultsToDisplay])

  useEffect(() => {
    getSearchResult(false)
    setNumResultsToDisplay(NumResultsIncriment)
  }, [triggerSearch])


  const getSearchResult = async (append: boolean) => {
    try {
      if (append) {
        setLoading(true)
        const data = await fetchSearchData(searchParams.query, searchResults.length)
        setSearchResult([...searchResults, ...data.value as SearchResult[]]);
        setLoading(false)
      } else {
        setInitialResultsLoaded(false)
        setLoading(true)
        const data = await fetchSearchData(searchParams.query)
        setSearchResult(data.value as SearchResult[]);
        setTotalServerMatches(data['@odata.count'])
        setInitialResultsLoaded(true)
        setLoading(false)
      }
    } catch (e) {
      console.log("Error fetching search data", e);
    }
  }


  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative', maxWidth: '800px' }}>

        <SearchControls
          searchParams={searchParams}
          searchResults={searchResults}
          totalServerMatches={totalServerMatches}
          numUp={paginatedResults.length}
          numItemsOutOfStock={numItemsOutOfStock}
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
          setSearchParams={setSearchParams}>
        </SearchControls>

        {/* SEARCH RESULTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {initialResultsLoaded ? paginatedResults.map((result, index) => {
            return <Card key={index} searchResult={result}></Card>
          }) : undefined}
        </div>

        {loading ?
          <LoadingIndicator />
          : searchResults.length <= totalServerMatches && (orderItems(searchParams, searchResults).length > paginatedResults.length)
            ? <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 10px 10px 20px'
            }}
              onClick={() => {
                setNumResultsToDisplay(numResultsToDisplay + NumResultsIncriment)
              }}> Load More <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_downward</span></button>
            : <p>no more items to load</p>
        }


      </div>
    </>
  )
}
