const express = require('express');
const router = express.Router();
const Table = require('../models/table.model');
const Order = require('../models/orders.model.js');

// Get all tables
router.get('/', async (req, res, next) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    next(error);
  }
});


router.get('/with-orders', async (req, res, next) => {
  try {
    const tables = await Table.find().populate('currentOrder');
    res.json(tables);
  } catch (error) {
    next(error);
  }
});



router.delete('/:id', async (req, res, next) => {
  try {
    // Find the table to delete
    const tableToDelete = await Table.findById(req.params.id);
    if (!tableToDelete) return res.status(404).json({ message: 'Table not found' });

    const deletedNumber = tableToDelete.number;

    // Delete the table
    await Table.findByIdAndDelete(req.params.id);

    // Decrement the number of all tables with a higher number
    await Table.updateMany(
      { number: { $gt: deletedNumber } },
      { $inc: { number: -1 } }
    );

    res.json({ message: 'Table deleted and numbers updated' });
  } catch (error) {
    next(error);
  }
});

// Add a new table
router.post('/add', async (req, res, next) => {
  try {
    const { number, chairs } = req.body;
    const table = new Table({ number, chairs });
    await table.save();
    res.json(table);
  } catch (error) {
    next(error);
  }
});

// Assign table to order
router.post('/assign', async (req, res, next) => {
  try {
    const { orderId } = req.body;
    // Find an available table
    const table = await Table.findOne({ status: 'available' });
    if (!table) return res.status(400).json({ message: 'No available tables' });

    // Mark table as occupied and link to order
    table.status = 'occupied';
    table.currentOrder = orderId;
    await table.save();

    // Optionally, update order with table info
    await Order.findByIdAndUpdate(orderId, { table: table._id });

    res.json({ message: 'Table assigned', table });
  } catch (error) {
    next(error);
  }
});

// Free a table (when order is done)
router.post('/free', async (req, res, next) => {
  try {
    const { tableId } = req.body;
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    table.status = 'available';
    table.currentOrder = null;
    await table.save();
    res.json({ message: 'Table freed', table });
  } catch (error) {
    next(error);
  }
});

module.exports = router;