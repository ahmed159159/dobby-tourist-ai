// Simple helper to call backend
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';


export async function askDobby(question) {
const res = await fetch(`${BACKEND}/dobby`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ question })
});
return res.json();
}


export async function findPlaces(lat, lng, price = '1,2,3', categories = '13065') {
const res = await fetch(`${BACKEND}/places?lat=${lat}&lng=${lng}&price=${price}&categories=${categories}`);
return res.json();
}


export async function getStaticMap(lat, lng, zoom = 14, width = 800, height = 400) {
const res = await fetch(`${BACKEND}/map/static?lat=${lat}&lng=${lng}&zoom=${zoom}&width=${width}&height=${height}`);
return res.json();
}


export async function getRoute(fromLat, fromLng, toLat, toLng, mode = 'drive') {
const res = await fetch(`${BACKEND}/map/route?from=${fromLat},${fromLng}&to=${toLat},${toLng}&mode=${mode}`);
return res.json();
}
