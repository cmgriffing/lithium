import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import Header from '~/components/Header'
import Footer from './components/Footer'
import '@fontsource/bungee-inline'
import '@fontsource/roboto'
import './app.css'

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <Header />
          <Suspense>{props.children}</Suspense>
          <Footer />
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
