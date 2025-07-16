// Enhanced exercise configuration with new gym exercises
export const EXERCISES = {
  squats: {
    id: 'squats',
    name: 'Squats',
    description: 'Lower body strength',
    type: 'reps',
    category: 'legs',
    difficulty: 'beginner',
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    instructions: [
      'Stand with feet hip-width apart',
      'Lower body by bending knees and hips',
      'Keep chest up and knees over toes',
      'Push through heels to return to start'
    ],
    formCriteria: {
      minDepth: 90,
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
    category: 'chest',
    difficulty: 'beginner',
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    instructions: [
      'Start in plank position',
      'Lower body by bending elbows',
      'Keep body straight throughout',
      'Push back up to start position'
    ],
    formCriteria: {
      minDepth: 90,
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
    category: 'core',
    difficulty: 'beginner',
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
  },

  lunges: {
    id: 'lunges',
    name: 'Lunges',
    description: 'Single-leg strength',
    type: 'reps',
    category: 'legs',
    difficulty: 'intermediate',
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower hips until both knees are at 90°',
      'Push back to starting position'
    ],
    formCriteria: {
      minFrontKneeAngle: 80,
      maxFrontKneeAngle: 100,
      minBackKneeAngle: 80,
      maxKneeOverToe: 0.05,
      minStability: 60
    },
    scoring: {
      excellent: 85,
      good: 70,
      fair: 55
    }
  },

  bicepCurls: {
    id: 'bicepCurls',
    name: 'Bicep Curls',
    description: 'Arm isolation',
    type: 'reps',
    category: 'arms',
    difficulty: 'beginner',
    targetMuscles: ['biceps', 'forearms'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold weights at your sides',
      'Curl weights up by flexing elbows',
      'Lower slowly to starting position'
    ],
    formCriteria: {
      minElbowFlexion: 45,
      maxElbowFlexion: 140,
      maxShoulderMovement: 0.1,
      minControlledMovement: 70
    },
    scoring: {
      excellent: 90,
      good: 75,
      fair: 60
    }
  },

  shoulderPress: {
    id: 'shoulderPress',
    name: 'Shoulder Press',
    description: 'Overhead strength',
    type: 'reps',
    category: 'shoulders',
    difficulty: 'intermediate',
    targetMuscles: ['shoulders', 'triceps', 'upper chest'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold weights at shoulder height',
      'Press weights straight overhead',
      'Lower slowly to starting position'
    ],
    formCriteria: {
      minShoulderFlexion: 160,
      maxWristDeviation: 0.08,
      minCoreStability: 70,
      maxBackArch: 0.1
    },
    scoring: {
      excellent: 88,
      good: 73,
      fair: 58
    }
  },

  situps: {
    id: 'situps',
    name: 'Sit-ups',
    description: 'Core strengthening',
    type: 'reps',
    category: 'core',
    difficulty: 'beginner',
    targetMuscles: ['rectus abdominis', 'hip flexors'],
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head lightly',
      'Lift torso toward knees',
      'Lower slowly to starting position'
    ],
    formCriteria: {
      minTorsoFlexion: 30,
      maxNeckStrain: 0.05,
      minControlledMovement: 70,
      maxHipFlexorDominance: 0.3
    },
    scoring: {
      excellent: 85,
      good: 70,
      fair: 55
    }
  },

  deadlifts: {
    id: 'deadlifts',
    name: 'Deadlifts',
    description: 'Full body strength',
    type: 'reps',
    category: 'back',
    difficulty: 'advanced',
    targetMuscles: ['hamstrings', 'glutes', 'erector spinae', 'traps'],
    instructions: [
      'Stand with feet hip-width apart',
      'Bend at hips and knees to grab bar',
      'Keep back straight and chest up',
      'Stand up by extending hips and knees'
    ],
    formCriteria: {
      minHipHinge: 45,
      maxBackRounding: 0.1,
      minKneeTracking: 80,
      maxBarDrift: 0.05
    },
    scoring: {
      excellent: 95,
      good: 80,
      fair: 65
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

// Get exercises by category
export function getExercisesByCategory(category) {
  return Object.values(EXERCISES).filter(ex => ex.category === category);
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty) {
  return Object.values(EXERCISES).filter(ex => ex.difficulty === difficulty);
}

// Get exercise categories
export function getExerciseCategories() {
  return [...new Set(Object.values(EXERCISES).map(ex => ex.category))];
}