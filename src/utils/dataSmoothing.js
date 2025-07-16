/**
 * Moving average filter implementation for pose data smoothing.
 * Reduces noise in angle measurements and provides more stable readings.
 */

// Moving average filter to smooth noisy angle data
export class MovingAverage {
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
    this.values = [];
  }

  // Add new value and return smoothed result
  addValue(value) {
    if (value === null || value === undefined) {
      return this.getAverage();
    }

    this.values.push(value);
    
    // Keep only the last N values
    if (this.values.length > this.windowSize) {
      this.values.shift();
    }
    
    return this.getAverage();
  }

  // Calculate current average
  getAverage() {
    if (this.values.length === 0) return null;
    
    const sum = this.values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / this.values.length);
  }

  // Reset the filter
  reset() {
    this.values = [];
  }
}

// Smoothed angle calculator
export class SmoothedAngles {
  constructor() {
    this.filters = {
      leftKnee: new MovingAverage(5),
      rightKnee: new MovingAverage(5),
      leftElbow: new MovingAverage(5),
      rightElbow: new MovingAverage(5),
      leftHip: new MovingAverage(5),
      rightHip: new MovingAverage(5)
    };
  }

  // Process raw angles and return smoothed versions
  smooth(rawAngles) {
    if (!rawAngles) return null;

    return {
      leftKnee: this.filters.leftKnee.addValue(rawAngles.leftKnee),
      rightKnee: this.filters.rightKnee.addValue(rawAngles.rightKnee),
      leftElbow: this.filters.leftElbow.addValue(rawAngles.leftElbow),
      rightElbow: this.filters.rightElbow.addValue(rawAngles.rightElbow),
      leftHip: this.filters.leftHip.addValue(rawAngles.leftHip),
      rightHip: this.filters.rightHip.addValue(rawAngles.rightHip)
    };
  }

  // Reset all filters
  reset() {
    Object.values(this.filters).forEach(filter => filter.reset());
  }
}

// Detect if movement is stable (not changing rapidly)
export function isMovementStable(angles, previousAngles, threshold = 5) {
 if (!angles || !previousAngles) return false;

 const kneeChange = Math.abs(angles.leftKnee - previousAngles.leftKnee);
 const elbowChange = Math.abs(angles.leftElbow - previousAngles.leftElbow);
 
 return kneeChange < threshold && elbowChange < threshold;
}