import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContext } from './components/Context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext.Provider value={{state:{}}}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}
