import React, { useEffect, useRef, useState } from 'react';

const createTextSvg = (text, font, effect) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `bold 60px ${font}`;
  const textMetrics = context.measureText(text);
  const width = Math.max(textMetrics.width + 60, 300);
  
  let styles = `
    .text { font-family: ${font}, serif; font-size: 60px; font-weight: bold; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5)); }
  `;

  if (effect === 'neon') {
    styles = `
      .text { 
        font-family: ${font}, serif; 
        font-size: 60px; 
        font-weight: bold; 
        fill: #ffffff; 
        text-anchor: middle; 
        dominant-baseline: middle; 
        filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px #f09) drop-shadow(0 0 30px #f09) drop-shadow(0 0 40px #f09);
      }
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="120">
    <style>${styles}</style>
    <text x="50%" y="55%" class="text">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const ARViewer = ({ composedImage, effect, music, overlayText, overlayFont, overlayTextEffect, onBack }) => {
  const [mindFileUrl, setMindFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompiling, setIsCompiling] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const targetRef = useRef(null);
  const audioRef = useRef(null);
  
  // For Typewriter effect
  const [displayedText, setDisplayedText] = useState(overlayTextEffect === 'typewriter' ? '' : overlayText);
  const isTracking = useRef(false);

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

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [composedImage]);

  const startAR = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
      }).catch(e => console.log('Audio unlock failed:', e));
    }
    setIsStarted(true);
  };

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const playAudio = () => {
      isTracking.current = true;
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
      }
    };
    
    const pauseAudio = () => {
      isTracking.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    target.addEventListener('targetFound', playAudio);
    target.addEventListener('targetLost', pauseAudio);

    return () => {
      target.removeEventListener('targetFound', playAudio);
      target.removeEventListener('targetLost', pauseAudio);
    };
  }, [music, mindFileUrl, isStarted]);

  // Typewriter effect logic
  useEffect(() => {
    if (overlayTextEffect !== 'typewriter' || !overlayText) {
      setDisplayedText(overlayText);
      return;
    }

    let i = 0;
    let typingInterval;

    const startTyping = () => {
      i = 0;
      setDisplayedText('');
      typingInterval = setInterval(() => {
        if (i < overlayText.length) {
          setDisplayedText(overlayText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          // Restart after 5 seconds
          setTimeout(() => {
             if (isTracking.current) startTyping();
          }, 5000);
        }
      }, 150);
    };

    const target = targetRef.current;
    if (!target) return;

    const handleFound = () => startTyping();
    const handleLost = () => {
      clearInterval(typingInterval);
      setDisplayedText('');
    };

    target.addEventListener('targetFound', handleFound);
    target.addEventListener('targetLost', handleLost);

    return () => {
      clearInterval(typingInterval);
      target.removeEventListener('targetFound', handleFound);
      target.removeEventListener('targetLost', handleLost);
    };
  }, [overlayText, overlayTextEffect, isStarted]);

  return (
    <div id="ar-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: '#000' }}>
      {music && (
        <audio ref={audioRef} src={music} loop preload="auto" />
      )}
      
      <div id="mobile-debug" style={{ position: 'absolute', top: 10, left: 10, color: 'lime', zIndex: 9999, fontSize: '10px', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        Status: {isCompiling ? 'Compiling' : 'AR Starting...'}
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
            (Cần chạm để bật quyền phát nhạc)
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
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0" ref={targetRef}>
            {displayedText && (
              <a-image
                src={createTextSvg(displayedText, overlayFont, overlayTextEffect)}
                position="0 -0.3 0.1"
                width="1.2"
                height="0.3"
                material="transparent: true"
                animation={overlayTextEffect === 'neon' ? "property: material.opacity; from: 0.8; to: 1; dir: alternate; dur: 100; loop: true" : "property: position; to: 0 -0.25 0.1; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine"}
              ></a-image>
            )}

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

            {/* Particle Systems */}
            {effect === 'snow' && <a-entity custom-particles="type: snow; count: 100; size: 0.05"></a-entity>}
            {(effect === 'leaves' || effect === 'petals') && <a-entity custom-particles={`type: ${effect}; count: 50; size: 0.1`}></a-entity>}
            {(effect === 'sparkle' || effect === 'fireworks') && <a-entity custom-particles={`type: ${effect}; count: 80; size: 0.05`}></a-entity>}
            {effect === 'butterflies' && <a-entity custom-particles="type: butterflies; count: 8; size: 0.1"></a-entity>}
            {effect === 'fireflies' && <a-entity custom-particles="type: fireflies; count: 30; size: 0.03"></a-entity>}
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
