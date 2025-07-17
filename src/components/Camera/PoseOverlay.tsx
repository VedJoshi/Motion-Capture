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
  }, [poseResults, videoWidth, videoHeight]);

  const drawPose = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (poseResults.poseLandmarks) {
      drawConnectors(ctx, poseResults.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      
      drawLandmarks(ctx, poseResults.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
        radius: 6
      });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        objectFit: 'cover'
      }}
    />
  );
}

export default PoseOverlay;