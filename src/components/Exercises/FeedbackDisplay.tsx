import React from 'react';

function FeedbackDisplay({
    currentPhase,
    repCount,
    formScore,
    feedback,
    exerciseType,
    isTimeBasedExercise = false,
    plankStability = 0
}) {

    // Get color based on form score
    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745'; // Green
        if (score >= 60) return '#ffc107'; // Yellow
        return '#dc3545'; // Red
    };

    // Get phase indicator
    const getPhaseIndicator = () => {
        const phaseStyles = {
            ready: { color: '#6c757d', text: '⏳ Ready' },
            down: { color: '#ffc107', text: '⬇️ Going Down' },
            up: { color: '#17a2b8', text: '⬆️ Going Up' },
            hold: { color: '#28a745', text: '⏸️ Hold Position' }
        };

        const phase = phaseStyles[currentPhase] || phaseStyles.ready;

        return (
            <span style={{ color: phase.color, fontWeight: 'bold' }}>
                {phase.text}
            </span>
        );
    };

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '15px'
        }}>

            {/* Header with rep count and phase */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
            }}>
                <div>
                    <h3 style={{ margin: 0, color: '#495057' }}>
                        {exerciseType} Analysis
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
                        {isTimeBasedExercise ? (
                            <>Time: <strong>{repCount}s</strong> | Stability: <strong>{plankStability}%</strong></>
                        ) : (
                            <>Reps: <strong>{repCount}</strong></>
                        )} | {getPhaseIndicator()}
                    </p>
                </div>

                {/* Form score circle */}
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: getScoreColor(formScore),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    {formScore}
                </div>
            </div>

            {/* Feedback messages */}
            <div style={{
                background: '#f8f9fa',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '15px'
            }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                    💡 Real-time Feedback
                </h4>
                {feedback && feedback.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {feedback.map((message, index) => (
                            <li key={index} style={{
                                marginBottom: '5px',
                                color: '#495057'
                            }}>
                                {message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ margin: 0, color: '#6c757d' }}>
                        No feedback available
                    </p>
                )}
            </div>

            {/* Progress bar for current rep */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '5px',
                    color: '#495057',
                    fontWeight: 'bold'
                }}>
                    Rep Progress
                </label>
                <div style={{
                    width: '100%',
                    height: '10px',
                    background: '#e9ecef',
                    borderRadius: '5px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        background: currentPhase === 'ready' ? '#6c757d' :
                            currentPhase === 'down' ? '#ffc107' : '#28a745',
                        width: currentPhase === 'ready' ? '0%' :
                            currentPhase === 'down' ? '50%' : '100%',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Form quality breakdown */}
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                <strong>Form Quality: </strong>
                <span style={{ color: getScoreColor(formScore) }}>
                    {formScore >= 80 ? 'Excellent' :
                        formScore >= 60 ? 'Good' : 'Needs Improvement'}
                </span>
            </div>
        </div>
    );
}

export default FeedbackDisplay;
