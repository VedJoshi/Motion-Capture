/**
 * Evaluates exercise form quality and provides feedback based on pose detection data.
 */
export class FormQualityScorer {
  
  // Score squat form (0-100)
  scoreSquat(angles, landmarks) {
    let score = 100;
    const feedback = [];

    if (!angles || !landmarks) return { score: 0, feedback: ['Cannot detect pose'] };

    // Check knee symmetry (both knees should be similar)
    const kneeDifference = Math.abs(angles.leftKnee - angles.rightKnee);
    if (kneeDifference > 15) {
      score -= 20;
      feedback.push('Keep both knees aligned');
    }

    // Check squat depth (good depth = knee angle < 90°)
    const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
    if (avgKneeAngle > 110) {
      score -= 15;
      feedback.push('Go deeper - bend knees more');
    }

    // Check hip hinge (hips should bend, not just knees)
    const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;
    if (avgHipAngle > 140) {
      score -= 10;
      feedback.push('Push hips back more');
    }

    // Check knee tracking (knees shouldn't cave inward)
    const kneeTracking = this.checkKneeTracking(landmarks);
    if (!kneeTracking.good) {
      score -= 25;
      feedback.push('Keep knees over toes');
    }

    return {
      score: Math.max(0, score),
      feedback: feedback.length > 0 ? feedback : ['Good form!']
    };
  }

  // Score push-up form (0-100)
  scorePushup(angles, landmarks) {
    let score = 100;
    const feedback = [];

    if (!angles || !landmarks) return { score: 0, feedback: ['Cannot detect pose'] };

    // Check elbow symmetry
    const elbowDifference = Math.abs(angles.leftElbow - angles.rightElbow);
    if (elbowDifference > 20) {
      score -= 20;
      feedback.push('Keep both arms moving together');
    }

    // Check push-up depth
    const avgElbowAngle = (angles.leftElbow + angles.rightElbow) / 2;
    if (avgElbowAngle > 120) {
      score -= 15;
      feedback.push('Go lower - bend elbows more');
    }

    // Check body alignment (straight line from head to feet)
    const bodyAlignment = this.checkBodyAlignment(landmarks);
    if (!bodyAlignment.good) {
      score -= 30;
      feedback.push('Keep body straight - no sagging');
    }

    return {
      score: Math.max(0, score),
      feedback: feedback.length > 0 ? feedback : ['Excellent form!']
    };
  }

  // Check if knees are tracking properly (not caving inward)
  checkKneeTracking(landmarks) {
    try {
      const leftHip = landmarks[23];
      const leftKnee = landmarks[25];
      const leftAnkle = landmarks[27];
      
      const rightHip = landmarks[24];
      const rightKnee = landmarks[26];
      const rightAnkle = landmarks[28];

      // Simple check: knee should be between hip and ankle horizontally
      const leftTracking = leftKnee.x > Math.min(leftHip.x, leftAnkle.x) && 
                          leftKnee.x < Math.max(leftHip.x, leftAnkle.x);
      
      const rightTracking = rightKnee.x > Math.min(rightHip.x, rightAnkle.x) && 
                           rightKnee.x < Math.max(rightHip.x, rightAnkle.x);

      return { good: leftTracking && rightTracking };
    } catch (error) {
      return { good: true }; // If we can't check, assume it's okay
    }
  }

  // Check body alignment for push-ups
  checkBodyAlignment(landmarks) {
    try {
      const nose = landmarks[0];
      const leftHip = landmarks[23];
      const leftAnkle = landmarks[27];

      // Calculate if head, hip, and ankle are roughly in a straight line
      const headToHip = Math.abs(nose.y - leftHip.y);
      const hipToAnkle = Math.abs(leftHip.y - leftAnkle.y);
      
      // Body should be relatively straight (not perfect, but close)
      const alignmentRatio = headToHip / hipToAnkle;
      
      return { good: alignmentRatio > 0.3 && alignmentRatio < 3.0 };
    } catch (error) {
      return { good: true }; // If we can't check, assume it's okay
    }
  }
}