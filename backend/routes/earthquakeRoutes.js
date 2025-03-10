const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all earthquake data
router.get('/', (req, res) => {
  const query = 'SELECT * FROM earthquake_data';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json(results);
  });
});

// POST insert new earthquake data
router.post('/', (req, res) => {
  const {
    event_id, date_time, latitude, longitude,
    magnitude, mag_type, depth_km,
    phase_count, azimuth_gap, location, agency
  } = req.body;

  const query = `INSERT INTO earthquake_data 
    (event_id, date_time, latitude, longitude, magnitude, mag_type, depth_km, phase_count, azimuth_gap, location, agency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    event_id, date_time, latitude, longitude,
    magnitude, mag_type, depth_km,
    phase_count, azimuth_gap, location, agency
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Insert failed', details: err });
    }
    res.json({ message: 'Data inserted successfully', insertedId: event_id });
  });
});

module.exports = router;
