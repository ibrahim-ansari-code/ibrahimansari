'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const FaceGestureTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [gesture, setGesture] = useState('');
  const [error, setError] = useState('');
  const [navigationCooldown, setNavigationCooldown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const isMediaPipeClosedRef = useRef(false);
  const lastGestureTime = useRef(0);
  const lastHeadShakeTime = useRef(0);
  const lastNavigationTime = useRef(0);

  const router = useRouter();
  const currentPage = usePathname() === '/' ? 'home' : 'about';

  const COOLDOWN_TIME = 3000;
  const NAVIGATION_COOLDOWN = 3000;

  const executeGesture = useCallback((gesture: string) => {
    if (gesture === 'tongue_out') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (gesture === 'smile') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (gesture === 'head_shake') {
      lastNavigationTime.current = Date.now();
      setNavigationCooldown(true);
      setTimeout(() => setNavigationCooldown(false), NAVIGATION_COOLDOWN);
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        router.push('/about');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const initializeMediaPipe = useCallback(async () => {
    try {
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      
      const faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          setFaceDetected(true);
          detectGestures(results.multiFaceLandmarks[0]);
        } else {
          setFaceDetected(false);
          setGesture('');
        }
      });

      faceMeshRef.current = faceMesh;
      return faceMesh;
    } catch (err) {
      setError('Failed to initialize face detection');
      return null;
    }
  }, []);

  const detectGestures = useCallback((landmarks: any) => {
    if (!landmarks || landmarks.length < 468) return;

    const mouthLeft = landmarks[61];
    const mouthRight = landmarks[291];
    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];

    const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y);
    const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
    const mouthAspectRatio = mouthHeight / mouthWidth;

    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    
    const keyLandmarks = [1, 33, 61, 91, 121, 151, 181, 234, 262, 291, 321, 362, 391, 454];
    
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

    let gesture = 'none';

    const isTongueOut = mouthAspectRatio > 0.3;
    const isHeadMoving = Math.abs(deltaX) > 0.05;
    const headDirection = deltaX < 0 ? 'left' : 'right';

    let isHeadShake = false;
    if (Math.abs(deltaX) > 0.06 && Math.abs(deltaY) < 0.25) {
      isHeadShake = true;
    }

    if (isHeadShake) {
      gesture = 'head_shake';
    } else if (isTongueOut) {
      gesture = 'tongue_out';
    } else if (mouthAspectRatio < 0.15 && mouthHeight < 0.02) {
      gesture = 'smile';
    }

    if (gesture !== 'none') {
      if (gesture === 'head_shake') {
        const now = Date.now();
        if (now - lastHeadShakeTime.current > 2000) {
          setGesture(gesture);
          executeGesture(gesture);
          lastGestureTime.current = now;
          lastHeadShakeTime.current = now;
        }
      } else if (Date.now() - lastGestureTime.current > COOLDOWN_TIME) {
        setGesture(gesture);
        executeGesture(gesture);
        lastGestureTime.current = Date.now();
      }
    }
  }, [executeGesture]);

  const startCamera = useCallback(async () => {
    try {
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
        
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              resolve(true);
            };
          }
        });
      }

      const faceMesh = await initializeMediaPipe();
      if (faceMesh && videoRef.current) {
        const { Camera } = await import('@mediapipe/camera_utils');
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
              try {
                await faceMesh.send({ image: videoRef.current });
              } catch (err) {
                // ignore
              }
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
      }
    } catch (err) {
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
          isMediaPipeClosedRef.current = true;
        }
      }
    }
  }, [isTracking, startCamera]);

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isTracking ? (
        <button
          onClick={() => setIsTracking(true)}
          className="px-4 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
        >
          enable face gestures
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsTracking(false)}
            className="px-4 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
          >
            disable face gestures
          </button>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-3 w-64">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <div className={`w-1.5 h-1.5 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>{faceDetected ? 'face detected' : 'no face detected'}</span>
              </div>
              
              <video
                ref={videoRef}
                className="w-20 h-20 object-cover rounded border border-gray-300 mx-auto"
                autoPlay
                muted
                playsInline
              />
              
              <div className="text-center text-xs text-gray-700">
                <div className="font-medium mb-1">MediaPipe Face Mesh</div>
                <div className="space-y-0.5 text-xs">
                  <div>tongue out = scroll down</div>
                  <div>smile = scroll up</div>
                  <div>head shake = switch page</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-xs text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default FaceGestureTracker;