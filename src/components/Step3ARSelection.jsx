import { useState, useRef } from 'react';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { AR_EFFECTS } from '../data/arEffects';
import { Upload, Video } from 'lucide-react';

export default function Step3ARSelection() {
  const { selectedAREffect, arVideo } = useDesign();
  const dispatch = useDesignDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/mp4')) {
      alert('Vui lòng chọn video định dạng MP4.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Video quá lớn. Vui lòng chọn video dưới 5MB (khoảng 5-10 giây) để đảm bảo tốc độ.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Video = event.target.result;
      dispatch({ type: 'SET_AR_VIDEO', payload: base64Video });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Đã xảy ra lỗi khi đọc file video.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEffect = (effectId) => {
    dispatch({ type: 'SET_AR_EFFECT', payload: effectId });
    // If they select video-ar but haven't uploaded yet, prompt them
    if (effectId === 'video-ar' && !arVideo) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">3. Chọn hiệu ứng AR</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {/* Option: None */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AR_EFFECT', payload: null })}
          className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
            selectedAREffect === null
              ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
              : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
          }`}
        >
          <div>
            <div className="font-semibold">Không sử dụng</div>
            <div className={`text-sm mt-0.5 ${selectedAREffect === null ? 'text-white/80' : 'text-gray-500'}`}>
              Chỉ in khung ảnh truyền thống
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            selectedAREffect === null ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
          }`}>
            {selectedAREffect === null && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
          </div>
        </button>

        {AR_EFFECTS.map((effect) => {
          const isSelected = selectedAREffect === effect.id;
          return (
            <div key={effect.id}>
              <button
                type="button"
                onClick={() => handleSelectEffect(effect.id)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
                  isSelected 
                    ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
                    : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
                }`}
              >
                <div>
                  <div className="font-semibold">{effect.name}</div>
                  <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {effect.desc}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
                </div>
              </button>

              {/* Upload section for video-ar */}
              {isSelected && effect.id === 'video-ar' && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-wood/30 rounded-lg text-sm text-brand-wood hover:bg-brand-wood/5 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Đang xử lý...' : (arVideo ? 'Đổi Video khác' : 'Tải Video Lên')}
                    </button>
                    {arVideo && !isUploading && (
                      <span className="text-sm text-brand-accent-green flex items-center gap-1">
                        <Video className="w-4 h-4" /> Đã lưu video
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Định dạng MP4, tối đa 5MB (5-10 giây)</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="video/mp4" 
        className="hidden" 
      />
    </div>
  );
}
