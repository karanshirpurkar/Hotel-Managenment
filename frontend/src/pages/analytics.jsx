import React, { useState, useEffect } from 'react';
import {
 Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AllData, fetchTables, fetchChefs } from '../service/service';
import analytics from './analytics.module.css';
import Png_chef from '../assets/totalchef.png';
import Png_client from '../assets/totalclients.png';
import Png_order from '../assets/totalorders.png';
import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';


// Helper functions for grouping
const getDayKey = dateStr =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const getWeekKey = dateStr => {
  const date = new Date(dateStr);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${week}`;
};

const getMonthKey = dateStr => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const aggregateData = (data, mode) => {
  const getKey = mode === 'daily' ? getDayKey : mode === 'weekly' ? getWeekKey : getMonthKey;
  const result = {};
  data.forEach(({ datetime, price }) => {
    const key = getKey(datetime);
    result[key] = (result[key] || 0) + price;
  });
  return Object.entries(result).map(([key, revenue]) => ({
    period: key,
    revenue
  }));
};

function filterOrdersByMode(orders, mode) {
  const now = new Date();
  if (mode === 'daily') {
    return orders.filter(order => {
      const d = new Date(order.createdAt);
      return d.toDateString() === now.toDateString();
    });
  }
  if (mode === 'weekly') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    return orders.filter(order => {
      const d = new Date(order.createdAt);
      return d >= weekAgo && d <= now;
    });
  }
  if (mode === 'monthly') {
    return orders.filter(order => {
      const d = new Date(order.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }
  return orders;
}

const RevenueChart = () => {
  const [mode, setMode] = useState('daily');
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [pieMode, setPieMode] = useState('daily');
  const [search, setSearch] = useState('');




  const distinctMobiles = new Set(orders.map(order => order.customer.mobile));
  const totalDistinctMobiles = distinctMobiles.size;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_Price || 0), 0);
  const filteredOrders = filterOrdersByMode(orders, pieMode);

  const COLORS = ['#5B5B5B', '#2C2C2C', '#828282']; // Customize as needed
const served = filteredOrders.filter(order => order.pickedUp).length;
const dineIn = filteredOrders.filter(order => order.orderType === 'Dine In').length;
const takeAway = filteredOrders.filter(order => order.orderType === 'Take Away').length;
  const pieData = [
    { name: 'Served', value: served },
    { name: 'Dine In', value: dineIn },
    { name: 'Take Away', value: takeAway },
  ];

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await AllData();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    async function loadTables() {
      try {
        const data = await fetchTables();
        setTables(data);
      } catch (e) {
        setTables([]);
      }
    }
    loadTables();
  }, []);

  useEffect(() => {
    async function loadChefs() {
      try {
        const data = await fetchChefs();
        setChefs(data);
      } catch (e) {
        setChefs([]);
      }
    }
    loadChefs();
  }, []);




  const percent = (val) => filteredOrders.length ? Math.round((val / filteredOrders.length) * 100) : 0;
  // Transform orders to chart data
  const chartData = aggregateData(
    orders.map(order => ({
      datetime: order.createdAt,
      price: order.total_Price
    })),
    mode
  );

  // Optional: Format the X axis label for better readability
  const formatXAxis = tick => {
    if (mode === 'monthly') {
      const [year, month] = tick.split('-');
      return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    }
    if (mode === 'weekly') {
      return tick.replace('-', '\n');
    }
    return tick;
  };

  return (
    <div className={analytics.container}>
      <h1>Analytics</h1>
      <div >
        <input
          type="text"
          placeholder="Filter (e.g. Order Summary, Revenue, Tables)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            position: "absolute",
            top: "20px",
            left: "115px",
            height: "35px",
            padding: "8px 16px",
            borderRadius: "50px",
            border: "0px solid #ccc",
            width: 320,
            fontSize: 15
          }}
        />
      </div>
      {/* If search is empty, show all sections */}
      {search.trim() === "" && (
        <>
          <div className={analytics.details}>
            <div className={analytics.detail}>
              <div className={analytics.images}>
                <img src={Png_chef} alt="Total Chefs" />
              </div>
              <div className={analytics.summary}>
                <h4>04</h4>
                <p>TOTAL CHEF</p>
              </div>
            </div>

            <div className={analytics.detail}>
              <div className={analytics.images}>
                <img src={Png_chef} alt="Total Chefs" />
              </div>
              <div className={analytics.summary}>
                <h4>{totalRevenue}</h4>
                <p>TOTAL REVENU</p>
              </div>
            </div>


            <div className={analytics.detail}>
              <div className={analytics.images}>
                <img src={Png_order} alt="Total Orders" />
              </div>
              <div className={analytics.summary}>
                <h4></h4>
                <h4>{totalOrders}</h4>
                <p>TOTAL ORDERS</p>
              </div>
            </div>

            <div className={analytics.detail}>
              <div className={analytics.images}>
                <img src={Png_client} alt="Total Clients" />
              </div>
              <div className={analytics.summary}>
                <h4>{totalDistinctMobiles}</h4>
                <p>TOTAL CLIENTS </p>
              </div>
            </div>
          </div>

          <div className={analytics.chartContainer}>
            <div className={analytics.analyses}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <div>
                  <h2>Order Summary</h2>
                  <p>Analyze your order types over time.</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <select
                    value={pieMode}
                    onChange={e => setPieMode(e.target.value)}
                    style={{
                      fontSize: 14,
                      padding: "4px 12px",
                      borderRadius: 6,
                      backgroundColor: "#white",
                      border: "1px solid #e0e0e0",
                      minWidth: 90,
                      color: "#B9B8BE",
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', color: "#7B7E81", justifyContent: 'space-between', margin: '16px 0', gap: "35px" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                    <div style={{ fontSize: 24, fontWeight: 600 }}>{totalOrders.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Served</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                    <div style={{ fontSize: 24, fontWeight: 600 }}>{dineIn.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Dine In</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                    <div style={{ fontSize: 24, fontWeight: 600 }}>{takeAway.toString().padStart(2, '0')}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>Take Away</div>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                  <div>

                    <PieChart width={120} height={120}>
                      <Pie
                        data={pieData}
                        cx={60}
                        cy={60}
                        innerRadius={32}
                        outerRadius={55}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  {/* Percentage bars */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ width: 80 }}>Take Away</span>
                      <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(takeAway)}%)</span>
                      <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                        <div style={{
                          width: `${percent(takeAway)}%`,
                          background: COLORS[2],
                          height: 8,
                          borderRadius: 8
                        }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ width: 80 }}>Served</span>
                      <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(served)}%)</span>
                      <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                        <div style={{
                          width: `${percent(served)}%`,
                          background: COLORS[0],
                          height: 8,
                          borderRadius: 8
                        }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 80 }}>Dine in</span>
                      <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(dineIn)}%)</span>
                      <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                        <div style={{
                          width: `${percent(dineIn)}%`,
                          background: COLORS[1],
                          height: 8,
                          borderRadius: 8
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>




            <div className={analytics.analyses}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>

                <div>
                  <h2>Revenue Analysis</h2>
                  <p>Analyze your revenue trends over time.</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                    style={{
                      fontSize: 16,
                      padding: "6px 18px 6px 8px",
                      borderRadius: 8,
                      backgroundColor: "#white",
                      border: "1px solid #e0e0e0",
                      float: "right",
                      marginTop: -8,
                      marginBottom: 8,
                      minWidth: 100,
                      color: "#B9B8BE",
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div style={{ backgroundColor:"white", borderRadius:"10px",display: 'flex', marginTop:"5px", justifyContent: 'center', alignItems: 'center'}}>
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="period" tickFormatter={formatXAxis} />
    <YAxis tick={false} axisLine={false} />
    <Tooltip />
    {/* <Legend /> */}
    <Bar dataKey="revenue" fill="#b3c6ff" barSize={32} radius={[8, 8, 0, 0]} />
    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>
              </div>
            </div>

            <div className={analytics.analyses}>
              <div style={{ display: 'flex',gap:"75px",height:"68.8px", alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
              <div><h2>Tables</h2></div>
              <div className={analytics.tableLegend}>
                <div className={analytics.tableLegendItem}>
                  <span className={analytics.tableDotReserved} />
                  <span style={{ fontSize: 13 }}>Reserved</span>
                </div>
                
                <div className={analytics.tableLegendItem}>
                  <span className={analytics.tableDotAvailable} />
                  <span style={{ fontSize: 13 }}>Available</span>
                </div>

              </div>
              
              </div>
                

              <div className={analytics.tableGrid}>
                {tables.map((table) => (
                  <div
                    key={table._id}
                    className={
                      table.status === "occupied"
                        ? `${analytics.tableCard} ${analytics.tableCardReserved}`
                        : analytics.tableCard
                    }
                  >
                    Table<br />
                    {String(table.number).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div className={analytics.chef}>
            <table className={analytics.chefTable}>
              <thead>
                <tr>
                  <th>Chef Name</th>
                  <th>Order Taken</th>
                </tr>
              </thead>
              <tbody>
                {chefs.map(chef => (
                  <tr key={chef._id}>
                    <td>{chef.name}</td>
                    <td>{String(chef.orders ? chef.orders.length : 0).padStart(2, "0")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {search.trim() !== "" && (
        <>
          {search.toLowerCase().includes("order") && (
            <div className={analytics.chartContainer}>
              <div className={analytics.analyses}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                  <div>
                    <h2>Order Summary</h2>
                    <p>Analyze your order types over time.</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <select
                      value={pieMode}
                      onChange={e => setPieMode(e.target.value)}
                      style={{
                        fontSize: 14,
                        padding: "4px 12px",
                        borderRadius: 6,
                        backgroundColor: "#white",
                        border: "1px solid #e0e0e0",
                        minWidth: 90
                      }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', color: "#7B7E81", justifyContent: 'space-between', margin: '16px 0', gap: "35px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{totalOrders.toString().padStart(2, '0')}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Served</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{dineIn.toString().padStart(2, '0')}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Dine In</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "7px", width: '98px', height: '70px', backgroundColor: "white" }}>
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{takeAway.toString().padStart(2, '0')}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Take Away</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                    <div>

                      <PieChart width={120} height={120}>
                        <Pie
                          data={pieData}
                          cx={60}
                          cy={60}
                          innerRadius={32}
                          outerRadius={55}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                    {/* Percentage bars */}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ width: 80 }}>Take Away</span>
                        <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(takeAway)}%)</span>
                        <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                          <div style={{
                            width: `${percent(takeAway)}%`,
                            background: COLORS[2],
                            height: 8,
                            borderRadius: 8
                          }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ width: 80 }}>Served</span>
                        <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(served)}%)</span>
                        <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                          <div style={{
                            width: `${percent(served)}%`,
                            background: COLORS[0],
                            height: 8,
                            borderRadius: 8
                          }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: 80 }}>Dine in</span>
                        <span style={{ width: 40, fontSize: 12, color: '#888' }}>({percent(dineIn)}%)</span>
                        <div style={{ flex: 1, background: 'white', width: "70px", borderRadius: 8, height: 8, marginLeft: 8 }}>
                          <div style={{
                            width: `${percent(dineIn)}%`,
                            background: COLORS[1],
                            height: 8,
                            borderRadius: 8
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {search.toLowerCase().includes("revenue") && (
            <div className={analytics.chartContainer}>
              <div className={analytics.analyses}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>

                <div>
                  <h2>Revenue Analysis</h2>
                  <p>Analyze your revenue trends over time.</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                    style={{
                      fontSize: 16,
                      padding: "6px 18px 6px 8px",
                      borderRadius: 8,
                      backgroundColor: "#white",
                      border: "1px solid #e0e0e0",
                      float: "right",
                      marginTop: -8,
                      marginBottom: 8,
                      minWidth: 100
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div style={{ backgroundColor:"white", borderRadius:"10px",display: 'flex', marginTop:"5px", justifyContent: 'center', alignItems: 'center'}}>
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="period" tickFormatter={formatXAxis} />
    <YAxis tick={false} axisLine={false} />
    <Tooltip />
    {/* <Legend /> */}
    <Bar dataKey="revenue" fill="#b3c6ff" barSize={32} radius={[8, 8, 0, 0]} />
    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>
              </div>
            </div>
            </div>
          )}
          {search.toLowerCase().includes("table") && (
            <div className={analytics.chartContainer}>
              <div className={analytics.analyses}>
                <h2>Tables</h2>
                <div className={analytics.tableLegend}>
                  <div className={analytics.tableLegendItem}>
                    <span className={analytics.tableDotReserved} />
                    <span style={{ fontSize: 13 }}>Reserved</span>
                  </div>
                  <div className={analytics.tableLegendItem}>
                    <span className={analytics.tableDotAvailable} />
                    <span style={{ fontSize: 13 }}>Available</span>
                  </div>
                </div>
                <div className={analytics.tableGrid}>
                  {tables.map((table) => (
                    <div
                      key={table._id}
                      className={
                        table.status === "occupied"
                          ? `${analytics.tableCard} ${analytics.tableCardReserved}`
                          : analytics.tableCard
                      }
                    >
                      Table<br />
                      {String(table.number).padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Optionally, show a message if nothing matches */}
          {!["order", "revenue", "table"].some(key =>
            search.toLowerCase().includes(key)
          ) && (
              <div style={{ margin: 32, fontSize: 18, color: "#888" }}>
                No matching section found.
              </div>
            )}
        </>
      )}
    </div>
  );

};

export default RevenueChart;
