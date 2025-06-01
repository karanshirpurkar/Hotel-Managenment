import React, { useEffect, useState } from "react";
import { fetchTables, addTable, deleteTable } from "../service/service";
import styles from "./TableManager.module.css";
import Png_delete from "../assets/delete.png"; 
import { toast } from 'react-toastify';


export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [chairs, setChairs] = useState(3);
  const [search, setSearch] = useState(""); // 1. Add search state

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await fetchTables();
      setTables(data);
    } catch (error) {
      
      toast.error("Failed to fetch tables");



  
    }

  };

  // Add these inside your TableManager component

// Add Table
const handleAddTable = async () => {
  try {
    // Example: replace with your actual addTable API and state logic
    const newTable = await addTable({ number: tables.length + 1, chairs });
    setTables([...tables, newTable]);
    setShowAddForm(false);
  } catch (error) {
toast.error("Failed to add table");

  }
};

// Delete Table
const handleDeleteTable = async (tableId) => {
  if (!window.confirm("Are you sure you want to delete this table?")) return;
  try {
    await deleteTable(tableId);
    setTables(tables.filter(t => t._id !== tableId));
        loadTables();

  } catch (error) {
toast.error("Failed to delete table");
  }
};
  // ...existing handlers...

  // 2. Filter tables by search
  const filteredTables = tables.filter(table =>
    String(table.number).padStart(2, "0").includes(search.trim())
  );

  return (
    <div className={styles.container}>
      
      <h2>Tables</h2>
      {/* 3. Search input */}
       <div >
      <input
        type="text"
        placeholder="Search by table number"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          position:"absolute",
          top: "20px",
          left: "115px",
          height:"35px",
          padding: "8px 16px",
          borderRadius: "50px",
          border: "0px solid #ccc",
          width: 320,
          fontSize: 15
        }}
      />
    </div>
      <div className={styles.grid}>
        {filteredTables.map((table) => (
          <div key={table._id} className={styles.tableCard}>
            <button onClick={() => handleDeleteTable(table._id)} title="Delete table"><img src={Png_delete} alt="" /></button>
            <div><h1>Table</h1><h1> {String(table.number).padStart(2, "0")}</h1></div>
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column"
            }}>🪑 {String(table.chairs).padStart(2, "0")}</div>
          </div>
        ))}
        <div className={styles.addCard} onClick={() => setShowAddForm(true)}>
          +
        </div>
        {showAddForm && (
          // ...existing add form code...
          // (no changes needed here)
          <div
            style={{
              backgroundColor: "#f0f2f5",
              borderRadius: "18px",
              padding: "15px",
              textAlign: "center",
              fontWeight: "bold",
              position: "absolute",
              left: "45%",
              bottom: "10px",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "150px",
              overflow: "visible",
              minHeight: 127,
              minWidth: 147,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}
          >
            {/* ...add form content... */}
            <div>Table name (optional)</div>
            <input
              type="text"
              value={String((tables.length > 0 ? Math.max(...tables.map(t => t.number)) : 0) + 1).padStart(2, "0")}
              style={{
                fontSize: 32,
                margin: "8px 0",
                textAlign: "center",
                border: "none",
                borderBottom: "2px dotted #888",
                background: "transparent",
                fontWeight: "bold",
                outline: "none",
                width: "100%"
              }}
            />
            <div>Chair</div>
            <select
              value={chairs}
              onChange={e => setChairs(Number(e.target.value))}
              style={{ fontSize: 18, margin: "8px 0" }}
            >
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <button
                style={{ width: "100%", position: "relative", backgroundColor: "#505050", color: "white", border: "none", padding: "8px 20px", borderRadius: "15px", cursor: "pointer", marginTop: "5px" }}
                onClick={handleAddTable}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}