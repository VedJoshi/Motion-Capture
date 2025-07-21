import React, { useRef, useEffect, useState } from 'react';
import PoseDetector from '../../utils/poseDetection.tsx';
import PoseOverlay from './PoseOverlay.tsx';
import CameraControls from './CameraControls.tsx';

/**
 * Manages webcam video feed and pose detection visualization.
 * Handles camera initialization, permissions and MediaPipe integration.
 */
function CameraView({ onPoseResults }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [poseResults, setPoseResults] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
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
          width: 1280,
          height: 720,
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        
        videoRef.current.onloadedmetadata = async () => {
          const videoElement = videoRef.current;
          setVideoDimensions({
            width: videoElement.videoWidth,
            height: videoElement.videoHeight
          });
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
        
        if (onPoseResults) {
          onPoseResults(results);
        }
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
    <div style={{ 
      textAlign: 'center',
      maxWidth: '100%',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <CameraControls 
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        isCameraActive={isCameraActive}
      />
      
      {isLoading && (
        <div style={{ 
          padding: '1.25rem', 
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', 
          borderRadius: 'var(--border-radius-lg)', 
          color: 'var(--primary-color)',
          margin: '1rem 0',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>🤖 Loading camera and AI model...</p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: 'var(--danger-color)', 
          marginBottom: '1.25rem',
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>❌ {error}</p>
        </div>
      )}

      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          margin: '1rem auto',
          borderRadius: 'var(--border-radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--neutral-200)',
          background: 'var(--surface-white)'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: 'auto',
            height: 'auto',
            display: error ? 'none' : 'block',
            maxHeight: '60vh',
            maxWidth: '100%'
          }}
        />
        
        {isCameraActive && poseResults && (
          <PoseOverlay 
            poseResults={poseResults}
            videoWidth={videoDimensions.width}
            videoHeight={videoDimensions.height}
          />
        )}
      </div>
      
      {/* Professional debug information panel */}
      <div style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.875rem',
          textAlign: 'left',
          width: '100%',
          maxWidth: '800px',
          minHeight: '140px',
          background: 'var(--surface-white)',
          padding: '1.5rem',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--neutral-200)',
          boxSizing: 'border-box',
          fontFamily: '"JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          boxShadow: 'var(--shadow-sm)',
          margin: '1.5rem auto 0 auto'
      }}>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--neutral-700)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔍 Detection Status
          </div>
          {poseResults?.poseLandmarks ? (
            <div style={{ color: 'var(--success-color)', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                ✅ <strong>Landmarks detected:</strong> {poseResults.poseLandmarks.length}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                📐 <strong>Video dimensions:</strong> {videoDimensions.width} x {videoDimensions.height}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                👈 <strong>Left wrist:</strong> {poseResults.poseLandmarks[15] ? 
                `(${poseResults.poseLandmarks[15].x.toFixed(2)}, ${poseResults.poseLandmarks[15].y.toFixed(2)})` 
                : 'Not detected'}
              </div>
              <div>
                👉 <strong>Right wrist:</strong> {poseResults.poseLandmarks[16] ? 
                `(${poseResults.poseLandmarks[16].x.toFixed(2)}, ${poseResults.poseLandmarks[16].y.toFixed(2)})` 
                : 'Not detected'}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--neutral-500)', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '0.5rem' }}>⚠️ No pose detected</div>
              <div style={{ marginBottom: '0.5rem' }}>📍 Move into camera view to start detection</div>
              <div>💡 Ensure good lighting and full body visibility</div>
            </div>
          )}
      </div>
      
      {isCameraActive && (
        <div style={{ 
          marginTop: '1.25rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success-color)',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            ✅ Camera Active
          </div>
          {poseResults?.poseLandmarks ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--secondary-color)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              🤸 Pose Detected
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--warning-color)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              👀 Waiting for pose...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraView;