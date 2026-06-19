import React, { useEffect, useState, useRef } from 'react';

const createTextSvg = (text, font) => {
  const isSerif = font === 'serif';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
    <style>
      .text {
        font-family: ${isSerif ? '"Playfair Display", serif' : 'system-ui, sans-serif'};
        font-size: 60px;
        fill: #ffffff;
        text-anchor: middle;
        dominant-baseline: middle;
        font-weight: bold;
        filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.8));
      }
    </style>
    <text x="400" y="100" class="text">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const ARViewer = ({ composedImage, effect, overlayText, overlayFont, onBack }) => {
  const [mindFileUrl, setMindFileUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompiling, setIsCompiling] = useState(true);

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

  return (
    <div id="ar-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: '#000' }}>
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

      {!isCompiling && mindFileUrl && (
        <a-scene 
          mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true; uiLoading: no; uiError: no; uiScanning: no`}
          color-space="sRGB" 
          renderer="colorManagement: true" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
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

            {/* Sử dụng hệ thống Hạt (Particles) tùy chỉnh tự viết siêu nhẹ */}
            {effect === 'snow' && (
              <a-entity custom-particles="type: snow; count: 100; size: 0.05"></a-entity>
            )}
            {(effect === 'leaves' || effect === 'petals') && (
              <a-entity custom-particles={`type: ${effect}; count: 50; size: 0.1`}></a-entity>
            )}
            {(effect === 'sparkle' || effect === 'fireworks') && (
              <a-entity custom-particles={`type: ${effect}; count: 80; size: 0.05`}></a-entity>
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
