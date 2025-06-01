import React, { useEffect, useState } from 'react';
import { allOrdersWithTable } from '../service/service';
import OrderCard from './orderstatus';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await allOrdersWithTable();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "50px", padding: "24px", backgroundColor: "white", borderRadius: "46px" }}>
            <h1 style={{ fontSize: "31px", color: "#565656", position: "absolute", top: "10px", left: "135px" }}>Order Line</h1>
            {orders.map((order, idx) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    index={idx}
                />
            ))}
        </div>
    );
};

export default OrderList;