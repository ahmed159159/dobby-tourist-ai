import axios from "axios";

export async function searchPlaces(query, location) {
  if (!process.env.FOURSQUARE_API_KEY) {
    return "⚠️ Foursquare API key is missing. Please add FOURSQUARE_API_KEY to your environment.";
  }

  const { lat, lon } = location || {};
  const response = await axios.get("https://api.foursquare.com/v3/places/search", {
    headers: { Authorization: process.env.FOURSQUARE_API_KEY },
    params: {
      query,
      ll: lat && lon ? `${lat},${lon}` : undefined,
      limit: 5
    }
  });

  if (!response.data.results || response.data.results.length === 0) {
    return "🙁 No places found for your search.";
  }

  return (
    "Here are some suggestions:\n" +
    response.data.results.map(p => `📍 ${p.name} - ${p.location.formatted_address}`).join("\n")
  );
}
