import axios from "axios";

// Routing (من - إلى)
export async function getRoute(from, to) {
  const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=drive&apiKey=${process.env.GEOAPIFY_KEY}`;
  const res = await axios.get(url);
  return res.data;
}

// Geocoding (تحويل اسم مكان لإحداثيات)
export async function geocode(placeName) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(placeName)}&apiKey=${process.env.GEOAPIFY_KEY}`;
  const res = await axios.get(url);
  
  if (res.data.features.length > 0) {
    const coords = res.data.features[0].geometry.coordinates;
    return { lon: coords[0], lat: coords[1] };
  }
  
  throw new Error("❌ لم أجد المكان المطلوب");
}
