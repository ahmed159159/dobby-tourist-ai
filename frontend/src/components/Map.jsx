import React from "react";

export default function Map({ places }) {
  if (!places.length) return null;

  const first = places[0];
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${first.geocodes.main.longitude},${first.geocodes.main.latitude}&zoom=14&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`;

  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg">🗺️ الخريطة:</h2>
      <img src={mapUrl} alt="Map" />
    </div>
  );
}
