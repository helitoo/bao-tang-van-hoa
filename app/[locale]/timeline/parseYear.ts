export const parseYear = (yearStr: string): number => {
  const currentYear = new Date().getFullYear();
  if (yearStr === "nay") return currentYear;
  const num = parseInt(yearStr);
  if (yearStr.includes("TCN")) return -num;
  return num;
};
