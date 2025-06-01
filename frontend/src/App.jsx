import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OrderList from './pages/Orderlist'
import OrderCard from './pages/orderstatus'
import TableManager from './pages/table'
import Dashboard from './pages/dashboard'

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/orderlist" element={<OrderList />} />
          <Route path="/ordercard" element={<OrderCard />} />
          <Route path="/table" element={<TableManager />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App