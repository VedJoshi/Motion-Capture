import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

// Database helper functions for workout reports
export const dbHelpers = {
  // Create a new workout report
  createWorkoutReport: async (reportData) => {
    const { data, error } = await supabase
      .from('workout_reports')
      .insert(reportData)
      .select()
    return { data, error }
  },

  // Get all workout reports for current user
  getUserWorkoutReports: async (userId) => {
    const { data, error } = await supabase
      .from('workout_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get specific workout report
  getWorkoutReport: async (reportId) => {
    const { data, error } = await supabase
      .from('workout_reports')
      .select('*')
      .eq('id', reportId)
      .single()
    return { data, error }
  },

  // Update workout report
  updateWorkoutReport: async (reportId, updateData) => {
    const { data, error } = await supabase
      .from('workout_reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
    return { data, error }
  },

  // Delete workout report
  deleteWorkoutReport: async (reportId) => {
    const { data, error } = await supabase
      .from('workout_reports')
      .delete()
      .eq('id', reportId)
    return { data, error }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, ...profileData })
      .select()
    return { data, error }
  }
}
