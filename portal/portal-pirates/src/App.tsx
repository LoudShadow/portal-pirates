import { useRef } from 'react'
// import './App.css'
import { AppPhoneWrapper } from './Components/AppWrapper/AppWrapper'
import { PriceGuesser } from './Components/PriceGuesser'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'

const transactions = [
  { merchant: 'Tescos', price: 10, time: '2025-11-10T10:00:00Z' },
  { merchant: 'Tescos', price: 12, time: '2025-11-10T10:00:00Z' },
  { merchant: 'Tescos', price: 11, time: '2025-11-10T10:00:00Z' },
]

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppPhoneWrapper ref={wrapperRef}>
        <PriceGuesser transactions={transactions} container={wrapperRef} />
      </AppPhoneWrapper>
    </ThemeProvider>
  )
}

export default App
