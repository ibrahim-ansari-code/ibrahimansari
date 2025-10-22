'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FaceGestureTracker: React.FC = () => {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [gesture, setGesture] = useState<string>('');
  const [faceDetected, setFaceDetected] = useState(false);
  const [navigationCooldown, setNavigationCooldown] = useState(false);
  const [error, setError] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const lastGestureTime = useRef<number>(0);
  const lastNavigationTime = useRef<number>(0);
  const faceMeshRef = useRef<any>(null);
  const isMediaPipeClosedRef = useRef<boolean>(false);

  const COOLDOWN_TIME = 3000; // 3 seconds cooldown to prevent rapid navigation
  const NAVIGATION_COOLDOWN = 3000; // 3 seconds for left/right navigation specifically

  const executeGesture = useCallback((gesture: string) => {
    console.log('🎯 EXECUTING FACE GESTURE:', gesture);

    // Face gesture actions
    if (gesture === 'tongue_out') {
      console.log('👅 Tongue out - scrolling down');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (gesture === 'smile') {
      console.log('😊 Smile - scrolling up');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (gesture === 'head_shake') {
      console.log('👈👉 Head shake - navigating to other page');
      lastNavigationTime.current = Date.now();
      setNavigationCooldown(true);
      setTimeout(() => setNavigationCooldown(false), NAVIGATION_COOLDOWN);
      // Navigate to the page we're not currently on
      const currentPath = window.location.pathname;
      console.log(`🔄 Current path: ${currentPath}, navigating to: ${currentPath === '/' ? '/about' : '/'}`);
      if (currentPath === '/') {
        router.push('/about');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const initializeMediaPipe = useCallback(async () => {
    try {
      // Dynamically import MediaPipe
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      const { Camera } = await import('@mediapipe/camera_utils');
      
      const faceMesh = new FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMeshRef.current = faceMesh;
      isMediaPipeClosedRef.current = false;

      faceMesh.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          setFaceDetected(true);
          detectGestures(results.multiFaceLandmarks[0]);
        } else {
          setFaceDetected(false);
          setGesture('');
        }
      });

      return faceMesh;
    } catch (err) {
      console.error('❌ MediaPipe initialization error:', err);
      setError('Failed to initialize face detection');
      return null;
    }
  }, []);

  const detectGestures = useCallback((landmarks: any) => {
    if (!landmarks || landmarks.length < 468) return;

    // Key landmarks for mouth detection
    const mouthLeft = landmarks[61];
    const mouthRight = landmarks[291];
    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];

    // Calculate mouth opening
    const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y);
    const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
    const mouthAspectRatio = mouthHeight / mouthWidth;

    // Calculate face bounding box center for more reliable head tracking
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    
    // Sample key face landmarks to get bounding box
    const keyLandmarks = [1, 33, 61, 91, 121, 151, 181, 234, 262, 291, 321, 362, 391, 454]; // nose, eyes, mouth, ears
    
    keyLandmarks.forEach(index => {
      if (landmarks[index]) {
        minX = Math.min(minX, landmarks[index].x);
        maxX = Math.max(maxX, landmarks[index].x);
        minY = Math.min(minY, landmarks[index].y);
        maxY = Math.max(maxY, landmarks[index].y);
      }
    });
    
    const headCenterX = (minX + maxX) / 2;
    const headCenterY = (minY + maxY) / 2;

    const screenCenter = { x: 0.5, y: 0.5 };
    const deltaX = headCenterX - screenCenter.x;
    const deltaY = headCenterY - screenCenter.y;

    // Debug logging for head movement
    if (Math.abs(deltaX) > 0.02) {
      console.log(`👤 HEAD POSITION: deltaX=${deltaX.toFixed(3)}, headCenter=${headCenterX.toFixed(3)}, bbox=(${minX.toFixed(2)}-${maxX.toFixed(2)})`);
    }

    let gesture = 'none';

    // Check for tongue out (mouth open wide)
    const isTongueOut = mouthAspectRatio > 0.3;
    
    // Check for head movement
    const isHeadMoving = Math.abs(deltaX) > 0.05;
    const headDirection = deltaX < 0 ? 'left' : 'right';

    // Head shake detection - check for significant head movement first (highest priority)
    if (Math.abs(deltaX) > 0.08) {
      console.log(`🎯 HEAD SHAKE DETECTED: deltaX=${deltaX.toFixed(3)}`);
      gesture = 'head_shake';
    } else if (isTongueOut) {
      // Just tongue out (scroll down)
      gesture = 'tongue_out';
    } else if (mouthAspectRatio < 0.15 && mouthHeight < 0.02) {
      // Smile detection (mouth corners up) - lowest priority
      gesture = 'smile';
    }

    if (gesture !== 'none' && Date.now() - lastGestureTime.current > COOLDOWN_TIME) {
      console.log(`🎭 FACE GESTURE DETECTED: ${gesture} (mouth ratio: ${mouthAspectRatio.toFixed(3)}, deltaX: ${deltaX.toFixed(3)})`);
      setGesture(gesture);
      executeGesture(gesture);
      lastGestureTime.current = Date.now();
      
    }
  }, [executeGesture]);

  const startCamera = useCallback(async () => {
    try {
      console.log('🎥 Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log('✅ Camera access granted');
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log('📹 Video metadata loaded');
              resolve(true);
            };
          }
        });
      }

      // Initialize MediaPipe
      const faceMesh = await initializeMediaPipe();
      if (faceMesh && videoRef.current) {
        const { Camera } = await import('@mediapipe/camera_utils');
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
              try {
                await faceMesh.send({ image: videoRef.current });
              } catch (err) {
                console.log('MediaPipe frame processing error:', err);
              }
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
      }
    } catch (err) {
      console.error('❌ Camera error:', err);
      setError('Camera access denied');
    }
  }, [initializeMediaPipe]);

  useEffect(() => {
    if (isTracking) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (faceMeshRef.current && !isMediaPipeClosedRef.current) {
        try {
          faceMeshRef.current.close();
          isMediaPipeClosedRef.current = true;
        } catch (err) {
          console.log('MediaPipe already closed');
          isMediaPipeClosedRef.current = true;
        }
        faceMeshRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (faceMeshRef.current && !isMediaPipeClosedRef.current) {
        try {
          faceMeshRef.current.close();
          isMediaPipeClosedRef.current = true;
        } catch (err) {
          console.log('MediaPipe already closed');
          isMediaPipeClosedRef.current = true;
        }
        faceMeshRef.current = null;
      }
    };
  }, [isTracking, startCamera]);

  return (
    <>
      {/* Toggle button for face tracking */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsTracking(!isTracking)}
          className="px-4 py-2 bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
        >
          {isTracking ? 'disable face gestures' : 'enable face gestures'}
        </button>
      </div>

      {isTracking && (
        <>
          <div className="fixed bottom-4 right-4 z-40">
            <div className="bg-white p-3 border border-neutral-200 rounded shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  faceDetected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="text-xs text-neutral-600 font-medium">
                  {faceDetected ? 'face detected' : 'no face'}
                </div>
              </div>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-20 h-20 object-cover rounded border mx-auto"
                  style={{ transform: 'scaleX(-1)' }}
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-0"
                />
              </div>
              <div className="text-xs text-neutral-400 mt-1 text-center">
                MediaPipe Face Mesh
              </div>
              {isTracking && (
                <div className="text-xs text-neutral-500 mt-1 text-center">
                  <div>tongue out = scroll down | smile = scroll up</div>
                  <div>head shake = switch page</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FaceGestureTracker;