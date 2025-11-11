import { useRef } from 'react'
// import './App.css'
import { AppPhoneWrapper } from './Components/AppWrapper/AppWrapper'
import { PriceGuesser } from './Components/PriceGuesser'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { ResultsPage } from './Components/ResultsPage'
import { PageController } from './Components/PageController'

const transactions = [
  {
    merchant: "Pret A Manger",
    price: 3.21,
    time: "2025-11-10T08:35:00Z",
  },
  {
    merchant: "Starbucks",
    price: 9.50,
    time: "2025-11-10T11:19:00Z",
  },
  {
    merchant: "Tesco Express",
    price: 18.00,
    time: "2025-11-10T12:23:00Z",
  },
  {
    merchant: "Sainsbury's Local",
    price: 5.75,
    time: "2025-11-10T15:42:00Z",
  },
  {
    merchant: "Boots",
    price: 12.99,
    time: "2025-11-10T18:10:00Z",
  },
]

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppPhoneWrapper ref={wrapperRef}>
        <PriceGuesser transactions={transactions} />
      </AppPhoneWrapper>
    </ThemeProvider>
  )
}

export default App
