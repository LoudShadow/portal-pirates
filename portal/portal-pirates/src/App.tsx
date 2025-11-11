import { useRef } from 'react'
// import './App.css'
import { AppPhoneWrapper } from './Components/AppWrapper/AppWrapper'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { PageController } from './Components/PageController'


function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppPhoneWrapper ref={wrapperRef}>
        <PageController/>
      </AppPhoneWrapper>
    </ThemeProvider>
  )
}

export default App
