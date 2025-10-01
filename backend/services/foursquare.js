import axios from "axios";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, location) {
  try {
    const { lat, lon } = location || { lat: 30.0444, lon: 31.2357 }; // Default: Cairo

    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
      query
    )}&ll=${lat},${lon}&limit=5`;

    const response = await axios.get(url, {
      headers: {
        Authorization: FOURSQUARE_API_KEY,
      },
    });

    const places = response.data.results.map((p) => ({
      name: p.name,
      address: p.location.formatted_address,
      categories: p.categories?.map((c) => c.name).join(", ") || "N/A",
    }));

    return { type: "places", data: places };
  } catch (err) {
    console.error("❌ Foursquare error:", err.message);
    return { error: "Failed to fetch places" };
  }
}
