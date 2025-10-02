import axios from "axios";

export async function getMap(query, location) {
  const { lat, lon } = location || {};
  return `🗺️ Map requested for "${query}" near [${lat}, ${lon}]. (Geoapify API call goes here)`;
}
