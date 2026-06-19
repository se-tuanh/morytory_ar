import React, { useEffect, useRef, useState } from 'react';

// Helpers
const createTextSvg = (text, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `bold 60px ${font}`;
  const textMetrics = context.measureText(text);
  const width = Math.max(textMetrics.width + 40, 300);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="100">
    <style>
      .text { font-family: ${font}, serif; font-size: 60px; font-weight: bold; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5)); }
    </style>
    <text x="50%" y="55%" class="text">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const ARViewer = ({ composedImage, effect, arVideo, music, overlayText, overlayFont, onBack }) => {
  const [mindFileUrl, setMindFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompiling, setIsCompiling] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isGiftOpened, setIsGiftOpened] = useState(effect !== 'gift-box');
  const [showConfetti, setShowConfetti] = useState(false);

  const targetRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const giftRef = useRef(null);
  const isTracking = useRef(false);

  // Compile image to MindAR format
  useEffect(() => {
    let url = null;
    const compileTarget = async () => {
      try {
        const image = new Image();
        image.src = composedImage;
        await new Promise((resolve) => { image.onload = resolve; });

        // @ts-ignore
        const compiler = new window.MINDAR.IMAGE.Compiler();
        await compiler.compileImageTargets([image], (p) => {
          setProgress(Math.round(p));
        });

        const exportedBuffer = await compiler.exportData();
        const blob = new Blob([exportedBuffer], { type: 'application/octet-stream' });
        url = URL.createObjectURL(blob);
        setMindFileUrl(url);
        setIsCompiling(false);
      } catch (err) {
        console.error('Compiler error:', err);
        alert('Lỗi compile: ' + err.message);
      }
    };

    compileTarget();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [composedImage]);

  // Handle AR Start (unlock media)
  const startAR = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => audioRef.current.pause()).catch(e => console.log('Audio unlock failed:', e));
    }
    if (videoRef.current) {
      videoRef.current.play().then(() => videoRef.current.pause()).catch(e => console.log('Video unlock failed:', e));
    }
    setIsStarted(true);
  };

  // Play/Pause media sync
  const playMedia = () => {
    if (audioRef.current) audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
    if (videoRef.current) videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
  };

  const pauseMedia = () => {
    if (audioRef.current) audioRef.current.pause();
    if (videoRef.current) videoRef.current.pause();
  };

  // Handle Target Tracking
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const handleFound = () => {
      isTracking.current = true;
      if (isGiftOpened) {
        playMedia();
      }
    };
    
    const handleLost = () => {
      isTracking.current = false;
      pauseMedia();
    };

    target.addEventListener('targetFound', handleFound);
    target.addEventListener('targetLost', handleLost);

    return () => {
      target.removeEventListener('targetFound', handleFound);
      target.removeEventListener('targetLost', handleLost);
    };
  }, [isStarted, isGiftOpened]);

  // Handle Gift Box open sync
  useEffect(() => {
    if (isGiftOpened && isTracking.current) {
      playMedia();
      if (effect === 'gift-box') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // confetti for 3s
      }
    }
  }, [isGiftOpened]);

  // Bind Gift Box Click
  useEffect(() => {
    const el = giftRef.current;
    if (!el || isGiftOpened) return;

    const onClick = () => {
      setIsGiftOpened(true);
    };

    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [isStarted, isGiftOpened]);

  return (
    <div id="ar-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: '#000' }}>
      
      {/* Media Elements */}
      {music && <audio ref={audioRef} src={music} loop preload="auto" />}
      
      <div id="mobile-debug" style={{ position: 'absolute', top: 10, left: 10, color: 'lime', zIndex: 9999, fontSize: '10px', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        Status: {isCompiling ? 'Compiling' : 'AR Ready'} | Gift: {isGiftOpened ? 'Open' : 'Closed'}
      </div>
      
      {isCompiling && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: 'white', textAlign: 'center', zIndex: 1002, background: 'rgba(0,0,0,0.8)', padding: '2rem', borderRadius: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Đang xử lý ảnh AR... {progress}%</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      )}

      {!isCompiling && !isStarted && (
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: 1003, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <button 
            onClick={startAR} 
            className="animate-in zoom-in"
            style={{ 
              padding: '1rem 2rem', background: '#34d399', color: '#1f2937', 
              fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '9999px', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(52, 211, 153, 0.39)'
            }}
          >
            Chạm để bắt đầu AR
          </button>
          <p style={{ color: 'white', marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            (Cần chạm để cấp quyền phát hình/âm thanh)
          </p>
        </div>
      )}

      {isStarted && mindFileUrl && (
        <a-scene 
          mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true; uiLoading: no; uiError: no; uiScanning: no`}
          color-space="sRGB" 
          renderer="colorManagement: true" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
        >
          <a-assets>
            {effect === 'video-ar' && arVideo && (
              <video 
                id="ar-video-src" 
                ref={videoRef} 
                src={arVideo} 
                crossOrigin="anonymous" 
                loop 
                playsInline 
                webkit-playsinline="true"
              ></video>
            )}
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false">
            {effect === 'gift-box' && !isGiftOpened && (
              <a-entity cursor="rayOrigin: mouse; fuse: false" raycaster="objects: .clickable"></a-entity>
            )}
          </a-camera>

          <a-entity mindar-image-target="targetIndex: 0" ref={targetRef}>
            
            {/* Gift Box Logic */}
            {effect === 'gift-box' && !isGiftOpened && (
              <a-entity ref={giftRef} class="clickable" position="0 0 0.2" animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear">
                <a-box color="#f43f5e" depth="0.5" height="0.5" width="0.5" shadow="receive: false"></a-box>
                <a-plane color="#fbbf24" height="0.51" width="0.1" position="0 0 0.26"></a-plane>
                <a-plane color="#fbbf24" height="0.51" width="0.1" position="0 0 -0.26"></a-plane>
                <a-plane color="#fbbf24" height="0.51" width="0.1" rotation="0 90 0" position="0.26 0 0"></a-plane>
                <a-plane color="#fbbf24" height="0.51" width="0.1" rotation="0 90 0" position="-0.26 0 0"></a-plane>
                <a-plane color="#fbbf24" height="0.51" width="0.1" rotation="90 0 0" position="0 0.26 0"></a-plane>
                {/* Ribbon knot */}
                <a-torus color="#fbbf24" arc="180" radius="0.08" radius-tubular="0.02" position="0 0.25 0" rotation="-90 0 0"></a-torus>
                <a-text value="CHAM DE MO" align="center" position="0 0.4 0" color="#ffffff" scale="0.5 0.5 0.5"></a-text>
              </a-entity>
            )}

            {/* Render internal contents ONLY if gift is opened (or not gift-box) */}
            {isGiftOpened && (
              <>
                {/* AR Video Overlay */}
                {effect === 'video-ar' && arVideo && (
                  <a-video src="#ar-video-src" position="0 0 0.05" width="1" height="1.4"></a-video>
                )}

                {/* Text Overlay */}
                {overlayText && (
                  <a-image
                    src={createTextSvg(overlayText, overlayFont)}
                    position="0 -0.3 0.1"
                    width="1.2"
                    height="0.3"
                    material="transparent: true"
                    animation="property: position; to: 0 -0.25 0.1; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine"
                  ></a-image>
                )}

                {/* 3D Balloon Effect */}
                {effect === 'balloon-3d' && (
                  <a-entity position="0 0 0.1">
                    <a-entity position="-0.4 -0.5 0" animation="property: position; to: -0.4 0.8 0; dir: alternate; dur: 3000; loop: true; easing: easeInOutSine">
                      <a-sphere radius="0.15" color="#ef4444"></a-sphere>
                      <a-cone position="0 -0.15 0" radius-bottom="0" radius-top="0.03" height="0.05" color="#ef4444"></a-cone>
                      <a-cylinder position="0 -0.4 0" radius="0.005" height="0.5" color="#ffffff"></a-cylinder>
                    </a-entity>
                    <a-entity position="0.3 -0.8 0.1" animation="property: position; to: 0.3 0.6 0.1; dir: alternate; dur: 4000; loop: true; easing: easeInOutSine">
                      <a-sphere radius="0.12" color="#3b82f6"></a-sphere>
                      <a-cone position="0 -0.12 0" radius-bottom="0" radius-top="0.02" height="0.04" color="#3b82f6"></a-cone>
                      <a-cylinder position="0 -0.3 0" radius="0.005" height="0.4" color="#ffffff"></a-cylinder>
                    </a-entity>
                    <a-entity position="0 -0.6 -0.1" animation="property: position; to: 0 0.7 -0.1; dir: alternate; dur: 3500; loop: true; easing: easeInOutSine">
                      <a-sphere radius="0.18" color="#eab308"></a-sphere>
                      <a-cone position="0 -0.18 0" radius-bottom="0" radius-top="0.03" height="0.06" color="#eab308"></a-cone>
                      <a-cylinder position="0 -0.5 0" radius="0.005" height="0.6" color="#ffffff"></a-cylinder>
                    </a-entity>
                  </a-entity>
                )}

                {/* Particle Effects */}
                {effect === 'snow' && <a-entity custom-particles="type: snow; count: 100; size: 0.05"></a-entity>}
                {(effect === 'leaves' || effect === 'petals') && <a-entity custom-particles={`type: ${effect}; count: 50; size: 0.1`}></a-entity>}
                {(effect === 'sparkle' || showConfetti) && <a-entity custom-particles={`type: ${showConfetti ? 'fireworks' : 'sparkle'}; count: 80; size: 0.05`}></a-entity>}
              </>
            )}
            
          </a-entity>
        </a-scene>
      )}

      <div className="ar-overlay-ui" style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            padding: '1rem 2rem',
            color: 'white',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.5)',
            cursor: 'pointer'
          }}
        >
          Thoát AR
        </button>
      </div>
    </div>
  );
};
