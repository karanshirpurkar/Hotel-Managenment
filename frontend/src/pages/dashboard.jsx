import React, { useState, useEffect } from 'react';
import Dash from './dashboard.module.css';
import Png_analytics from '../assets/analytics.png';
import Png_table from '../assets/tables.png';
import Png_orders from '../assets/orders.png';
import Png_menu from '../assets/menu.png';
import RevenueChart from './analytics';
import TableManager from './table';
import OrderList from './Orderlist';
import OrderDesktop from './menu';


const tabs = [
  { name:'Analytics', img: Png_analytics, key: 'analytics' },
  { name: 'Tables', img: Png_table, key: 'tables' },
  { name: 'Orders', img: Png_orders, key: 'orders' },
  { name: 'Menu', img: Png_menu, key: 'menu' }

];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'analytics'; // default is 'dashboard'
    });        useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);
  return (
    <div className={Dash.main}>
      <div>
      <div style={{width:"65px", height:"65px",borderRadius:"50px",backgroundColor:"white", marginBottom:"7px"}}></div>
      <div className={Dash.nav}>
{tabs.map(tab => (
  <div
    className={`${Dash.tab} ${activeTab === tab.key ? Dash.activeTab : ''}`}
    key={tab.key}
    onClick={() => setActiveTab(tab.key)}
    style={{ cursor: "pointer" }}
  >
    <img src={tab.img} alt={tab.name} />
  </div>
))}
      </div>
      </div>
      <div>
        <div style={{height:"65px"}}></div>
      <div className={Dash.content}>
        {activeTab === 'analytics' && <RevenueChart />}
        {activeTab === 'tables' && <TableManager />}
        {activeTab==='orders' && <OrderList/>}
        {activeTab === 'menu' && <OrderDesktop />}
      </div>
      </div>
    </div>
  );
}