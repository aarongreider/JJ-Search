import { useEffect,/*  useState */ } from 'react'
import './App.css'
import { fetchData } from './utils'

function App() {
  //const [data, setData] = useState()

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <div>
      </div>
    </>
  )
}

export default App
