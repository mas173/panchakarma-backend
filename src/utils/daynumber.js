function getDayKeyFromName(dayName) {
  const dayMap = {
    Sunday: "day7",
    Monday: "day1",
    Tuesday: "day2",
    Wednesday: "day3",
    Thursday: "day4",
    Friday: "day5",
    Saturday: "day6"
  };

  return dayMap[dayName] || null; 
}

module.exports = getDayKeyFromName