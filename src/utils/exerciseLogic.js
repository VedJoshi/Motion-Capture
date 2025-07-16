/**
 * Exercise-specific logic for analyzing plank form.
 * Tracks hold time, stability, and proper body alignment.
 */

import { calculateAngle } from './angleCalculation';

// Plank-specific analysis
export class PlankAnalyzer {
    constructor() {
        this.startTime = null;
        this.stabilityHistory = [];
        this.positionHistory = [];
    }

    analyze(landmarks) {
        if (!landmarks || landmarks.length < 33) {
            return {
                isPlank: false,
                holdTime: 0,
                stability: 0,
                feedback: ['Cannot detect pose']
            };
        }

        const analysis = {
            isPlank: this.detectPlankPosition(landmarks),
            stability: this.calculateStability(landmarks),
            bodyAlignment: this.checkBodyAlignment(landmarks),
            holdTime: this.calculateHoldTime(),
            feedback: []
        };

        // Generate feedback based on analysis
        analysis.feedback = this.generateFeedback(analysis);

        return analysis;
    }

    detectPlankPosition(landmarks) {
        try {
            // Check if person is in plank position
            const nose = landmarks[0];
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftHip = landmarks[23];
            const rightHip = landmarks[24];
            const leftAnkle = landmarks[27];
            const rightAnkle = landmarks[28];

            // Calculate average positions
            const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
            const hipY = (leftHip.y + rightHip.y) / 2;
            const ankleY = (leftAnkle.y + rightAnkle.y) / 2;

            // In plank: shoulders should be higher than hips, hips higher than ankles
            const shoulderHipDiff = shoulderY - hipY;
            const hipAnkleDiff = hipY - ankleY;

            // Check if body is roughly horizontal (plank position)
            const isHorizontal = Math.abs(shoulderHipDiff) < 0.15 && Math.abs(hipAnkleDiff) < 0.15;

            // Check if person is low enough (not standing)
            const isLowEnough = shoulderY > 0.3; // Below top 30% of frame

            return isHorizontal && isLowEnough;
        } catch (error) {
            return false;
        }
    }

    calculateStability(landmarks) {
        try {
            // Track core landmark positions for stability
            const corePoints = [
                landmarks[11], // left shoulder
                landmarks[12], // right shoulder
                landmarks[23], // left hip
                landmarks[24], // right hip
            ];

            // Calculate current position centroid
            const currentPosition = {
                x: corePoints.reduce((sum, point) => sum + point.x, 0) / corePoints.length,
                y: corePoints.reduce((sum, point) => sum + point.y, 0) / corePoints.length
            };

            // Store position history
            this.positionHistory.push(currentPosition);
            if (this.positionHistory.length > 30) { // Keep last 30 frames (1 second at 30fps)
                this.positionHistory.shift();
            }

            // Calculate stability (lower movement = higher stability)
            if (this.positionHistory.length < 2) return 0;

            let totalMovement = 0;
            for (let i = 1; i < this.positionHistory.length; i++) {
                const prev = this.positionHistory[i - 1];
                const curr = this.positionHistory[i];
                const movement = Math.sqrt(
                    Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
                );
                totalMovement += movement;
            }

            const avgMovement = totalMovement / (this.positionHistory.length - 1);
            const stability = Math.max(0, 100 - (avgMovement * 1000)); // Scale and invert

            return Math.round(stability);
        } catch (error) {
            return 0;
        }
    }

    checkBodyAlignment(landmarks) {
        try {
            const nose = landmarks[0];
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftHip = landmarks[23];
            const rightHip = landmarks[24];
            const leftAnkle = landmarks[27];
            const rightAnkle = landmarks[28];

            // Calculate average positions
            const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
            const hipY = (leftHip.y + rightHip.y) / 2;
            const ankleY = (leftAnkle.y + rightAnkle.y) / 2;

            // Check if body forms a straight line
            const shoulderHipDiff = Math.abs(shoulderY - hipY);
            const hipAnkleDiff = Math.abs(hipY - ankleY);
            const totalDiff = shoulderHipDiff + hipAnkleDiff;

            // Good alignment = small differences
            const alignmentScore = Math.max(0, 100 - (totalDiff * 500));

            return {
                score: Math.round(alignmentScore),
                isGood: alignmentScore > 70
            };
        } catch (error) {
            return { score: 0, isGood: false };
        }
    }

