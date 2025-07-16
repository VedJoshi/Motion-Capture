// Exercise configuration and metadata
export const EXERCISES = {
  squats: {
    id: 'squats',
    name: 'Squats',
    description: 'Lower body strength',
    type: 'reps',
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    instructions: [
      'Stand with feet hip-width apart',
      'Lower body by bending knees and hips',
      'Keep chest up and knees over toes',
      'Push through heels to return to start'
    ],
    formCriteria: {
      minDepth: 90, // knee angle
      maxKneeDifference: 15,
      maxHipDifference: 15,
      minStability: 70
    },
    scoring: {
      excellent: 90,
      good: 75,
      fair: 60
    }
  },
  
  pushups: {
    id: 'pushups',
    name: 'Push-ups',
    description: 'Upper body strength',
    type: 'reps',
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    instructions: [
      'Start in plank position',
      'Lower body by bending elbows',
      'Keep body straight throughout',
      'Push back up to start position'
    ],
    formCriteria: {
      minDepth: 90, // elbow angle
      maxElbowDifference: 20,
      maxBodySag: 0.05,
      minStability: 70
    },
    scoring: {
      excellent: 90,
      good: 75,
      fair: 60
    }
  },
  
  plank: {
    id: 'plank',
    name: 'Plank',
    description: 'Core stability',
    type: 'time',
    targetMuscles: ['core', 'shoulders', 'glutes'],
    instructions: [
      'Start in push-up position',
      'Hold body in straight line',
      'Engage core muscles',
      'Breathe normally while holding'
    ],
    formCriteria: {
      minStability: 80,
      maxBodyDeviation: 0.1,
      minAlignment: 70
    },
    scoring: {
      excellent: 90,
      good: 75,
      fair: 60
    },
    timeTargets: {
      beginner: 30,
      intermediate: 60,
      advanced: 120
    }
  }
};

// Get exercise by ID
export function getExercise(id) {
  return EXERCISES[id] || null;
}

// Get all exercises as array
export function getAllExercises() {
  return Object.values(EXERCISES);
}

// Get exercises by type
export function getExercisesByType(type) {
  return Object.values(EXERCISES).filter(ex => ex.type === type);
}