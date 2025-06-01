import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuS from './menu.module.css';

import Drink from '../assets/drink.svg?react';
import Burger from '../assets/burger.svg?react';
import Fries from '../assets/fries.svg?react';
import Pizza from '../assets/pizza.svg?react';
import Veggies from '../assets/veg.svg?react';
import Search from '../assets/search.svg?react';

export default function OrderDesktop() {
    const [selectedCategory, setSelectedCategory] = useState('pizza');
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const menu = {
        pizza: [
            { title: 'Capricciosa', price: '₹ 200', img: 'https://cdn.tasteatlas.com/images/dishes/6b28b438a3b64a7e9fca9081c89f07ff.jpg?mw=2000', duration: 10 },
            { title: 'Sicilian', price: '₹ 150', img: 'https://www.francolania.com/wp-content/uploads/2021/01/O73X5SVTHVAIRDVXU7VU4TF4Q4-edit.jpg', duration: 12 },
            { title: 'Marinara', price: '₹ 90', img: 'https://tse4.mm.bing.net/th/id/OIP.zpPaqWib6FoMw5sXcSW96gHaEc?pid=ImgDet&w=474&h=284&rs=1', duration: 15 },
            { title: 'Pepperoni', price: '₹ 300', img: 'https://thumbs.dreamstime.com/b/delicious-popular-pizza-pepperoni-wooden-board-delicious-popular-pepperoni-pizza-wooden-board-218054715.jpg', duration: 10 },
            { title: 'Marara', price: '₹ 200', img: 'https://th.bing.com/th/id/R.f30faa59aecdf250bd2a203242c2b78c?rik=6xGc2lMhsMlZcA&riu=http%3a%2f%2fwww.chefericette.com%2fwp-content%2fuploads%2f2020%2f07%2fRicetta-Pizza-Marinara-ai-quattro-pomodori-chef-Cristian-Marasco.jpg&ehk=J8JOPqJojkX5CLWlZAWK7ksgJo7AEb8ZZ0GhPqvh7Bw%3d&risl=&pid=ImgRaw&r=0', duration: 10 },
            { title: 'Panner chessey', price: '₹ 200', img: 'https://product-assets.faasos.io/production/product/image_1658292992976_Double_Paneer_Supreme_Medium_.jpg', duration: 15 },
        ],
        veggies: [
            { title: 'Greek Salad', price: '₹ 120', img: 'https://tse4.mm.bing.net/th/id/OIP.5OUYKMe948TIuIPxrS26AQHaHL?rs=1&pid=ImgDetMain', duration: 20 },
            { title: 'Caesar Salad', price: '₹ 140', img: 'https://th.bing.com/th/id/OIP.V3PBpJ34-OZB9aEeGM9cWQHaLH?w=204&h=306&c=7&r=0&o=5&dpr=1.3&pid=1.7', duration: 24 },
            { title: 'Sprout Mix', price: '₹ 80', img: 'https://images.indianexpress.com/2018/05/sprouted_moong_dal_salad-759.jpg?resize=450', duration: 20 },
            { title: 'Grilled Veggies', price: '₹ 100', img: 'https://th.bing.com/th/id/OIP._CMQmhDszVwlQyFCchLZbQHaLH?w=204&h=306&c=7&r=0&o=5&dpr=1.3&pid=1.7', duration: 15 },
        ],
        fries: [
            { title: 'Classic Fries', price: '₹ 70', img: 'https://th.bing.com/th/id/OIP.wDeoDXbJQxruL5X1IVBRmAHaEK?w=325&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7', duration: 10 },
            { title: 'Peri Peri Fries', price: '₹ 90', img: 'https://tse4.mm.bing.net/th/id/OIP.QOVleRCBBGhkcXTCG6FMvgHaE8?rs=1&pid=ImgDetMain', duration: 12 },
            { title: 'Cheesy Fries', price: '₹ 110', img: 'https://bluemist.sg/wp-content/uploads/2021/08/Appetizer-_-Snacks-Cheesy-Fries.jpg', duration: 15 },
            { title: 'Masala Fries', price: '₹ 85', img: 'https://th.bing.com/th/id/OIP.gMu0bXPpNRYW0vB3jzU2VwHaEK?w=208&h=117&c=7&r=0&o=5&dpr=1.3&pid=1.7', duration: 10 },
        ],
        burgers: [
            { title: 'Cheese Burger', price: '₹ 120', img: 'https://brookrest.com/wp-content/uploads/2020/05/AdobeStock_282247995-scaled.jpeg', duration: 10 },
            { title: 'Veg Burger', price: '₹ 80', img: 'https://www.blondelish.com/wp-content/uploads/2019/02/Easy-Veggie-Burger-Recipe-Vegan-Healthy-9.jpg', duration: 15 },
            { title: 'Chicken Burger', price: '₹ 150', img: 'https://mydario.com/wp-content/uploads/2017/10/Chicken-Burgers.jpg', duration: 18 },
            { title: 'Double Patty Burger', price: '₹ 200', img: 'https://tse2.mm.bing.net/th/id/OIP.WWrEwq7-WknaLPD0HTevmAAAAA?rs=1&pid=ImgDetMain', duration: 10 },
        ],
        drinks: [
            { title: 'Coca Cola', price: '₹ 40', img: 'https://tse1.mm.bing.net/th/id/OIP.vuTuiCGwn1-zT5Lj_0uM2QHaEo?rs=1&pid=ImgDetMain', duration: 10 },
            { title: 'Mojito', price: '₹ 80', img: 'https://i2.wp.com/www.jamesandeverett.com/wp-content/uploads/2012/05/shutterstock_42168820.jpg?fit=3612%2C4884&ssl=1', duration: 10 },
            { title: 'Orange Juice', price: '₹ 60', img: 'https://wallpaperaccess.com/full/2185825.jpg', duration: 10 },
            { title: 'Cold Coffee', price: '₹ 100', img: 'https://www.funfoodfrolic.com/wp-content/uploads/2020/09/Cold-Coffee-Thumbnail.jpg', duration: 10 },
        ]
    };

    const handleAddItem = (item) => {
        setCartItems((prev) => ({
            ...prev,
            [item.title]: { ...item, count: 1 }
        }));
    };

    const incrementItem = (item) => {
        setCartItems((prev) => ({
            ...prev,
            [item.title]: {
                ...item,
                count: prev[item.title].count + 1
            }
        }));
    };

    const decrementItem = (item) => {
        setCartItems((prev) => {
            const currentCount = prev[item.title].count;
            if (currentCount === 1) {
                const updated = { ...prev };
                delete updated[item.title];
                return updated;
            } else {
                return {
                    ...prev,
                    [item.title]: {
                        ...item,
                        count: currentCount - 1
                    }
                };
            }
        });
    };

    const renderItems = () => {
        const items = menu[selectedCategory];
        const filteredItems = items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filteredItems.map((item, idx) => (
            <div className={MenuS.card} key={idx}>
                <img src={item.img} alt={item.title} />
                <div className={MenuS.names}>
                    <h4>{item.title}</h4>
                    <div className={MenuS.bottomRow}>
                        <p className={MenuS.price}>{item.price}</p>
                        {
                            cartItems[item.title] ? (
                                <div className={MenuS.quantityControl}>
                                    <button onClick={() => decrementItem(item)}>-</button>
                                    <span>{cartItems[item.title].count}</span>
                                    <button onClick={() => incrementItem(item)}>+</button>
                                </div>
                            ) : (
                                <p className={MenuS.addButton} onClick={() => handleAddItem(item)}>+</p>
                            )
                        }
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className={MenuS.main}>
            <h1>Good evening</h1>
            <h3>Place your order here</h3>
            <div className={MenuS.searchBar}>
                <span className={MenuS.searchIcon}><Search /></span>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={MenuS.tab_container}>
                <div
                    className={`${MenuS.tabs} ${selectedCategory === 'burgers' ? MenuS.activeTab : ''}`}
                    onClick={() => setSelectedCategory('burgers')}
                >
                    <Burger className={MenuS.logo} />
                    <p>Burgers</p>
                </div>
                <div className={`${MenuS.tabs} ${selectedCategory === 'pizza' ? MenuS.activeTab : ''}`} onClick={() => setSelectedCategory('pizza')}>
                    <Pizza className={MenuS.logo} />
                    <p>Pizza</p>
                </div>
                <div className={`${MenuS.tabs} ${selectedCategory === 'drinks' ? MenuS.activeTab : ''}`} onClick={() => setSelectedCategory('drinks')}>
                    <Drink className={MenuS.logo} />
                    <p>Drinks</p>
                </div>
                <div className={`${MenuS.tabs} ${selectedCategory === 'fries' ? MenuS.activeTab : ''}`} onClick={() => setSelectedCategory('fries')}>
                    <Fries className={MenuS.logo} />
                    <p>Fries</p>
                </div>
                <div className={`${MenuS.tabs} ${selectedCategory === 'veggies' ? MenuS.activeTab : ''}`} onClick={() => setSelectedCategory('veggies')}>
                    <Veggies className={MenuS.logo} />
                    <p>Veggies</p>
                </div>
            </div>
            <h1>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h1>
            <div className={MenuS.cards}>
                {renderItems()}
            </div>
        </div>
    );
}