    calculateHoldTime() {
        if (!this.startTime) {
            this.startTime = Date.now();
            return 0;
        }
        return Math.round((Date.now() - this.startTime) / 1000);
    }

    generateFeedback(analysis) {
        const feedback = [];

        if (!analysis.isPlank) {
            feedback.push('Get into plank position');
            this.reset();
            return feedback;
        }

        // Start timing if in plank
        if (!this.startTime) {
            this.startTime = Date.now();
        }

        // Stability feedback
        if (analysis.stability < 50) {
            feedback.push('Keep your body still and stable');
        } else if (analysis.stability > 80) {
            feedback.push('Great stability!');
        }

        // Alignment feedback
        if (analysis.bodyAlignment.score < 60) {
            feedback.push('Keep your body in a straight line');
        } else if (analysis.bodyAlignment.score > 80) {
            feedback.push('Perfect body alignment!');
        }

        // Time-based encouragement
        if (analysis.holdTime > 30) {
            feedback.push(`Amazing! ${analysis.holdTime} seconds!`);
        } else if (analysis.holdTime > 15) {
            feedback.push(`Great job! ${analysis.holdTime} seconds`);
        }

        return feedback.length > 0 ? feedback : ['Hold the plank position'];
    }

    reset() {
        this.startTime = null;
        this.stabilityHistory = [];
        this.positionHistory = [];
    }
}

// Advanced squat analysis
export class AdvancedSquatAnalyzer {
    constructor() {
        this.depthHistory = [];
        this.tempoData = [];
    }

    analyze(angles, landmarks) {
        return {
            depth: this.analyzeDepth(angles),
            kneeTracking: this.analyzeKneeTracking(landmarks),
            tempo: this.analyzeTempo(angles),
            symmetry: this.analyzeSymmetry(angles)
        };
    }

    analyzeDepth(angles) {
        const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;

        // Track depth consistency
        this.depthHistory.push(avgKneeAngle);
        if (this.depthHistory.length > 10) {
            this.depthHistory.shift();
        }

        // Calculate depth quality
        let depthQuality = 'shallow';
        if (avgKneeAngle < 70) depthQuality = 'deep';
        else if (avgKneeAngle < 90) depthQuality = 'good';
        else if (avgKneeAngle < 110) depthQuality = 'moderate';

        return {
            angle: avgKneeAngle,
            quality: depthQuality,
            consistency: this.calculateConsistency(this.depthHistory)
        };
    }

    analyzeKneeTracking(landmarks) {
        try {
            // Check if knees are tracking over toes
            const leftKnee = landmarks[25];
            const rightKnee = landmarks[26];
            const leftAnkle = landmarks[27];
            const rightAnkle = landmarks[28];

            const leftTracking = Math.abs(leftKnee.x - leftAnkle.x) < 0.05;
            const rightTracking = Math.abs(rightKnee.x - rightAnkle.x) < 0.05;

            return {
                left: leftTracking,
                right: rightTracking,
                overall: leftTracking && rightTracking
            };
        } catch (error) {
            return { left: true, right: true, overall: true };
        }
    }

    analyzeTempo(angles) {
        const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;

        this.tempoData.push({
            angle: avgKneeAngle,
            timestamp: Date.now()
        });

        // Keep last 3 seconds of data
        const cutoff = Date.now() - 3000;
        this.tempoData = this.tempoData.filter(d => d.timestamp > cutoff);

        if (this.tempoData.length < 10) {
            return { speed: 'unknown', quality: 'good' };
        }

        // Calculate movement speed
        const angleChange = Math.abs(this.tempoData[0].angle - this.tempoData[this.tempoData.length - 1].angle);
        const timeChange = this.tempoData[this.tempoData.length - 1].timestamp - this.tempoData[0].timestamp;
        const speed = angleChange / (timeChange / 1000); // degrees per second

        let speedQuality = 'good';
        if (speed > 60) speedQuality = 'too fast';
        else if (speed < 15) speedQuality = 'too slow';

        return {
            speed: speedQuality,
            quality: speedQuality === 'good' ? 'excellent' : 'needs adjustment'
        };
    }

    analyzeSymmetry(angles) {
        const kneeDiff = Math.abs(angles.leftKnee - angles.rightKnee);
        const hipDiff = Math.abs(angles.leftHip - angles.rightHip);

        return {
            kneeSymmetry: kneeDiff < 15,
            hipSymmetry: hipDiff < 15,
            overall: kneeDiff < 15 && hipDiff < 15,
            kneeDifference: kneeDiff,
            hipDifference: hipDiff
        };
    }

