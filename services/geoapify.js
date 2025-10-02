import axios from "axios";

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export async function getRoute(lat1, lon1, lat2, lon2) {
  try {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${lat1},${lon1}|${lat2},${lon2}&mode=drive&apiKey=${GEOAPIFY_KEY}`;
    const res = await axios.get(url);

    const distance = res.data.features[0].properties.distance / 1000;
    const time = res.data.features[0].properties.time / 60;

    return `🚗 المسافة تقريباً ${distance.toFixed(
      1
    )} كم وتاخد حوالي ${time.toFixed(0)} دقيقة.`;
  } catch (err) {
    console.error("Geoapify error:", err.response?.data || err.message);
    return "⚠️ مش قادر اجيب الطريق دلوقتي.";
  }
}
