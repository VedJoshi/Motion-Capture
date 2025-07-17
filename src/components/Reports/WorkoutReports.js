import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers } from '../../config/supabase'

function WorkoutReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchReports()
    }
  }, [user])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await dbHelpers.getUserWorkoutReports(user.id)
      if (error) throw error
      setReports(data || [])
    } catch (err) {
      setError('Failed to fetch workout reports')
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return

    try {
      const { error } = await dbHelpers.deleteWorkoutReport(reportId)
      if (error) throw error
      
      setReports(reports.filter(report => report.id !== reportId))
      setSelectedReport(null)
    } catch (err) {
      setError('Failed to delete report')
      console.error('Error deleting report:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'
    if (score >= 75) return '#eab308'
    if (score >= 60) return '#f97316'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading workout reports...</p>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: '600',
          color: 'var(--neutral-700)'
        }}>
          📊 Your Workout Reports
        </h2>
        <button
          onClick={fetchReports}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--border-radius-md)',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--surface-white)',
          borderRadius: 'var(--border-radius-xl)',
          border: '1px solid var(--neutral-200)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--neutral-600)' }}>
            No workout reports yet
          </h3>
          <p style={{ margin: 0, color: 'var(--neutral-500)' }}>
            Complete some workouts to see your progress reports here!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedReport ? '1fr 1fr' : '1fr',
          gap: '2rem'
        }}>
          {/* Reports List */}
          <div>
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {reports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    background: 'var(--surface-white)',
                    borderRadius: 'var(--border-radius-lg)',
                    border: selectedReport?.id === report.id 
                      ? '2px solid var(--primary-color)' 
                      : '1px solid var(--neutral-200)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedReport?.id === report.id 
                      ? 'var(--shadow-lg)' 
                      : 'var(--shadow-sm)'
                  }}
                  onClick={() => setSelectedReport(report)}
                  onMouseOver={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.borderColor = 'var(--primary-light)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.borderColor = 'var(--neutral-200)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: 'var(--neutral-700)',
                        textTransform: 'capitalize'
                      }}>
                        {report.exercise_name || 'Unknown Exercise'}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: 'var(--neutral-500)'
                      }}>
                        {formatDate(report.created_at)}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: getScoreColor(report.overall_score || 0),
                        color: 'white',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {Math.round(report.overall_score || 0)}%
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteReport(report.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--neutral-400)',
                          cursor: 'pointer',
                          fontSize: '1.25rem',
                          padding: '0.25rem'
                        }}
                        title="Delete report"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <div style={{ color: 'var(--neutral-500)', marginBottom: '0.25rem' }}>
                        Reps/Duration
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--neutral-700)' }}>
                        {report.total_reps || report.duration || 'N/A'}
                        {report.duration && 's'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--neutral-500)', marginBottom: '0.25rem' }}>
                        Avg Score
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--neutral-700)' }}>
                        {Math.round(report.average_score || 0)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--neutral-500)', marginBottom: '0.25rem' }}>
                        Best Rep
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--neutral-700)' }}>
                        {Math.round(report.best_rep_score || 0)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Details */}
          {selectedReport && (
            <div style={{
              background: 'var(--surface-white)',
              borderRadius: 'var(--border-radius-xl)',
              border: '1px solid var(--neutral-200)',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              height: 'fit-content',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--neutral-700)',
                  textTransform: 'capitalize'
                }}>
                  {selectedReport.exercise_name} Details
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--neutral-400)'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--neutral-700)'
                }}>
                  Overall Performance
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: 'var(--neutral-50)',
                    borderRadius: 'var(--border-radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: getScoreColor(selectedReport.overall_score || 0),
                      marginBottom: '0.25rem'
                    }}>
                      {Math.round(selectedReport.overall_score || 0)}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      Overall Score
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'var(--neutral-50)',
                    borderRadius: 'var(--border-radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'var(--neutral-700)',
                      marginBottom: '0.25rem'
                    }}>
                      {selectedReport.total_reps || selectedReport.duration || 'N/A'}
                      {selectedReport.duration && 's'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      {selectedReport.total_reps ? 'Total Reps' : 'Duration'}
                    </div>
                  </div>
                </div>
              </div>

              {selectedReport.rep_scores && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    Rep-by-Rep Analysis
                  </h4>
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--border-radius-md)'
                  }}>
                    {selectedReport.rep_scores.map((score, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          borderBottom: index < selectedReport.rep_scores.length - 1 
                            ? '1px solid var(--neutral-100)' 
                            : 'none'
                        }}
                      >
                        <span style={{ fontWeight: '500' }}>Rep {index + 1}</span>
                        <span
                          style={{
                            color: getScoreColor(score),
                            fontWeight: '600'
                          }}
                        >
                          {Math.round(score)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.feedback && (
                <div>
                  <h4 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--neutral-700)'
                  }}>
                    AI Feedback
                  </h4>
                  <div style={{
                    padding: '1rem',
                    background: 'var(--neutral-50)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    color: 'var(--neutral-700)'
                  }}>
                    {selectedReport.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkoutReports
