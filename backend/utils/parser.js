export function parseQuestion(question) {
  const q = question.toLowerCase();

  // كلمات مفتاحية للأماكن
  if (q.includes("مطعم") || q.includes("كافيه") || q.includes("كوفي") || q.includes("اكل")) {
    return "places";
  }

  // كلمات مفتاحية للطرق/الوصول
  if (q.includes("ازاي") || q.includes("طريق") || q.includes("اوصل") || q.includes("محطة")) {
    return "routing";
  }

  return "unknown";
}
