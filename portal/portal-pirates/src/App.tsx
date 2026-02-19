import { useRef, useState } from 'react'
// import './App.css'
import { AppPhoneWrapper } from './Components/AppWrapper/AppWrapper'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { PageController } from './Components/PageController'
import { AuthProvider } from './Components/AuthContext'


function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showSplash, setShowSplash] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppPhoneWrapper ref={wrapperRef} disableScroll={showSplash}>
          <PageController showSplash={showSplash} setShowSplash={setShowSplash} />
        </AppPhoneWrapper>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
