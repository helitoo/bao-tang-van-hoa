function substringScore(query: string, text: string): number {
  if (text.includes(query)) return 1;

  // Cho điểm nếu từng từ xuất hiện
  const words = query.split(/\s+/);
  const matched = words.filter((w) => text.includes(w)).length;

  return matched / words.length;
}

function getWordMap(text: string): Map<string, number> {
  const map = new Map();
  text.split(/\s+/).forEach((w) => {
    map.set(w, (map.get(w) || 0) + 1);
  });
  return map;
}

function jaccardMulti(a: Map<string, number>, b: Map<string, number>) {
  let intersection = 0;
  let union = 0;

  const keys = new Set([...a.keys(), ...b.keys()]);

  keys.forEach((key) => {
    const countA = a.get(key) || 0;
    const countB = b.get(key) || 0;

    intersection += Math.min(countA, countB);
    union += Math.max(countA, countB);
  });

  return union === 0 ? 0 : intersection / union;
}

function getNGrams(text: string, n = 2): Set<string> {
  const grams = new Set<string>();
  for (let i = 0; i < text.length - n + 1; i++) {
    grams.add(text.slice(i, i + n));
  }
  return grams;
}

export default function simalarityScore(query: string, text: string) {
  // query = query.toLowerCase();
  // text = text.toLowerCase();

  const subScore = substringScore(query, text);

  const jaccardScore = jaccardMulti(getWordMap(query), getWordMap(text));

  const ngramScore = jaccardMulti(
    getWordMap([...getNGrams(query)].join(" ")),
    getWordMap([...getNGrams(text)].join(" ")),
  );

  // Trọng số có thể chỉnh
  return subScore * 0.5 + jaccardScore * 0.25 + ngramScore * 0.25;
}
