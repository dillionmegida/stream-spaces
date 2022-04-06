import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Startpage from './views/StartPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
      </Routes>
    </Router>
  )
}
