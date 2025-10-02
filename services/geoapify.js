// services/geoapify.js
import axios from "axios";

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export async function getRoute(lat, lon, to) {
  try {
    const geocode = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: { text: to, apiKey: GEOAPIFY_KEY },
      }
    );

    if (!geocode.data.features.length) return "❌ Destination not found.";

    const [toLon, toLat] = geocode.data.features[0].geometry.coordinates;

    const route = await axios.get("https://api.geoapify.com/v1/routing", {
      params: {
        waypoints: `${lat},${lon}|${toLat},${toLon}`,
        mode: "drive",
        apiKey: GEOAPIFY_KEY,
      },
    });

    const distance = route.data.features[0].properties.distance / 1000;
    const time = route.data.features[0].properties.time / 60;

    return `🚗 Route to ${to} → Distance: ${distance.toFixed(
      1
    )} km, Time: ${time.toFixed(0)} min.`;
  } catch (err) {
    console.error("Geoapify error:", err.response?.data || err.message);
    return "❌ Could not fetch route.";
  }
}
