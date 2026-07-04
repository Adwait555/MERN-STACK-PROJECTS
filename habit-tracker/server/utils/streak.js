function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function todayKey() {
  return toDateKey(new Date());
}

function addDays(dateKey, delta) {
  const d = new Date(dateKey + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return toDateKey(d);
}

// Current streak: consecutive days ending today, with one day of grace
// (if today isn't checked yet but yesterday was, the streak is still "alive").
function currentStreak(completedDates) {
  const set = new Set(completedDates);
  const today = todayKey();
  let cursor = set.has(today) ? today : addDays(today, -1);
  if (!set.has(cursor)) return 0;
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function longestStreak(completedDates) {
  if (completedDates.length === 0) return 0;
  const sorted = [...new Set(completedDates)].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === addDays(sorted[i - 1], 1)) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }
  return longest;
}

function last7Days() {
  const today = todayKey();
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));
  return days;
}

module.exports = { toDateKey, todayKey, addDays, currentStreak, longestStreak, last7Days };
