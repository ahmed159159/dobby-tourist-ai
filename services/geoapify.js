// services/geoapify.js
import axios from "axios";

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export async function getRoute(startLat, startLon, endLat, endLon) {
  try {
    const res = await axios.get("https://api.geoapify.com/v1/routing", {
      params: {
        waypoints: `${startLat},${startLon}|${endLat},${endLon}`,
        mode: "drive",
        apiKey: GEOAPIFY_KEY
      }
    });

    return res.data;
  } catch (err) {
    console.error("Geoapify error:", err.response?.data || err.message);
    return null;
  }
}