    calculateConsistency(history) {
        if (history.length < 3) return 100;

        const variance = history.reduce((sum, val, i, arr) => {
            if (i === 0) return 0;
            return sum + Math.pow(val - arr[i - 1], 2);
        }, 0) / (history.length - 1);

        return Math.max(0, 100 - variance);
    }

    reset() {
        this.depthHistory = [];
        this.tempoData = [];
    }
}

// Enhanced push-up analysis
export class AdvancedPushupAnalyzer {
    constructor() {
        this.rangeHistory = [];
    }

    analyze(angles, landmarks) {
        return {
            range: this.analyzeRange(angles),
            bodyPlank: this.analyzeBodyPlank(landmarks),
            elbowDirection: this.analyzeElbowDirection(landmarks),
            handPlacement: this.analyzeHandPlacement(landmarks)
        };
    }

    analyzeRange(angles) {
        const avgElbowAngle = (angles.leftElbow + angles.rightElbow) / 2;

        this.rangeHistory.push(avgElbowAngle);
        if (this.rangeHistory.length > 10) {
            this.rangeHistory.shift();
        }

        let rangeQuality = 'partial';
        if (avgElbowAngle < 70) rangeQuality = 'full';
        else if (avgElbowAngle < 90) rangeQuality = 'good';
        else if (avgElbowAngle < 120) rangeQuality = 'moderate';

        return {
            angle: avgElbowAngle,
            quality: rangeQuality,
            consistency: this.calculateConsistency(this.rangeHistory)
        };
    }

    analyzeBodyPlank(landmarks) {
        try {
            // Check if body maintains plank position during push-up
            const nose = landmarks[0];
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftHip = landmarks[23];
            const rightHip = landmarks[24];
            const leftKnee = landmarks[25];
            const rightKnee = landmarks[26];

            const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
            const hipY = (leftHip.y + rightHip.y) / 2;
            const kneeY = (leftKnee.y + rightKnee.y) / 2;

            // Check for sagging (hips too low) or piking (hips too high)
            const hipSag = hipY - shoulderY;
            const kneeSag = kneeY - hipY;

            const isPlank = Math.abs(hipSag) < 0.1 && Math.abs(kneeSag) < 0.1;

            return {
                isPlank: isPlank,
                hipSag: hipSag,
                quality: isPlank ? 'good' : (hipSag > 0.05 ? 'sagging' : 'piking')
            };
        } catch (error) {
            return { isPlank: true, hipSag: 0, quality: 'good' };
        }
    }

    analyzeElbowDirection(landmarks) {
        try {
            // Check if elbows are flaring out too much
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftElbow = landmarks[13];
            const rightElbow = landmarks[14];

            const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
            const elbowWidth = Math.abs(leftElbow.x - rightElbow.x);

            const flaringRatio = elbowWidth / shoulderWidth;

            return {
                flaring: flaringRatio > 1.3,
                ratio: flaringRatio,
                quality: flaringRatio < 1.2 ? 'good' : 'flaring'
            };
        } catch (error) {
            return { flaring: false, ratio: 1.0, quality: 'good' };
        }
    }

    analyzeHandPlacement(landmarks) {
        try {
            // Check if hands are positioned correctly relative to shoulders
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftWrist = landmarks[15];
            const rightWrist = landmarks[16];

            const leftHandOffset = Math.abs(leftWrist.x - leftShoulder.x);
            const rightHandOffset = Math.abs(rightWrist.x - rightShoulder.x);

            const avgOffset = (leftHandOffset + rightHandOffset) / 2;

            return {
                offset: avgOffset,
                quality: avgOffset < 0.05 ? 'perfect' :
                    avgOffset < 0.1 ? 'good' : 'needs adjustment'
            };
        } catch (error) {
            return { offset: 0, quality: 'good' };
        }
    }

    calculateConsistency(history) {
        if (history.length < 3) return 100;

        const variance = history.reduce((sum, val, i, arr) => {
            if (i === 0) return 0;
            return sum + Math.pow(val - arr[i - 1], 2);
        }, 0) / (history.length - 1);

        return Math.max(0, 100 - variance);
    }

    reset() {
        this.rangeHistory = [];
    }
}