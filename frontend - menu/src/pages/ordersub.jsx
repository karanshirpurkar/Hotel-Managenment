import React, { useState, useEffect } from 'react';
import Ordersub_S from './ordersub.module.css';
import Search from '../assets/search.svg?react';
import { Createorder } from '../service/service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Ordersub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItems, setCartItems] = useState({});
    const [showInstructions, setShowInstructions] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeType, setActiveType] = useState('Dine In');
    const navigate = useNavigate();



    const [cust_detail, setcust_details] = useState({
        fullname: "",
        mobile: "",
        addr: null, // use null instead of none
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setcust_details((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const [startX, setStartX] = useState(null);
    const [swipeX, setSwipeX] = useState(0);

    const startSwipe = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        setStartX(x);
    };

    const swipeMove = (e) => {
        if (startX === null) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = x - startX;
        if (deltaX >= 0 && deltaX <= 250) {
            setSwipeX(deltaX);
        }
    };

    const endSwipe = async () => {
        if (validateDetails()) {
            const filteredCart = Object.entries(cartItems).map(([title, item]) => ({
                name: title,
                count: item.count
            }));

            const orderData = {
                cart: filteredCart,
                customer: {
                    mobile: cust_detail.mobile
                },
                duration: totalDuration,
                orderType: activeType,
                total_Price: grandTotal,
                status:"processing"
            };

            // ...existing code...
            console.log(orderData); // Or send this to your backend
            try {
                const res = await Createorder(orderData);
toast.success("Order placed successfully!");
                navigate("/"); // Redirect on success
                            setCartItems({});
            localStorage.removeItem('cartItems');
            setcust_details({
                fullname: "",
                mobile: "",
                addr: null,
            });
            setActiveType('Dine In');

            } catch (error) {
                alert("Order failed: " + (error?.response?.data?.message || error.message));
            }

            
        }

        setSwipeX(0);
        setStartX(null);
    };


    useEffect(() => {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            setCartItems(JSON.parse(storedItems));
        }
    }, []);

    const totalPrice = Object.values(cartItems).reduce((sum, item) => {
        const numericPrice = parseInt(item.price.replace('₹', '').trim(), 10);
        return sum + numericPrice * item.count;
    }, 0);

    const deliveryCharge = activeType === "Dine In" ? 0 : 50;
    const tax = 5;
    const grandTotal = totalPrice + deliveryCharge + tax;

    const totalDuration = Object.values(cartItems).reduce((sum, item) => {
        return sum + item.duration * item.count;
    }, 0);


    const incrementItem = (title) => {
        const updated = {
            ...cartItems,
            [title]: {
                ...cartItems[title],
                count: cartItems[title].count + 1,
            },
        };
        setCartItems(updated);
        localStorage.setItem('cartItems', JSON.stringify(updated));
    };

    const decrementItem = (title) => {
        if (cartItems[title].count > 1) {
            const updated = {
                ...cartItems,
                [title]: {
                    ...cartItems[title],
                    count: cartItems[title].count - 1,
                },
            };
            setCartItems(updated);
            localStorage.setItem('cartItems', JSON.stringify(updated));
        }
    };

    const removeItem = (title) => {
        const updated = { ...cartItems };
        delete updated[title];
        setCartItems(updated);
        localStorage.setItem('cartItems', JSON.stringify(updated));
    };

    const validateDetails = () => {
        if (activeType === 'Dine In') {
            if (!cust_detail.fullname.trim() || !cust_detail.mobile.trim()) {
                alert("Please enter both your name and mobile number.");
                return false;
            }
        } else if (activeType === 'Take Away') {
            if (!cust_detail.fullname.trim() || !cust_detail.mobile.trim() || !cust_detail.addr?.trim()) {
                alert("Please enter your name, mobile number, and address.");
                return false;
            }
        }
        return true;
    };

    return (
        <div className={Ordersub_S.main}>
            <h1>Good evening</h1>
            <h3>Place your order here</h3>
            <div className={Ordersub_S.searchBar}>
                <span className={Ordersub_S.searchIcon}><Search /></span>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="cart" style={{
                height: "150px",
                overflowY: "scroll",
                overflowX: "hidden"
            }}>
                {Object.values(cartItems).map(item => (
                    <div key={item.title} className={Ordersub_S.cartItem}>
                        <div>
                            <img src={item.img} alt={item.title} className={Ordersub_S.image} />
                            <p
                                style={{ fontSize: "10px", color: "#8C7B7B", cursor: "pointer", marginTop: "5px" }}
                                onClick={() => {
                                    setSelectedItem(item.title);
                                    setShowInstructions(true);
                                }}
                            >
                                Add cooking instructions (optional)
                            </p>
                        </div>
                        <div className={Ordersub_S.details}>
                            <div className={Ordersub_S.header}>
                                <h4>{item.title}</h4>
                                <button className={Ordersub_S.removeBtn} onClick={() => removeItem(item.title)}>✕</button>
                            </div>
                            <p className={Ordersub_S.price}>{item.price}</p>
                            <div className={Ordersub_S.controls}>
                                <p className={Ordersub_S.size}>14″</p>

                                <button onClick={() => decrementItem(item.title)}>-</button>
                                <span>{item.count}</span>
                                <button onClick={() => incrementItem(item.title)}>+</button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className={Ordersub_S.orderTypeWrapper}>
                <button
                    className={`${Ordersub_S.toggleButton} ${activeType === 'Dine In' ? Ordersub_S.active : ''}`}
                    onClick={() => setActiveType('Dine In')}
                >
                    Dine In
                </button>
                <button
                    className={`${Ordersub_S.toggleButton} ${activeType === 'Take Away' ? Ordersub_S.active : ''}`}
                    onClick={() => setActiveType('Take Away')}
                >
                    Take Away
                </button>
            </div>
            {activeType === "Dine In" && (
                <div>
                    <div className={Ordersub_S.summary}>
                        <div className={Ordersub_S.priceRow}>
                            <span>Item Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className={Ordersub_S.priceRow}>
                            <span>Taxes</span>
                            <span>₹{tax}</span>
                        </div>

                        <div className={Ordersub_S.grandTotal}>
                            <strong>Grand Total</strong>
                            <strong>₹{grandTotal}</strong>
                        </div>

                        <div className={Ordersub_S.Odetails}>
                            <h4>Your details</h4>
                            <p><input
                                style={{
                                    width: "100px",
                                    borderRadius: "20px",
                                    border: "1px solid #ffffff",
                                    backgroundColor: "#F0F5F3",
                                    padding: "5px",
                                    resize: "none",

                                }}
                                placeholder='Your Name'
                                className={Ordersub.deatilsinput}
                                type="text"
                                name="fullname"
                                value={cust_detail.fullname}
                                onChange={handleChange}
                            />

                                <input
                                    style={{
                                        width: "100px",
                                        borderRadius: "20px",
                                        border: "1px solid #ffffff",
                                        backgroundColor: "#F0F5F3",
                                        padding: "5px",
                                        resize: "none",

                                    }}
                                    placeholder='Monbile no.'
                                    className={Ordersub.deatilsinput}

                                    type="text"
                                    name="mobile"
                                    value={cust_detail.mobile}
                                    onChange={handleChange}
                                />


                            </p>

                        </div>
                        <div className={Ordersub_S.address}>
                            <p>⏱️ Delivery in <strong>{totalDuration} mins</strong></p>
                        </div>

                        {/* Swipe to Order UI */}

                    </div>
                    <div className={Ordersub_S.swipeContainer}>
                        <div className={Ordersub_S.swipeTrack}>
                            <div
                                className={Ordersub_S.swipeButton}
                                onMouseDown={startSwipe}
                                onMouseMove={swipeMove}
                                onMouseUp={endSwipe}
                                onTouchStart={startSwipe}
                                onTouchMove={swipeMove}
                                onTouchEnd={endSwipe}
                                style={{ transform: `translateX(${swipeX}px)` }}
                            >
                                <span className={Ordersub_S.arrow}>➜</span>
                            </div>
                            <span className={Ordersub_S.swipeText}>Swipe to Order</span>
                        </div>
                    </div>

                </div>

            )}
            {activeType === "Take Away" && (
                <div>
                    <div className={Ordersub_S.summary}>
                        <div className={Ordersub_S.priceRow}>
                            <span>Item Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className={Ordersub_S.priceRow}>
                            <span>Delivery Charge</span>
                            <span>₹{deliveryCharge}</span>
                        </div>
                        <div className={Ordersub_S.priceRow}>
                            <span>Taxes</span>
                            <span>₹{tax}</span>
                        </div>

                        <div className={Ordersub_S.grandTotal}>
                            <strong>Grand Total</strong>
                            <strong>₹{grandTotal}</strong>
                        </div>

                        <div className={Ordersub_S.Odetails}>
                            <h4>Your details</h4>
                            <p><input
                                style={{
                                    width: "100px",
                                    borderRadius: "20px",
                                    border: "1px solid #ffffff",
                                    backgroundColor: "#F0F5F3",
                                    padding: "5px",
                                    resize: "none",

                                }}
                                placeholder='Your Name'
                                className={Ordersub.deatilsinput}
                                type="text"
                                name="fullname"
                                value={cust_detail.fullname}
                                onChange={handleChange}
                            />

                                <input
                                    style={{
                                        width: "100px",
                                        borderRadius: "20px",
                                        border: "1px solid #ffffff",
                                        backgroundColor: "#F0F5F3",
                                        padding: "5px",
                                        resize: "none",

                                    }}
                                    placeholder='Monbile no.'
                                    className={Ordersub.deatilsinput}

                                    type="text"
                                    name="mobile"
                                    value={cust_detail.mobile}
                                    onChange={handleChange}
                                />


                            </p>

                        </div>
                        <div className={Ordersub_S.address}>
                            <p>📍 Delivery at <input
                                style={{
                                    width: "200px",
                                    borderRadius: "20px",
                                    border: "1px solid #ffffff",
                                    backgroundColor: "#F0F5F3",
                                    padding: "5px",
                                    resize: "none",

                                }}
                                className={Ordersub.deatilsinput}

                                placeholder='address'
                                type="text"
                                name="addr"
                                value={cust_detail.addr || ""}
                                onChange={handleChange}
                            /></p>
                            <p>⏱️ Delivery in <strong>{totalDuration} mins</strong></p>
                        </div>

                        {/* Swipe to Order UI */}

                    </div>
                    <div className={Ordersub_S.swipeContainer}>
                        <div className={Ordersub_S.swipeTrack}>
                            <div
                                className={Ordersub_S.swipeButton}
                                onMouseDown={startSwipe}
                                onMouseMove={swipeMove}
                                onMouseUp={endSwipe}
                                onTouchStart={startSwipe}
                                onTouchMove={swipeMove}
                                onTouchEnd={endSwipe}
                                style={{ transform: `translateX(${swipeX}px)` }}
                            >
                                <span className={Ordersub_S.arrow}>➜</span>
                            </div>
                            <span className={Ordersub_S.swipeText}>Swipe to Order</span>
                        </div>
                    </div>
                </div>

            )}



            {showInstructions && (
                <div className={Ordersub_S.modalOverlay}>
                    <button className={Ordersub_S.closeBtn} onClick={() => setShowInstructions(false)}>✕</button>

                    <div className={Ordersub_S.modal}>
                        <h3>Add Cooking instructions</h3>
                        <textarea
                            placeholder="Write your instructions here..."
                            rows="4"
                            className={Ordersub_S.textarea}
                        ></textarea>
                        <p className={Ordersub_S.note}>
                            The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won’t be possible.
                        </p>
                    </div>
                    <div className={Ordersub_S.buttonRow}>
                        <button onClick={() => setShowInstructions(false)} className={Ordersub_S.cancelBtn}>
                            Cancel
                        </button>
                        <button onClick={() => setShowInstructions(false)} className={Ordersub_S.nextBtn}>
                            Next
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}
