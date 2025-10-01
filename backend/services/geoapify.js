import axios from "axios";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function getRoute(start, end) {
  try {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${start.lat},${start.lon}|${end.lat},${end.lon}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    return { type: "route", data: response.data };
  } catch (err) {
    console.error("❌ Geoapify error:", err.message);
    return { error: "Failed to fetch route" };
  }
}
