import axios from "axios";

export async function searchPlaces(query, location) {
  const { lat, lon } = location || {};
  const response = await axios.get("https://api.foursquare.com/v3/places/search", {
    headers: { Authorization: process.env.FOURSQUARE_API_KEY },
    params: {
      query,
      ll: lat && lon ? `${lat},${lon}` : undefined,
      limit: 5
    }
  });

  return (
    "Here are some suggestions:\n" +
    response.data.results.map(p => `📍 ${p.name} - ${p.location.formatted_address}`).join("\n")
  );
}
