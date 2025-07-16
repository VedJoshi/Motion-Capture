import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

/**
 * Handles MediaPipe pose detection and camera integration
 */
class PoseDetector {
  private pose: Pose | null;
  private camera: Camera | null;
  private onResults: ((results: any) => void) | null;

  constructor() {
    this.pose = null;
    this.camera = null;
    this.onResults = null;
  }

  /**
   * Initializes pose detection with video element and result callback
   */
  async initialize(videoElement: HTMLVideoElement, onResults: (results: any) => void): Promise<void> {
    this.onResults = onResults;
    
    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults(this.onResults);

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.pose) {
          await this.pose.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });
  }

  start(): void {
    if (this.camera) {
      this.camera.start();
    }
  }

  stop(): void {
    if (this.camera) {
      this.camera.stop();
    }
  }
}

export default PoseDetector;