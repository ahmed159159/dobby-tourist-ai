const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


const DOBBY_API_KEY = process.env.DOBBY_API_KEY;


// POST /dobby { question: string }
router.post('/', async (req, res) => {
try {
const { question } = req.body;
if (!question) return res.status(400).json({ error: 'question required' });


const response = await fetch('https://api.fireworks.ai/inference/v1/completions', {
method: 'POST',
headers: {
'Authorization': `Bearer ${DOBBY_API_KEY}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
model: 'sentientfoundation/dobby-unhinged-llama-3-3-70b-new',
prompt: question,
max_tokens: 400
})
});


const data = await response.json();
// Return raw AI response to frontend; optionally parse structured JSON from the model
res.json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error contacting Dobby API' });
}
});


module.exports = router;
