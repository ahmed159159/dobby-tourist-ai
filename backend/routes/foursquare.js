const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;


// GET /places?lat=...&lng=...&price=1,2,3&categories=13065
router.get('/', async (req, res) => {
try {
const { lat, lng, price, categories, limit } = req.query;
if (!lat || !lng) return res.status(400).json({ error: 'lat,lng required' });


const categoryParam = categories || '13065';
const priceParam = price || '1,2,3';
const limitParam = limit || 10;


const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categoryParam}&price=${priceParam}&limit=${limitParam}`;


const response = await fetch(url, {
headers: {
'Accept': 'application/json',
'Authorization': FOURSQUARE_API_KEY
}
});


const data = await response.json();


// Optionally: enrich results with photos endpoint for each place
// For performance, do it on-demand from frontend or cache results.


res.json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error contacting Foursquare API' });
}
});


module.exports = router;
