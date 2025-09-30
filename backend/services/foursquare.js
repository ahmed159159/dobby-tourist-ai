import axios from "axios";

export async function searchPlaces(lat, lon, query) {
  const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&query=${encodeURIComponent(query)}&limit=5`;

  const res = await axios.get(url, {
    headers: { Authorization: process.env.FOURSQUARE_API_KEY }
  });

  return res.data.results.map(place => ({
    name: place.name,
    address: place.location.formatted_address,
    distance: place.distance
  }));
}
