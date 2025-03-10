const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// DB Connection
const db = require('./db/connection');

// Routing
const earthquakeRoutes = require('./routes/earthquakeRoutes');
app.use('/api/earthquakes', earthquakeRoutes);

// Contoh endpoint test
app.get("/api/earthquakes", (req, res) => {
  const sql = "SELECT latitude, longitude, location FROM earthquake_data";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
