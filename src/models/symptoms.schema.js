const mongoose = require("mongoose");

const doshaSchema = new mongoose.Schema({
  //  Vata (Air type)
  dry_skin: { type: Boolean, default: false },
  dry_hair: { type: Boolean, default: false },
  gas_constipation: { type: Boolean, default: false },
  cold_hands_feet: { type: Boolean, default: false },
  light_sleep: { type: Boolean, default: false },
  anxiety_restlessness: { type: Boolean, default: false },
  mood_swings: { type: Boolean, default: false },

  //  Pitta (Fire type)
  heat_sensitivity: { type: Boolean, default: false },
  skin_rash: { type: Boolean, default: false },
  excess_hunger: { type: Boolean, default: false },
  anger_irritation: { type: Boolean, default: false },
  acidity_loose_motion: { type: Boolean, default: false },
  sensitive_eyes: { type: Boolean, default: false },
  prefer_cool_env: { type: Boolean, default: false },

  //  Kapha (Water type)
  weight_gain: { type: Boolean, default: false },
  sinus_mucus: { type: Boolean, default: false },
  laziness_sleepiness: { type: Boolean, default: false },
  slow_digestion: { type: Boolean, default: false },
  oily_skin: { type: Boolean, default: false },
  difficulty_waking: { type: Boolean, default: false },
  sluggish_inactivity: { type: Boolean, default: false },


  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dosha", doshaSchema);
