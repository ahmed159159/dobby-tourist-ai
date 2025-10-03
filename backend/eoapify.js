import fetch from "node-fetch";

export async function getRoute(start, end) {
  const response = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${start}|${end}&mode=drive&apiKey=${process.env.GEOAPIFY_KEY}`
  );
  return await response.json();
}
