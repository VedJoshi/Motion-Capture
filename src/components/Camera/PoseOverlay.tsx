import React, { useRef, useEffect } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

/**
 * Canvas overlay for rendering pose detection results
 */
function PoseOverlay({ poseResults, videoWidth, videoHeight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (poseResults && canvasRef.current) {
      drawPose();
    }
  }, [poseResults]);

  const drawPose = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (poseResults.poseLandmarks) {
      // Draw skeleton connections
      drawConnectors(ctx, poseResults.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });
      
      // Draw joint points
      drawLandmarks(ctx, poseResults.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}

export default PoseOverlay;