import { useRef } from 'react'
// import './App.css'
import { AppPhoneWrapper } from './Components/AppWrapper/AppWrapper'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { PageController } from './Components/PageController'
import { AuthProvider } from './Components/AuthContext'


function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppPhoneWrapper ref={wrapperRef}>
          <PageController/>
        </AppPhoneWrapper>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
