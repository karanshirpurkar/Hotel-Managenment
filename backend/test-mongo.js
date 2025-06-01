require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  mongoose.connection.close();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
