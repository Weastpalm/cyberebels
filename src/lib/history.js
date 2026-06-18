// Persistent OSINT search history (localStorage). Keeps the last lookups with a
// quick verdict summary so analysts can see and re-open what they've checked.
const KEY = "cr-osint-history";
const MAX = 40;

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveHistory(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch (e) {}
}
export function addEntry(list, entry) {
  const rest = (list || []).filter((x) => !(x.indicator === entry.indicator && x.type === entry.type));
  return [entry, ...rest].slice(0, MAX);
}
export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}
