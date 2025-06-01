import React, { useState } from 'react';
import styles from './orderstatus.module.css';
import { updatepickedup } from '../service/service';
import Done from '../assets/done.svg?react';


function getRemaining(order) {
  if (!order) return '';
  const createdAt = new Date(order.createdAt);
  const now = new Date();
  const elapsed = Math.floor((now - createdAt) / 60000); // minutes
  const remaining = order.duration - elapsed;
  return remaining > 0 ? `${remaining} Min` : 'Done';
}

export default function OrderCard({ order, index }) {
  // State for picked up status (default: from order)
  const [pickedUp, setPickedUp] = useState(order.pickedUp ? "Picked Up" : "Not Picked Up");

  // Handle select change and update backend
  const handlePickedUpChange = async (e) => {
    const value = e.target.value;
    setPickedUp(value);
    try {
      await updatepickedup(order._id, value === "Picked Up");
    } catch (err) {
      // Optionally handle error
    }
  };

  // Determine background color
  let orderTypecolor = "#FF9500";
  let statusgbg = "#FDC474";
  let cardBg = "#fff4e6"; // default
  if (order.status === 'processing') {
    cardBg = "#FFE3BC"; statusgbg = '#FDC474'; orderTypecolor = '#FF9500';
  } else if (order.status === 'Done' && order.orderType === 'Dine In') {
    cardBg = "#FFE3BC"; statusgbg = '#31FF65'; orderTypecolor = '#34C759';
  } else if (order.status === 'Done' && order.orderType === 'Take Away') {
    cardBg = "#C2D4D9"; statusgbg = '#9BAEB3'; orderTypecolor = '#3181A3';
  }

  return (
    <div className={styles.card} style={{ backgroundColor: cardBg }}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.info}>
          <span className={styles.icon}>🍴</span>
          <div>
            <div className={styles.number}>
              # {String(index + 1).padStart(2, "0")}
            </div>            <div className={styles.tableTime}>
              {order.orderType === "Take Away"
                ? "Take Away"
                : `Table-${order.table?.toString().padStart(2, "0") || "--"}`}
              <br />
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={styles.items}>{order.cart?.length || 0} Item</div>
          </div>
        </div>
        <div className={styles.type} style={{ backgroundColor: cardBg }}>
          <div style={{ color: orderTypecolor, fontSize: '10px' }}>{order.orderType || "Type"}</div>
<div className={styles.ongoing} style={{ color: "#2C2C2E", fontSize: '8.5px' }}>
  {order.status === 'Done' && order.orderType === 'Take Away' ? (
    order.pickedUp ? (
      <span>Picked Up</span>
    ) : (
      <select
        value={pickedUp}
        onChange={handlePickedUpChange}
        style={{ fontSize: '10px', borderRadius: 6, padding: '2px 6px', marginTop: 2 }}
      >
        <option value="Not Picked Up">Not Picked Up</option>
        <option value="Picked Up">Picked Up</option>
      </select>
    )
  ) : (
    <>Ongoing: {order.status === 'processing' ? getRemaining(order) : 'Done'}</>
  )}
</div>
        </div>
      </div>

      {/* Items */}
      <div className={styles.itemsBox}>
        {order.cart && order.cart.map((item, idx) => (
          <div key={idx} className={styles.mealTitle}>
            {item.count} x {item.name}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.status} style={{ backgroundColor: statusgbg }}>
        {order.status === 'processing'
          ? <span>Processing <span role="img" aria-label="hourglass">⏳</span></span>
          : <span style={{display:"flex", justifyContent:"center", alignItems:"center"}}><p style={{margin:"0px 5px 0px 5px"}}>Done</p><div> <Done /></div></span>
        }
      </div>
    </div>
  );
}