import React, { useRef, useEffect, useState } from 'react';
import PoseDetector from '../../utils/poseDetection.tsx';
import PoseOverlay from './PoseOverlay.tsx';
import CameraControls from './CameraControls.tsx';

/**
 * Camera interface with pose detection integration
 */
function CameraView() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [poseResults, setPoseResults] = useState(null);
  const [poseDetector] = useState(() => new PoseDetector());

  useEffect(() => {
    return () => {
      stopCamera();
      poseDetector.stop();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        
        videoRef.current.onloadedmetadata = async () => {
          await initializePoseDetection();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Cannot access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializePoseDetection = async () => {
    try {
      console.log('Initializing pose detection...');
      
      await poseDetector.initialize(videoRef.current, (results) => {
        setPoseResults(results);
        
        if (results.poseLandmarks) {
          console.log(`Detected ${results.poseLandmarks.length} landmarks`);
        }
      });
      
      poseDetector.start();
      console.log('Pose detection started!');
      
    } catch (err) {
      console.error('Pose detection error:', err);
      setError('Failed to initialize pose detection');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
      setPoseResults(null);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {isLoading && <p>Loading camera and AI model...</p>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{error}</p>
          <button onClick={startCamera}>Try Again</button>
        </div>
      )}

      <CameraControls 
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        isCameraActive={isCameraActive}
      />
      
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          display: 'inline-block',
          maxWidth: '640px'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: 'auto',
            border: '2px solid #3498db',
            borderRadius: '8px',
            display: error ? 'none' : 'block'
          }}
        />
        
        {isCameraActive && poseResults && (
          <PoseOverlay 
            poseResults={poseResults}
            videoWidth={640}
            videoHeight={480}
          />
        )}
      </div>
      {/* Debug information panel */}
        {poseResults?.poseLandmarks && (
        <div style={{ 
            marginTop: '10px', 
            fontSize: '12px',
            textAlign: 'left',
            maxWidth: '640px',
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px'
        }}>
            <strong>Debug Info:</strong>
            <br />
            Landmarks detected: {poseResults.poseLandmarks.length}
            <br />
            Left wrist: {poseResults.poseLandmarks[15] ? 
            `(${poseResults.poseLandmarks[15].x.toFixed(2)}, ${poseResults.poseLandmarks[15].y.toFixed(2)})` 
            : 'Not detected'}
            <br />
            Right wrist: {poseResults.poseLandmarks[16] ? 
            `(${poseResults.poseLandmarks[16].x.toFixed(2)}, ${poseResults.poseLandmarks[16].y.toFixed(2)})` 
            : 'Not detected'}
        </div>
        )}
      {isCameraActive && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: 'green' }}>✅ Camera active</p>
          {poseResults?.poseLandmarks ? (
            <p style={{ color: 'blue' }}>🤖 AI tracking your pose!</p>
          ) : (
            <p style={{ color: 'orange' }}>Move into camera view</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraView;