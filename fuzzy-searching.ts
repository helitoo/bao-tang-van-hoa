export const calculateJaccard = (setA: Set<any>, setB: Set<any>): number => {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

export const getWordSet = (text: string): Set<string> => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
};
