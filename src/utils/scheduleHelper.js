function generateWeeklySchedule() {
  const template = {
    slot1: { name: "slot1", start: "10:00", end: "12:30", type: "therapy", status: "free", appointmentId: null },
    break1: { start: "12:30", end: "13:00", type: "break" },
    slot2: { name: "slot2", start: "13:00", end: "13:30", type: "consultation", status: "free", appointmentId: null },
    slot3: { name: "slot3", start: "13:30", end: "14:00", type: "consultation", status: "free", appointmentId: null },
    slot4: { name: "slot4", start: "14:00", end: "14:30", type: "consultation", status: "free", appointmentId: null },
    break2: { start: "14:30", end: "15:00", type: "break" },
    slot5: { name: "slot5", start: "15:00", end: "17:30", type: "therapy", status: "free", appointmentId: null }
  };

  return {
    day1: { ...template },
    day2: { ...template },
    day3: { ...template },
    day4: { ...template },
    day5: { ...template },
    day6: { ...template },
    day7: { ...template }
  };
}


module.exports = generateWeeklySchedule