import fetch from "node-fetch";

export async function searchPlaces(query, lat, lon) {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lon}&limit=5`,
    {
      headers: { Authorization: process.env.FOURSQUARE_API_KEY },
    }
  );
  return await response.json();
}
