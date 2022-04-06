import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StartPage from './views/StartPage'
import SpacesPage from './views/SpacesPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
      </Routes>
    </Router>
  )
}
