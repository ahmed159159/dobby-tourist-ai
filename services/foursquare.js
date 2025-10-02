import axios from "axios";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    const res = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: {
        Authorization: FOURSQUARE_API_KEY,
      },
      params: {
        query,
        ll: `${lat},${lon}`,
        radius: 2000,
        limit: 5,
      },
    });

    return res.data.results.map((place) => ({
      name: place.name,
      address: place.location.formatted_address,
      category: place.categories[0]?.name || "N/A",
    }));
  } catch (err) {
    console.error("Foursquare error:", err.response?.data || err.message);
    return [];
  }
}
