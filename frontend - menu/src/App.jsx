import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Order from "./pages/order"
import Ordersub from './pages/ordersub'

function App() {
  return (
        <>
      <ToastContainer position="top-right" autoClose={3000} />

    <Router>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/order" element={<Ordersub />} />






      </Routes>
    </Router>
  </>
  )
}

export default App
