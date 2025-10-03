import React from "react";

export default function PlacesList({ places }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg">📍 الأماكن المقترحة:</h2>
      <ul>
        {places.map((place, i) => (
          <li key={i} className="border-b p-2">
            <strong>{place.name}</strong><br />
            {place.location?.formatted_address}<br />
            السعر: {place.price || "غير متاح"}
          </li>
        ))}
      </ul>
    </div>
  );
}
