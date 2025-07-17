import { calculateAngle } from './angleCalculation';

// Evaluates plank hold time and position stability
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

// Lunge analyzer
export class LungeAnalyzer {
    constructor() {
        this.stepHistory = [];
        this.balanceHistory = [];
        this.lastLegDetected = null;
    }

    analyze(landmarks) {
        if (!landmarks || landmarks.length < 33) {
            return {
                isLunge: false,
                legDetected: null,
                kneeAlignment: { front: 0, back: 0 },
                balance: 0,
                depth: 0,
                feedback: ['Cannot detect pose']
            };
        }

        const analysis = {
            isLunge: this.detectLungePosition(landmarks),
            legDetected: this.detectActiveLeg(landmarks),
            kneeAlignment: this.checkKneeAlignment(landmarks),
            balance: this.calculateBalance(landmarks),
            depth: this.calculateDepth(landmarks),
            feedback: []
        };

        analysis.feedback = this.generateFeedback(analysis);
        return analysis;
    }

    detectLungePosition(landmarks) {
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];

        // Check if legs are in split stance
        const ankleDistance = Math.abs(leftAnkle.x - rightAnkle.x);
        const kneeHeight = Math.abs(leftKnee.y - rightKnee.y);
        
        return ankleDistance > 0.15 && kneeHeight > 0.05;
    }

    detectActiveLeg(landmarks) {
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];
        
        // Front leg is the one more forward (lower x value in typical view)
        return leftAnkle.x < rightAnkle.x ? 'left' : 'right';
    }

    checkKneeAlignment(landmarks) {
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];

        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

        return {
            front: leftKneeAngle,
            back: rightKneeAngle,
            frontGood: leftKneeAngle >= 80 && leftKneeAngle <= 100,
            backGood: rightKneeAngle >= 80 && rightKneeAngle <= 100
        };
    }

    calculateBalance(landmarks) {
        const nose = landmarks[0];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        const centerHip = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
        };
        
        const balance = Math.abs(nose.x - centerHip.x);
        return Math.max(0, 100 - (balance * 500));
    }

    calculateDepth(landmarks) {
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        
        const avgHipHeight = (leftHip.y + rightHip.y) / 2;
        const avgKneeHeight = (leftKnee.y + rightKnee.y) / 2;
        
        const depth = avgKneeHeight - avgHipHeight;
        return Math.max(0, Math.min(100, depth * 500));
    }

    generateFeedback(analysis) {
        const feedback = [];
        
        if (!analysis.isLunge) {
            feedback.push('Step into lunge position');
            return feedback;
        }

        if (!analysis.kneeAlignment.frontGood) {
            feedback.push('Adjust front knee angle');
        }
        if (!analysis.kneeAlignment.backGood) {
            feedback.push('Lower back knee more');
        }
        if (analysis.balance < 70) {
            feedback.push('Improve balance and stability');
        }
        if (analysis.depth < 50) {
            feedback.push('Go deeper into the lunge');
        }

        if (feedback.length === 0) {
            feedback.push('Excellent lunge form!');
        }

        return feedback;
    }

    reset() {
        this.stepHistory = [];
        this.balanceHistory = [];
        this.lastLegDetected = null;
    }
}

// Bicep curl analyzer
export class BicepCurlAnalyzer {
    constructor() {
        this.curlHistory = [];
        this.tempoData = [];
    }

    analyze(landmarks) {
        if (!landmarks || landmarks.length < 33) {
            return {
                isCurling: false,
                leftArmAngle: 0,
                rightArmAngle: 0,
                shoulderStability: 0,
                tempo: 'normal',
                feedback: ['Cannot detect pose']
            };
        }

        const analysis = {
            isCurling: this.detectCurlPosition(landmarks),
            leftArmAngle: this.calculateArmAngle(landmarks, 'left'),
            rightArmAngle: this.calculateArmAngle(landmarks, 'right'),
            shoulderStability: this.checkShoulderStability(landmarks),
            tempo: this.analyzeTempo(landmarks),
            feedback: []
        };

        analysis.feedback = this.generateFeedback(analysis);
        return analysis;
    }

    detectCurlPosition(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        
        // Check if elbows are roughly at shoulder level (standing position)
        const leftElbowBelowShoulder = leftElbow.y > leftShoulder.y;
        const rightElbowBelowShoulder = rightElbow.y > rightShoulder.y;
        
        return leftElbowBelowShoulder && rightElbowBelowShoulder;
    }

    calculateArmAngle(landmarks, side) {
        const shoulderIndex = side === 'left' ? 11 : 12;
        const elbowIndex = side === 'left' ? 13 : 14;
        const wristIndex = side === 'left' ? 15 : 16;
        
        return calculateAngle(
            landmarks[shoulderIndex],
            landmarks[elbowIndex],
            landmarks[wristIndex]
        );
    }

    checkShoulderStability(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        
        // Check if elbows stay close to body
        const leftElbowDistance = Math.abs(leftElbow.x - leftShoulder.x);
        const rightElbowDistance = Math.abs(rightElbow.x - rightShoulder.x);
        
        const avgDistance = (leftElbowDistance + rightElbowDistance) / 2;
        return Math.max(0, 100 - (avgDistance * 300));
    }

    analyzeTempo(landmarks) {
        const leftAngle = this.calculateArmAngle(landmarks, 'left');
        const rightAngle = this.calculateArmAngle(landmarks, 'right');
        const avgAngle = (leftAngle + rightAngle) / 2;
        
        this.tempoData.push({
            angle: avgAngle,
            timestamp: Date.now()
        });
        
        if (this.tempoData.length > 10) {
            this.tempoData.shift();
        }
        
        if (this.tempoData.length < 5) return 'normal';
        
        const recentChange = Math.abs(
            this.tempoData[this.tempoData.length - 1].angle - 
            this.tempoData[this.tempoData.length - 5].angle
        );
        
        if (recentChange > 30) return 'too fast';
        if (recentChange < 5) return 'too slow';
        return 'normal';
    }

    generateFeedback(analysis) {
        const feedback = [];
        
        if (!analysis.isCurling) {
            feedback.push('Stand upright with arms at sides');
            return feedback;
        }

        if (analysis.shoulderStability < 70) {
            feedback.push('Keep elbows close to your body');
        }
        
        if (analysis.tempo === 'too fast') {
            feedback.push('Slow down - control the movement');
        } else if (analysis.tempo === 'too slow') {
            feedback.push('Maintain steady tempo');
        }

        const avgAngle = (analysis.leftArmAngle + analysis.rightArmAngle) / 2;
        if (avgAngle < 50) {
            feedback.push('Curl weights higher');
        }

        if (feedback.length === 0) {
            feedback.push('Good curl form!');
        }

        return feedback;
    }

    reset() {
        this.curlHistory = [];
        this.tempoData = [];
    }
}

// Shoulder press analyzer
export class ShoulderPressAnalyzer {
    constructor() {
        this.pressHistory = [];
        this.stabilityHistory = [];
    }

    analyze(landmarks) {
        if (!landmarks || landmarks.length < 33) {
            return {
                isPressing: false,
                leftShoulderAngle: 0,
                rightShoulderAngle: 0,
                coreStability: 0,
                wristAlignment: { left: true, right: true },
                feedback: ['Cannot detect pose']
            };
        }

        const analysis = {
            isPressing: this.detectPressPosition(landmarks),
            leftShoulderAngle: this.calculateShoulderAngle(landmarks, 'left'),
            rightShoulderAngle: this.calculateShoulderAngle(landmarks, 'right'),
            coreStability: this.checkCoreStability(landmarks),
            wristAlignment: this.checkWristAlignment(landmarks),
            feedback: []
        };

        analysis.feedback = this.generateFeedback(analysis);
        return analysis;
    }

    detectPressPosition(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        
        // Check if wrists are above shoulders (pressing position)
        const leftWristAbove = leftWrist.y < leftShoulder.y;
        const rightWristAbove = rightWrist.y < rightShoulder.y;
        
        return leftWristAbove || rightWristAbove;
    }

    calculateShoulderAngle(landmarks, side) {
        const hipIndex = side === 'left' ? 23 : 24;
        const shoulderIndex = side === 'left' ? 11 : 12;
        const elbowIndex = side === 'left' ? 13 : 14;
        
        return calculateAngle(
            landmarks[hipIndex],
            landmarks[shoulderIndex],
            landmarks[elbowIndex]
        );
    }

    checkCoreStability(landmarks) {
        const nose = landmarks[0];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        const centerHip = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
        };
        
        const stability = Math.abs(nose.x - centerHip.x);
        return Math.max(0, 100 - (stability * 400));
    }

    checkWristAlignment(landmarks) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        
        const leftAligned = Math.abs(leftWrist.x - leftShoulder.x) < 0.08;
        const rightAligned = Math.abs(rightWrist.x - rightShoulder.x) < 0.08;
        
        return { left: leftAligned, right: rightAligned };
    }

    generateFeedback(analysis) {
        const feedback = [];
        
        if (!analysis.isPressing) {
            feedback.push('Raise weights to shoulder height');
            return feedback;
        }

        if (analysis.coreStability < 70) {
            feedback.push('Engage core for stability');
        }
        
        if (!analysis.wristAlignment.left || !analysis.wristAlignment.right) {
            feedback.push('Keep wrists aligned over shoulders');
        }

        const avgAngle = (analysis.leftShoulderAngle + analysis.rightShoulderAngle) / 2;
        if (avgAngle < 160) {
            feedback.push('Press weights higher overhead');
        }

        if (feedback.length === 0) {
            feedback.push('Excellent press form!');
        }

        return feedback;
    }

    reset() {
        this.pressHistory = [];
        this.stabilityHistory = [];
    }
}

// Sit-up analyzer
export class SitupAnalyzer {
    constructor() {
        this.situpHistory = [];
        this.neckStrainHistory = [];
    }

    analyze(landmarks) {
        if (!landmarks || landmarks.length < 33) {
            return {
                isSittingUp: false,
                torsoAngle: 0,
                neckStrain: 0,
                controlledMovement: 0,
                feedback: ['Cannot detect pose']
            };
        }

        const analysis = {
            isSittingUp: this.detectSitupPosition(landmarks),
            torsoAngle: this.calculateTorsoAngle(landmarks),
            neckStrain: this.checkNeckStrain(landmarks),
            controlledMovement: this.checkControlledMovement(landmarks),
            feedback: []
        };

        analysis.feedback = this.generateFeedback(analysis);
        return analysis;
    }

    detectSitupPosition(landmarks) {
        const nose = landmarks[0];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        const avgHipY = (leftHip.y + rightHip.y) / 2;
        
        // Check if torso is elevated (nose higher than hips)
        return nose.y < avgHipY;
    }

    calculateTorsoAngle(landmarks) {
        const nose = landmarks[0];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        
        const avgHip = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
        };
        
        const avgKnee = {
            x: (leftKnee.x + rightKnee.x) / 2,
            y: (leftKnee.y + rightKnee.y) / 2
        };
        
        return calculateAngle(avgKnee, avgHip, nose);
    }

    checkNeckStrain(landmarks) {
        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        
        const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        const neckExtension = Math.abs(nose.y - avgShoulderY);
        
        return Math.max(0, 100 - (neckExtension * 1000));
    }

    checkControlledMovement(landmarks) {
        const torsoAngle = this.calculateTorsoAngle(landmarks);
        
        this.situpHistory.push(torsoAngle);
        if (this.situpHistory.length > 5) {
            this.situpHistory.shift();
        }
        
        if (this.situpHistory.length < 3) return 50;
        
        const smoothness = this.situpHistory.reduce((sum, angle, i) => {
            if (i === 0) return 0;
            return sum + Math.abs(angle - this.situpHistory[i - 1]);
        }, 0) / (this.situpHistory.length - 1);
        
        return Math.max(0, 100 - smoothness);
    }

    generateFeedback(analysis) {
        const feedback = [];
        
        if (!analysis.isSittingUp) {
            feedback.push('Lie down and begin sit-up');
            return feedback;
        }

        if (analysis.neckStrain < 70) {
            feedback.push('Avoid straining your neck');
        }
        
        if (analysis.controlledMovement < 60) {
            feedback.push('Move more slowly and controlled');
        }

        if (analysis.torsoAngle < 30) {
            feedback.push('Sit up higher toward knees');
        }

        if (feedback.length === 0) {
            feedback.push('Good sit-up form!');
        }

        return feedback;
    }

    reset() {
        this.situpHistory = [];
        this.neckStrainHistory = [];
    }
}