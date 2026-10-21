import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import { AppRoutes } from './app/routes'
import { AppLayout } from './components/layout/AppLayout'

export default function App() {
  return <BrowserRouter><AuthProvider><AppLayout><AppRoutes /></AppLayout></AuthProvider></BrowserRouter>
}
