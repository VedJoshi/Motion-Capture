/**
 * Calculates the angle between three points where pointB is the vertex
 * @param {Object} pointA - First point with x, y coordinates
 * @param {Object} pointB - Vertex point with x, y coordinates
 * @param {Object} pointC - Third point with x, y coordinates
 * @returns {number|null} Angle in degrees (0-180) or null if invalid points
 */
export function calculateAngle(pointA, pointB, pointC) {
  if (!pointA || !pointB || !pointC) {
    return null;
  }

  const vectorBA = {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  };
  
  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y
  };

  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
  
  const magnitudeBA = Math.sqrt(vectorBA.x ** 2 + vectorBA.y ** 2);
  const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);
  
  const angleRadians = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
  const angleDegrees = (angleRadians * 180) / Math.PI;
  
  return Math.round(angleDegrees);
}

/**
 * Extracts joint angles from MediaPipe pose landmarks
 * @param {Array} landmarks - Array of pose landmarks from MediaPipe
 * @returns {Object|null} Object containing calculated angles or null if insufficient landmarks
 */
export function getBodyAngles(landmarks) {
  if (!landmarks || landmarks.length < 33) {
    return null;
  }

  const POSE_LANDMARKS = {
    LEFT_HIP: 23,
    LEFT_KNEE: 25,
    LEFT_ANKLE: 27,
    RIGHT_HIP: 24,
    RIGHT_KNEE: 26,
    RIGHT_ANKLE: 28,
    LEFT_SHOULDER: 11,
    LEFT_ELBOW: 13,
    LEFT_WRIST: 15,
    RIGHT_SHOULDER: 12,
    RIGHT_ELBOW: 14,
    RIGHT_WRIST: 16
  };

  return {
    leftKnee: calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE]
    ),
    rightKnee: calculateAngle(
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      landmarks[POSE_LANDMARKS.RIGHT_ANKLE]
    ),
    
    leftElbow: calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_ELBOW],
      landmarks[POSE_LANDMARKS.LEFT_WRIST]
    ),
    rightElbow: calculateAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
      landmarks[POSE_LANDMARKS.RIGHT_WRIST]
    ),
    
    leftHip: calculateAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE]
    ),
    rightHip: calculateAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE]
    )
  };
}

/**
 * Validates if calculated angles indicate proper pose detection
 * @param {Object} angles - Calculated body angles
 * @returns {boolean} True if angles are valid for analysis
 */
export function areAnglesValid(angles) {
  if (!angles) return false;
  
  const leftValid = angles.leftKnee !== null && angles.leftHip !== null;
  const rightValid = angles.rightKnee !== null && angles.rightHip !== null;
  
  return leftValid || rightValid;
}