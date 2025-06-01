const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model.js');
const cron = require('node-cron');
const Table = require('../models/table.model.js');
const Chef = require('../models/chef.model.js');


router.post('/create', async (req, res, next) => {
    try {
        const orderData = req.body;
        const neworder = new Order(orderData);
        await neworder.save();

        // Only assign a table if NOT take away
        if (orderData.orderType !== 'Take Away') {
            const table = await Table.findOne({ status: 'available' });
            if (!table) {
                await Order.findByIdAndDelete(neworder._id);
                return res.status(400).json({ message: "No available tables to assign" });
            }
            table.status = 'occupied';
            table.currentOrder = neworder._id;
            await table.save();

            // Update order with assigned table
            neworder.table = table.number;
        }

        // --- Chef assignment logic ---
        const chefs = await Chef.find();
        const now = new Date();

        // For each chef, calculate total remaining time of their 'processing' orders
        let chefTimes = await Promise.all(chefs.map(async chef => {
            const orders = await Order.find({ _id: { $in: chef.orders }, status: 'processing' });
            let total = 0;
            orders.forEach(order => {
                const elapsed = (now - new Date(order.createdAt)) / 60000; // in minutes
                const remaining = Math.max(order.duration - elapsed, 0);
                total += remaining;
            });
            return { chef, total };
        }));

        chefTimes.sort((a, b) => a.total - b.total);
        const selectedChef = chefTimes[0].chef;

        // Assign the new order to this chef
        selectedChef.orders.push(neworder._id);
        await selectedChef.save();

        neworder.chef = selectedChef._id;
        await neworder.save();

        res.status(201).json({
            message: "Order has been created, chef assigned" +
                (orderData.type !== 'take away' ? ", table assigned" : ""),
            order: neworder,
            table: neworder.table || null,
            chef: selectedChef
        });
    }
    catch (error) {
        next(error);
    }
});

router.get('/allorder', async (req, res, next) => {
    try {
        const all_orders = await Order.find()
        res.status(200).json(all_orders);

    } catch (error) {
        next(error);
    }
})

router.delete('/deleteall', async (req, res, next) => {
    try {
        await Order.deleteMany({});
        res.status(200).json("all data daleted ")
    }
    catch {
        next(error)
    }
}
)

cron.schedule('* * * * *', async () => {
    const now = new Date();
    try {
        const orders = await Order.find({ status: 'processing' });
        for (const order of orders) {
            const elapsedMinutes = (now - new Date(order.createdAt)) / 60000;
            if (elapsedMinutes >= order.duration) {
                order.status = 'Done';
                if (order.orderType === 'Dine In') {
                    order.pickedUp = true;
                    // Update the table status to available
                    if (order.table) {
                        await Table.findOneAndUpdate(
                            { number: order.table },
                            { status: 'available', currentOrder: null }
                        );
                    }
                }
                await order.save();
                console.log(`Order ${order._id} marked as Done${order.orderType === 'Dine In' ? ' and pickedUp, table released' : ''}`);
            }
        }
    } catch (error) {
        console.error('Error updating order statuses:', error);
    }
});

router.get('/distinct-mobiles', async (req, res, next) => {
    try {
        const mobiles = await Order.distinct('customer.mobile');
        res.status(200).json({ totalDistinctMobiles: mobiles.length });
    } catch (error) {
        next(error);
    }
});

// router.post('/addchef', async (req, res) => {
//   try {
//     const chef = new Chef({ name: req.body.name, orders: [] });
//     await chef.save();
//     res.status(201).json(chef);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.get('/allchefs', async (req, res, next) => {
    try {
        const chefs = await Chef.find();
        res.status(200).json(chefs);
    } catch (error) {
        next(error);
    }
});

router.put('/pickedup/:id', async (req, res, next) => {
    try {
        const { pickedUp } = req.body;
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(
            id,
            { pickedUp: !!pickedUp },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
});

router.get('/allorder-with-table', async (req, res, next) => {
    try {
        // Populate the 'table' field to get table number
        const orders = await Order.find().populate('table');
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

router.put('/randomize-tables', async (req, res, next) => {
    try {
        const orders = await Order.find();
        for (const order of orders) {
            const randomTable = Math.floor(Math.random() * 6) + 1; // 1 to 6
            order.table = randomTable;
            await order.save();
        }
        res.status(200).json({ message: "Random table numbers assigned to all orders." });
    } catch (error) {
        next(error);
    }
});


module.exports = router;