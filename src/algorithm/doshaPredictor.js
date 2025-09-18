const patientSchema = require("../models/patient.schema");
const { agecalc } = require("../utils/agecalc");

const doshaPredictor = async(id)=>{

  const patient  = await patientSchema.findById(id).populate("symptoms").lean()
  
  if(!patient){
    return 
  }

  const heightCm = patient.height
  const weight = patient.weight
  const age = agecalc(patient.dob.toISOString().slice(0,4))
  
  const AllSymptoms = patient.symptoms
  

  console.log(typeof AllSymptoms)
   


const symptomsArr = Object.keys(AllSymptoms).filter(key =>typeof AllSymptoms[key] ==="boolean" && AllSymptoms[key] === true);


  console.log(symptomsArr)

  


// Step 1: Symptom weights
const symptomWeights = {
  //  Vata
  dry_skin: { Vata: 2 },
  dry_hair: { Vata: 2 },
  gas_constipation: { Vata: 3 },
  cold_hands_feet: { Vata: 2 },
  light_sleep: { Vata: 3 },
  anxiety_restlessness: { Vata: 3 },
  mood_swings: { Vata: 2 },

  //  Pitta
  heat_sensitivity: { Pitta: 2 },
  skin_rash: { Pitta: 3 },
  excess_hunger: { Pitta: 2 },
  anger_irritation: { Pitta: 3 },
  acidity_loose_motion: { Pitta: 3 },
  sensitive_eyes: { Pitta: 1 },
  prefer_cool_env: { Pitta: 2 },

  //  Kapha
  weight_gain: { Kapha: 3 },
  sinus_mucus: { Kapha: 2 },
  laziness_sleepiness: { Kapha: 3 },
  slow_digestion: { Kapha: 3 },
  oily_skin: { Kapha: 2 },
  difficulty_waking: { Kapha: 2 },
  sluggish_inactivity: { Kapha: 2 }
};

// Step 2: BMI category
function getBMICategory(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

// Step 3: Age category
function getAgeDosha(age) {
  if (age < 16) return "Kapha";
  if (age <= 50) return "Pitta";
  return "Vata";
}

// Step 4: Calculate dosha scores
function calculateDosha(input) {
  let scores = { Vata: 0, Pitta: 0, Kapha: 0 };

  // Add symptom weights
  input.symptoms.forEach(symptom => {
    const weights = symptomWeights[symptom];
    if (weights) {
      for (let dosha in weights) {
        scores[dosha] += weights[dosha];
      }
    }
  });

  // Add BMI effect
  const bmiCategory = getBMICategory(input.weight, input.height);
  if (bmiCategory === "underweight") scores.Vata += 1;
  else if (bmiCategory === "normal") scores.Pitta += 1;
  else scores.Kapha += 1; // overweight & obese → Kapha

  // Add Age effect
  const ageDosha = getAgeDosha(input.age);
  scores[ageDosha] += 2;

  return scores;
}

// Step 5: Interpret result
function predictDosha(input) {
  const scores = calculateDosha(input);

  // Find max score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [firstDosha, firstScore] = sorted[0];
  const [secondDosha, secondScore] = sorted[1];
  const [thirdDosha, thirdScore] = sorted[2];

  let result;

  if (firstScore - secondScore <= 2 && secondScore - thirdScore > 2) {
    result = `${firstDosha}-${secondDosha} (Dual Dosha)`;
  } else if (firstScore - thirdScore <= 2) {
    result = "Tridoshic (balanced)";
  } else {
    result = `${firstDosha} (Predominant Dosha)`;
  }

  return { scores, result };
}


 const userInput = {age,weight,height:heightCm , symptoms:symptomsArr}

 console.log(userInput)
 return predictDosha(userInput)


}

module.exports = {doshaPredictor}