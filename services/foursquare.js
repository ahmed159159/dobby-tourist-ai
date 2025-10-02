import axios from "axios";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    const res = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: { Authorization: FOURSQUARE_API_KEY },
      params: {
        query,
        ll: `${lat},${lon}`,
        radius: 3000,
        limit: 5
      }
    });

    return res.data.results.map(p => ({
      name: p.name,
      address: p.location.formatted_address,
      category: p.categories[0]?.name || "N/A"
    }));
  } catch (err) {
    console.error("Foursquare error:", err.response?.data || err.message);
    return [];
  }
}
