import React, { useState } from 'react'
import { askDobby, findPlaces, getStaticMap, getRoute } from './api'
import PlacesList from './components/PlacesList'
import Map from './components/Map'


export default function App() {
const [question, setQuestion] = useState('')
const [places, setPlaces] = useState([])
const [mapUrl, setMapUrl] = useState(null)
const [chat, setChat] = useState([])


async function handleAsk() {
// Send the raw question to Dobby. You may prefer to ask Dobby to respond with a JSON structure.
const ai = await askDobby(question)
setChat(prev => [...prev, { type: 'text', from: 'dobby', content: JSON.stringify(ai, null, 2) }])
}


async function handleFind() {
navigator.geolocation.getCurrentPosition(async (pos) => {
const { latitude, longitude } = pos.coords
const data = await findPlaces(latitude, longitude)
const results = data.results || []
setPlaces(results)


if (results.length) {
const first = results[0]
const lat = first.geocodes.main.latitude
const lng = first.geocodes.main.longitude
const map = await getStaticMap(lat, lng)
setMapUrl(map.mapUrl)
}


setChat(prev => [...prev, { type: 'text', from: 'system', content: `Found ${results.length} places` }])
}, (err) => {
console.error(err)
alert('Could not get geolocation')
})
}


async function handleRouteTo(place) {
navigator.geolocation.getCurrentPosition(async (pos) => {
const fromLat = pos.coords.latitude
const fromLng = pos.coords.longitude
const toLat = place.geocodes.main.latitude
const toLng = place.geocodes.main.longitude


const route = await getRoute(fromLat, fromLng, toLat, toLng, 'drive')
setChat(prev => [...prev, { type: 'text', from: 'system', content: 'Route returned (check developer console for geojson)' }])
console.log('route', route)
})
}


return (
<div style={{ padding: 20 }}>
<h1>AI Assistant — Outings</h1>


<div>
<input value={question} onChange={e => setQuestion(e.target.value)} placeholder="اكتب سؤالك لـ D
