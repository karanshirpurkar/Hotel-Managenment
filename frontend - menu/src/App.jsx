import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Order from "./pages/order"
import Ordersub from './pages/ordersub'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/order" element={<Ordersub />} />






      </Routes>
    </Router>
  )
}

export default App
