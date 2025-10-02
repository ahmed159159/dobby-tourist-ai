import axios from "axios";

export async function getMap(query, location) {
  if (!process.env.GEOAPIFY_API_KEY) {
    return "⚠️ Geoapify API key is missing. Please add GEOAPIFY_API_KEY to your environment.";
  }

  const { lat, lon } = location || { lat: 0, lon: 0 };

  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${lon},${lat}&zoom=14&apiKey=${process.env.GEOAPIFY_API_KEY}`;

  return `🗺️ Map requested for "${query}"\n${mapUrl}`;
}
