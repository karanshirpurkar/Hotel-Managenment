const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ResponseHandler = require('./middleware/reshandler');
const ResquestHandler = require('./middleware/reqhandler');
const ErrorHandler = require('./middleware/errorhandler');
const Order = require('./routes/order');
const tableRoutes = require('./routes/table');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ResponseHandler);
app.use(ResquestHandler);

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/order', Order);
app.use('/table', tableRoutes);
app.use(ErrorHandler);

// ✅ Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});
