import React, { useState, useEffect, useRef } from 'react';
import { getBodyAngles, areAnglesValid } from '../../utils/angleCalculation';
import { SmoothedAngles } from '../../utils/dataSmoothing';
import { FormQualityScorer } from '../../utils/formScoring';
import { 
  PlankAnalyzer, 
  AdvancedSquatAnalyzer, 
  AdvancedPushupAnalyzer,
  LungeAnalyzer,
  BicepCurlAnalyzer,
  ShoulderPressAnalyzer,
  SitupAnalyzer
} from '../../utils/exerciseLogic';
import { getExercise } from '../../data/exercises';
import FeedbackDisplay from './FeedbackDisplay.tsx';

function FormAnalyzer({ poseResults, selectedExercise, onRepDetected }) {
  const [currentAngles, setCurrentAngles] = useState(null);
  const [smoothedAngles, setSmoothedAngles] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [exercisePhase, setExercisePhase] = useState('ready');
  const [formScore, setFormScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [plankHoldTime, setPlankHoldTime] = useState(0);
  const [plankStability, setPlankStability] = useState(0);
  const [lastRepAngles, setLastRepAngles] = useState(null);
  
  const smootherRef = useRef(new SmoothedAngles());
  const scorerRef = useRef(new FormQualityScorer());
  const plankAnalyzerRef = useRef(new PlankAnalyzer());
  const squatAnalyzerRef = useRef(new AdvancedSquatAnalyzer());
  const pushupAnalyzerRef = useRef(new AdvancedPushupAnalyzer());
  const lungeAnalyzerRef = useRef(new LungeAnalyzer());
  const bicepCurlAnalyzerRef = useRef(new BicepCurlAnalyzer());
  const shoulderPressAnalyzerRef = useRef(new ShoulderPressAnalyzer());
  const situpAnalyzerRef = useRef(new SitupAnalyzer());

  useEffect(() => {
    if (poseResults?.poseLandmarks) {
      analyzeForm();
    }
  }, [poseResults, selectedExercise]);

  const analyzeForm = () => {
    if (!selectedExercise) {
      setFeedback(['Select an exercise to start analysis']);
      return;
    }

    const exerciseConfig = getExercise(selectedExercise.id);
    if (!exerciseConfig) {
      setFeedback(['Unknown exercise selected']);
      return;
    }

    if (exerciseConfig.type === 'time') {
      analyzePlank();
    } else {
      analyzeRepBasedExercise();
    }
  };

  const analyzePlank = () => {
    const plankResult = plankAnalyzerRef.current.analyze(poseResults.poseLandmarks);
    
    setPlankHoldTime(plankResult.holdTime);
    setPlankStability(plankResult.stability);
    setFormScore(plankResult.bodyAlignment.score);
    setFeedback(plankResult.feedback);
    
    if (plankResult.isPlank) {
      setExercisePhase('holding');
    } else {
      setExercisePhase('ready');
    }

    if (onRepDetected && plankResult.isPlank && plankResult.holdTime > 0) {
      onRepDetected('plank', plankResult.holdTime, plankResult.bodyAlignment.score);
    }
  };

  const analyzeRepBasedExercise = () => {
    const rawAngles = getBodyAngles(poseResults.poseLandmarks);
    setCurrentAngles(rawAngles);
    
    if (!areAnglesValid(rawAngles)) {
      setFeedback(['Move into camera view for better tracking']);
      setFormScore(0);
      return;
    }

    const smoothed = smootherRef.current.smooth(rawAngles);
    setSmoothedAngles(smoothed);

    // Route to specific exercise analysis
    switch (selectedExercise.id) {
      case 'squats':
        analyzeAdvancedSquat(smoothed);
        break;
      case 'pushups':
        analyzeAdvancedPushup(smoothed);
        break;
      case 'lunges':
        analyzeLunges(smoothed);
        break;
      case 'bicepCurls':
        analyzeBicepCurls(smoothed);
        break;
      case 'shoulderPress':
        analyzeShoulderPress(smoothed);
        break;
      case 'situps':
        analyzeSitups(smoothed);
        break;
      case 'deadlifts':
        analyzeDeadlifts(smoothed);
        break;
      default:
        // Generic analysis for other exercises
        analyzeGenericExercise(smoothed);
        break;
    }
  };

  const analyzeAdvancedSquat = (angles) => {
    const qualityResult = scorerRef.current.scoreSquat(angles, poseResults.poseLandmarks);
    
    const advancedResult = squatAnalyzerRef.current.analyze(angles, poseResults.poseLandmarks);
    
    const combinedFeedback = [...qualityResult.feedback];
    
    if (!advancedResult.kneeTracking.overall) {
      combinedFeedback.push('Keep knees aligned over toes');
    }
    if (advancedResult.tempo.speed === 'too fast') {
      combinedFeedback.push('Slow down - control the movement');
    }
    if (advancedResult.tempo.speed === 'too slow') {
      combinedFeedback.push('Move with more purpose');
    }
    if (!advancedResult.symmetry.overall) {
      combinedFeedback.push('Keep both sides even');
    }

    setFormScore(qualityResult.score);
    setFeedback(combinedFeedback);

    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    
    if (exercisePhase === 'ready' && avgKneeAngle < 135) {
      setExercisePhase('down');
    } 
    else if (exercisePhase === 'down' && avgKneeAngle < 85) {
      const depthFeedback = advancedResult.depth.quality === 'deep' ? 
        'Perfect depth!' : 
        advancedResult.depth.quality === 'good' ? 
        'Good depth!' : 
        'Go deeper for better results';
      setFeedback([depthFeedback, ...combinedFeedback]);
    }
    else if (exercisePhase === 'down' && avgKneeAngle > 155) {
      setExercisePhase('ready');
      setRepCount(prev => prev + 1);
      
      const repFeedback = qualityResult.score >= 80 ? 
        `Excellent squat! Rep ${repCount + 1}` : 
        `Rep ${repCount + 1} - work on form`;
      
      setFeedback([repFeedback]);
      
      if (onRepDetected) {
        onRepDetected('squat', repCount + 1, qualityResult.score);
      }
    }
  };

  const analyzeAdvancedPushup = (angles) => {
    const qualityResult = scorerRef.current.scorePushup(angles, poseResults.poseLandmarks);
    
    const advancedResult = pushupAnalyzerRef.current.analyze(angles, poseResults.poseLandmarks);
    
    const combinedFeedback = [...qualityResult.feedback];
    
    if (!advancedResult.bodyPlank.isPlank) {
      if (advancedResult.bodyPlank.quality === 'sagging') {
        combinedFeedback.push('Engage core - prevent sagging');
      } else if (advancedResult.bodyPlank.quality === 'piking') {
        combinedFeedback.push('Lower hips - maintain straight line');
      }
    }
    
    if (advancedResult.elbowDirection.flaring) {
      combinedFeedback.push('Keep elbows closer to body');
    }
    
    if (advancedResult.handPlacement.quality === 'needs adjustment') {
      combinedFeedback.push('Adjust hand position under shoulders');
    }

    setFormScore(qualityResult.score);
    setFeedback(combinedFeedback);

    const avgElbowAngle = (angles.leftElbow + angles.rightElbow) / 2;
    
    if (exercisePhase === 'ready' && avgElbowAngle < 150) {
      setExercisePhase('down');
    }
    else if (exercisePhase === 'down' && avgElbowAngle < 85) {
      const depthFeedback = advancedResult.range.quality === 'full' ? 
        'Perfect depth!' : 
        advancedResult.range.quality === 'good' ? 
        'Good depth!' : 
        'Go lower for full range';
      setFeedback([depthFeedback, ...combinedFeedback]);
    }
    else if (exercisePhase === 'down' && avgElbowAngle > 150) {
      setExercisePhase('ready');
      setRepCount(prev => prev + 1);
      
      const repFeedback = qualityResult.score >= 80 ? 
        `Great push-up! Rep ${repCount + 1}` : 
        `Rep ${repCount + 1} - improve form`;
      
      setFeedback([repFeedback]);
      
      if (onRepDetected) {
        onRepDetected('pushup', repCount + 1, qualityResult.score);
      }
    }
  };

  const analyzeLunges = (angles) => {
    const lungeResult = lungeAnalyzerRef.current.analyze(poseResults.poseLandmarks);
    
    const combinedScore = Math.min(100, lungeResult.balance + lungeResult.depth);
    setFormScore(combinedScore);
    setFeedback(lungeResult.feedback);

    if (lungeResult.isLunge && lungeResult.depth > 70) {
      if (exercisePhase === 'ready') {
        setExercisePhase('lunge');
        setRepCount(prev => prev + 1);
        
        if (onRepDetected) {
          onRepDetected('lunge', repCount + 1, combinedScore);
        }
        
        // Reset to ready after short delay
        setTimeout(() => {
          setExercisePhase('ready');
        }, 1000);
      }
    }
  };

  const analyzeBicepCurls = (angles) => {
    const curlResult = bicepCurlAnalyzerRef.current.analyze(poseResults.poseLandmarks);
    
    setFormScore(curlResult.shoulderStability);
    setFeedback(curlResult.feedback);

    const avgAngle = (curlResult.leftArmAngle + curlResult.rightArmAngle) / 2;
    
    if (exercisePhase === 'ready' && avgAngle < 100) {
      setExercisePhase('up');
    }
    else if (exercisePhase === 'up' && avgAngle > 140) {
      setExercisePhase('ready');
      setRepCount(prev => prev + 1);
      
      if (onRepDetected) {
        onRepDetected('bicepCurl', repCount + 1, curlResult.shoulderStability);
      }
    }
  };

  const analyzeShoulderPress = (angles) => {
    const pressResult = shoulderPressAnalyzerRef.current.analyze(poseResults.poseLandmarks);
    
    setFormScore(pressResult.coreStability);
    setFeedback(pressResult.feedback);

    const avgAngle = (pressResult.leftShoulderAngle + pressResult.rightShoulderAngle) / 2;
    
    if (exercisePhase === 'ready' && avgAngle > 140) {
      setExercisePhase('up');
      setRepCount(prev => prev + 1);
      
      if (onRepDetected) {
        onRepDetected('shoulderPress', repCount + 1, pressResult.coreStability);
      }
    }
    else if (exercisePhase === 'up' && avgAngle < 100) {
      setExercisePhase('ready');
    }
  };

  const analyzeSitups = (angles) => {
    const situpResult = situpAnalyzerRef.current.analyze(poseResults.poseLandmarks);
    
    setFormScore(situpResult.neckStrain);
    setFeedback(situpResult.feedback);

    if (exercisePhase === 'ready' && situpResult.isSittingUp && situpResult.torsoAngle < 60) {
      setExercisePhase('up');
      setRepCount(prev => prev + 1);
      
      if (onRepDetected) {
        onRepDetected('situp', repCount + 1, situpResult.neckStrain);
      }
    }
    else if (exercisePhase === 'up' && !situpResult.isSittingUp) {
      setExercisePhase('ready');
    }
  };

  const analyzeDeadlifts = (angles) => {
    // Basic deadlift analysis using hip and knee angles
    const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;
    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    
    let score = 100;
    const feedback: string[] = [];
    
    // Check hip hinge (primary movement should be at hips)
    if (avgHipAngle > 140) {
      score -= 20;
      feedback.push('Hinge more at the hips');
    }
    
    // Check knee tracking
    if (Math.abs(angles.leftKnee - angles.rightKnee) > 15) {
      score -= 15;
      feedback.push('Keep knees aligned');
    }
    
    setFormScore(Math.max(0, score));
    setFeedback(feedback.length > 0 ? feedback : ['Good deadlift form!']);
    
    // Simple rep counting based on hip angle
    if (exercisePhase === 'ready' && avgHipAngle < 110) {
      setExercisePhase('down');
    }
    else if (exercisePhase === 'down' && avgHipAngle > 150) {
      setExercisePhase('ready');
      setRepCount(prev => prev + 1);
      
      if (onRepDetected) {
        onRepDetected('deadlift', repCount + 1, score);
      }
    }
  };

  const analyzeGenericExercise = (angles) => {
    // Generic analysis for exercises without specific logic
    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    const avgElbowAngle = (angles.leftElbow + angles.rightElbow) / 2;
    
    let score = 80; // Base score for generic exercises
    const feedback = ['Exercise detected - maintain good form'];
    
    // Basic symmetry check
    if (Math.abs(angles.leftKnee - angles.rightKnee) > 20) {
      score -= 10;
      feedback.push('Keep both sides balanced');
    }
    
    if (Math.abs(angles.leftElbow - angles.rightElbow) > 25) {
      score -= 10;
      feedback.push('Keep arm movements synchronized');
    }
    
    setFormScore(Math.max(0, score));
    setFeedback(feedback);
    
    // Simple rep detection based on significant angle changes
    if (!lastRepAngles) {
      setLastRepAngles(angles);
      return;
    }
    
    const kneeChange = Math.abs(avgKneeAngle - ((lastRepAngles.leftKnee + lastRepAngles.rightKnee) / 2));
    const elbowChange = Math.abs(avgElbowAngle - ((lastRepAngles.leftElbow + lastRepAngles.rightElbow) / 2));
    
    if (kneeChange > 30 || elbowChange > 30) {
      if (exercisePhase === 'ready') {
        setExercisePhase('active');
        setRepCount(prev => prev + 1);
        
        if (onRepDetected) {
          onRepDetected(selectedExercise.id, repCount + 1, score);
        }
        
        // Reset after delay
        setTimeout(() => {
          setExercisePhase('ready');
          setLastRepAngles(angles);
        }, 1500);
      }
    }
  };

  const resetAnalysis = () => {
    setRepCount(0);
    setPlankHoldTime(0);
    setPlankStability(0);
    setExercisePhase('ready');
    setFormScore(0);
    setFeedback([]);
    setLastRepAngles(null);
    smootherRef.current.reset();
    plankAnalyzerRef.current.reset();
    squatAnalyzerRef.current.reset();
    pushupAnalyzerRef.current.reset();
    lungeAnalyzerRef.current.reset();
    bicepCurlAnalyzerRef.current.reset();
    shoulderPressAnalyzerRef.current.reset();
    situpAnalyzerRef.current.reset();
  };

  const isTimeBasedExercise = selectedExercise && getExercise(selectedExercise.id)?.type === 'time';

  return (
    <div>
      {/* Enhanced feedback display */}
      <FeedbackDisplay
        currentPhase={exercisePhase}
        repCount={isTimeBasedExercise ? plankHoldTime : repCount}
        formScore={formScore}
        feedback={feedback}
        exerciseType={selectedExercise?.name || 'Exercise'}
        isTimeBasedExercise={isTimeBasedExercise}
        plankStability={plankStability}
      />

      {/* Reset button */}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          onClick={resetAnalysis}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          Reset Analysis
        </button>
      </div>

      {/* Exercise-specific debug info */}
      {smoothedAngles && (
        <details style={{ marginTop: '15px', fontSize: '12px' }}>
          <summary style={{ cursor: 'pointer', color: '#6c757d' }}>
            Advanced Debug Info
          </summary>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '5px'
          }}>
            {isTimeBasedExercise ? (
              <div>
                <strong>Plank Analysis:</strong><br />
                Hold Time: {plankHoldTime}s<br />
                Stability: {plankStability}%<br />
                Phase: {exercisePhase}
              </div>
            ) : (
              <div>
                <strong>Rep Analysis:</strong><br />
                Left Knee: {smoothedAngles.leftKnee}° | Right Knee: {smoothedAngles.rightKnee}°<br />
                Left Elbow: {smoothedAngles.leftElbow}° | Right Elbow: {smoothedAngles.rightElbow}°<br />
                Phase: {exercisePhase}
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

export default FormAnalyzer;