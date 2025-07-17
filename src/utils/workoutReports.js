import { dbHelpers } from '../config/supabase'

// Stores workout session data in the database
export const saveWorkoutReport = async (userId, workoutData) => {
  try {
    const reportData = {
      user_id: userId,
      exercise_name: workoutData.exerciseName,
      exercise_type: workoutData.exerciseType,
      total_reps: workoutData.totalReps,
      duration: workoutData.duration,
      rep_scores: workoutData.repScores || [],
      overall_score: workoutData.overallScore,
      average_score: workoutData.averageScore,
      best_rep_score: workoutData.bestRepScore,
      feedback: workoutData.feedback || '',
      workout_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    }

    const { data, error } = await dbHelpers.createWorkoutReport(reportData)
    
    if (error) {
      console.error('Error saving workout report:', error)
      return { success: false, error: error.message }
    }

    console.log('Workout report saved successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Error in saveWorkoutReport:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Helper function to calculate workout statistics
 */
export const calculateWorkoutStats = (repScores) => {
  if (!repScores || repScores.length === 0) {
    return {
      averageScore: 0,
      bestRepScore: 0,
      overallScore: 0
    }
  }

  const validScores = repScores.filter(score => !isNaN(score) && score >= 0)
  
  if (validScores.length === 0) {
    return {
      averageScore: 0,
      bestRepScore: 0,
      overallScore: 0
    }
  }

  const averageScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length
  const bestRepScore = Math.max(...validScores)
  
  // Overall score considers consistency and performance
  const consistency = 1 - (Math.max(...validScores) - Math.min(...validScores)) / 100
  const overallScore = (averageScore * 0.7) + (bestRepScore * 0.2) + (consistency * 10)

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    bestRepScore: Math.round(bestRepScore * 100) / 100,
    overallScore: Math.max(0, Math.min(100, Math.round(overallScore * 100) / 100))
  }
}

/**
 * Helper function to generate AI feedback based on performance
 */
export const generateWorkoutFeedback = (exerciseName, stats, repScores) => {
  const { averageScore, bestRepScore, overallScore } = stats
  
  let feedback = `Great work on your ${exerciseName} session! `
  
  if (overallScore >= 90) {
    feedback += "Excellent form and consistency! You're maintaining great technique throughout your workout. "
  } else if (overallScore >= 75) {
    feedback += "Good performance with room for improvement. Focus on maintaining consistent form. "
  } else if (overallScore >= 60) {
    feedback += "You're making progress! Work on your form and try to maintain consistency across all reps. "
  } else {
    feedback += "Keep practicing! Focus on proper form over speed. Quality reps are better than rushed ones. "
  }

  // Add specific tips based on exercise
  const exerciseTips = {
    squats: "Remember to keep your knees aligned with your toes and go down to at least 90 degrees.",
    pushups: "Keep your body in a straight line and lower yourself until your chest nearly touches the ground.",
    plank: "Engage your core and maintain a straight line from head to heels.",
    lunges: "Step far enough forward and keep your front knee over your ankle.",
    bicepCurls: "Control the movement and avoid swinging your arms.",
    shoulderPress: "Press straight up and avoid arching your back.",
    situps: "Focus on lifting with your core, not pulling on your neck.",
    deadlifts: "Keep your back straight and lift with your legs and hips."
  }

  if (exerciseTips[exerciseName.toLowerCase()]) {
    feedback += exerciseTips[exerciseName.toLowerCase()]
  }

  return feedback
}
