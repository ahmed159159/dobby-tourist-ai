import axios from "axios";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchNearby(lat, lon, query = "restaurant") {
  try {
    const res = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: {
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
      },
      params: {
        query,
        ll: `${lat},${lon}`,
        radius: 2000, // متر
        limit: 5,
      },
    });

    const places = res.data.results.map((place) => ({
      name: place.name,
      address: place.location.formatted_address || "No address",
      category: place.categories[0]?.name || "N/A",
    }));

    if (places.length === 0) return "😔 مفيش أماكن قريبة اتعثر عليها دلوقتي.";

    let reply = "";
    places.forEach((p, i) => {
      reply += `\n${i + 1}. ${p.name} (${p.category})\n   ${p.address}`;
    });

    return reply;
  } catch (err) {
    console.error("Foursquare error:", err.response?.data || err.message);
    return "⚠️ حصل خطأ أثناء جلب الأماكن من Foursquare.";
  }
}
