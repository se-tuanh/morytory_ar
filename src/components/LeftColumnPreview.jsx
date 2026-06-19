import { useDesign } from '../store/DesignContext';

export default function LeftColumnPreview() {
  const { photoPreviewUrl, overlay, frameSize, isPrintingPhoto, selectedAREffect } = useDesign();
  
  const containerClasses = `relative border-4 md:border-8 border-[#5D4037] bg-white rounded-md shadow-2xl p-1 md:p-2 transition-all duration-500 ease-in-out flex items-center justify-center overflow-hidden mx-auto
    ${frameSize === '10x15' ? 'w-[120px] h-[180px] md:w-[266px] md:h-[400px]' : ''}
    ${frameSize === '13x18' ? 'w-[138px] h-[191px] md:w-[325px] md:h-[450px]' : ''}
    ${frameSize === '15x21' ? 'w-[156px] h-[218px] md:w-[357px] md:h-[500px]' : ''}
  `;

  // Render particles based on selected AR Effect
  const renderAREffect = () => {
    if (!selectedAREffect) return null;

    if (selectedAREffect === 'snow') {
      return (
        <div data-html2canvas-ignore="true" className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-black/10">
          {Array.from({ length: 20 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 5}s`;
            const duration = `${3 + Math.random() * 4}s`;
            const size = `${3 + Math.random() * 5}px`;
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-snow"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                  top: '-10px',
                }}
              />
            );
          })}
        </div>
      );
    }

    if (selectedAREffect === 'sparkle') {
      return (
        <div data-html2canvas-ignore="true" className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-yellow-900/5">
          {Array.from({ length: 20 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const top = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 3}s`;
            const duration = `${1.5 + Math.random() * 2}s`;
            const size = `${6 + Math.random() * 8}px`;
            return (
              <svg
                key={i}
                className="absolute text-yellow-400 fill-current animate-sparkle"
                viewBox="0 0 24 24"
                style={{
                  left,
                  top,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                }}
              >
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            );
          })}
        </div>
      );
    }

    if (selectedAREffect === 'petals') {
      return (
        <div data-html2canvas-ignore="true" className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-red-900/5">
          {Array.from({ length: 15 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const delay = `${Math.random() * 6}s`;
            const duration = `${4 + Math.random() * 5}s`;
            const size = `${8 + Math.random() * 10}px`;
            return (
              <div
                key={i}
                className="absolute bg-pink-300 rounded-full opacity-60 animate-petals"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                  width: size,
                  height: size,
                  borderRadius: '100% 0% 100% 100%',
                  top: '-15px',
                }}
              />
            );
          })}
        </div>
      );
    }

    if (selectedAREffect === 'balloon-3d') {
      return (
        <div data-html2canvas-ignore="true" className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-end pb-8 bg-blue-900/10">
          <div className="relative animate-bounce">
             <div className="w-12 h-16 bg-red-500 rounded-[50%] opacity-80 border-2 border-red-600 shadow-lg relative">
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rounded-sm"></div>
               <div className="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-white/50"></div>
             </div>
             <div className="w-10 h-14 bg-yellow-400 rounded-[50%] opacity-80 border-2 border-yellow-500 shadow-lg absolute -right-6 top-4">
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-sm"></div>
               <div className="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-white/50 -rotate-12 origin-top"></div>
             </div>
             <div className="w-10 h-14 bg-blue-400 rounded-[50%] opacity-80 border-2 border-blue-500 shadow-lg absolute -left-6 top-4">
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-sm"></div>
               <div className="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-white/50 rotate-12 origin-top"></div>
             </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Simulation Banner */}
      {selectedAREffect && (
        <div className="mb-4 bg-brand-accent-green text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm animate-pulse z-30">
          AR Trực Tuyến Đang Hoạt Động
        </div>
      )}
      
      <div className={containerClasses}>
        <div id="ar-target-preview" className="w-full h-full bg-gray-100 rounded overflow-hidden relative">
          
          {/* Simulated AR overlay (plays inside frame bounds) */}
          {renderAREffect()}

          {/* Photo Render Logic */}
          {isPrintingPhoto ? (
            photoPreviewUrl ? (
              <img 
                src={photoPreviewUrl} 
                alt="Preview" 
                className="object-cover w-full h-full transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full text-gray-400 bg-gray-100 flex flex-col items-center justify-center text-center p-4">
                <svg className="w-12 h-12 mb-2 opacity-50 text-brand-wood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Chưa có ảnh in kèm</span>
                <span className="text-xs text-gray-400 mt-1">Vui lòng tải ảnh lên ở Bước 1</span>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-[#F5EFE6] flex flex-col items-center justify-center text-center p-6 border border-brand-wood/10">
              <span className="text-sm font-serif font-semibold text-brand-wood/80">Khung Gỗ MoryTory</span>
              <span className="text-xs text-brand-wood/60 mt-1">Không bao gồm in ảnh</span>
            </div>
          )}
          
          {/* AR Overlay Text */}
          {overlay.text && (
            <div 
              className="absolute z-10 w-full text-center px-4 break-words"
              style={{ 
                fontFamily: overlay.fontStyle === 'serif' ? 'Playfair Display, serif' : 
                            overlay.fontStyle === 'cursive' ? 'Dancing Script, cursive' : 'Inter, sans-serif',
                fontSize: `${overlay.fontSize}px`,
                bottom: '15%',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                color: 'white'
              }}
            >
              {overlay.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
