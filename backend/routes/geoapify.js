const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;


// GET /map/static?lat=...&lng=...&zoom=14
router.get('/static', (req, res) => {
const { lat, lng, zoom, width, height } = req.query;
if (!lat || !lng) return res.status(400).json({ error: 'lat,lng required' });


const z = zoom || 14;
const w = width || 800;
const h = height || 400;


const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${w}&height=${h}&center=lonlat:${lng},${lat}&zoom=${z}&apiKey=${GEOAPIFY_KEY}`;
return res.json({ mapUrl });
});


// GET /map/route?from=lat,lng&to=lat,lng&mode=drive
router.get('/route', async (req, res) => {
try {
const { from, to, mode } = req.query; // from=lat,lng
if (!from || !to) return res.status(400).json({ error: 'from,to required' });


const m = mode || 'drive';
const waypoints = `${from.split(',')[0]},${from.split(',')[1]}|${to.split(',')[0]},${to.split(',')[1]}`;


const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=${m}&apiKey=${GEOAPIFY_KEY}`;
const r = await fetch(url);
const data = await r.json();
res.json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error contacting Geoapify API' });
}
});


module.exports = router;
