import { useState, useRef } from 'react';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { Upload, Music } from 'lucide-react';

const MUSIC_OPTIONS = [
  { id: null, name: 'Không dùng nhạc', desc: 'Chỉ phát hiệu ứng hình ảnh' },
  { id: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', name: 'Nhạc nền Sôi động', desc: 'Nhạc điện tử sôi động' },
  { id: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', name: 'Nhạc nền Thư giãn', desc: 'Giai điệu thư giãn nhẹ nhàng' },
  { id: 'custom', name: 'Tải lên nhạc của bạn', desc: 'Hỗ trợ MP3 (Tối đa 5MB)' }
];

export default function Step4MusicSelection() {
  const { music } = useDesign();
  const dispatch = useDesignDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // We detect if current music is a data URL (custom upload)
  const isCustomUploaded = music && music.startsWith('data:audio');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Vui lòng chọn một file âm thanh (vd: mp3).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File nhạc quá lớn. Vui lòng chọn file dưới 5MB để đảm bảo tốc độ.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Audio = event.target.result;
      dispatch({ type: 'SET_MUSIC', payload: base64Audio });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Đã xảy ra lỗi khi đọc file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">4. Chọn Nhạc Nền (Mới)</h3>
      <p className="text-sm text-gray-500">Nhạc sẽ tự động phát khi người nhận quét mã AR trúng bức ảnh.</p>
      
      <div className="grid grid-cols-1 gap-3">
        {MUSIC_OPTIONS.map((option, idx) => {
          const isSelected = option.id === 'custom' 
            ? isCustomUploaded 
            : music === option.id;

          return (
            <div key={idx}>
              <button
                type="button"
                onClick={() => {
                  if (option.id === 'custom') {
                    fileInputRef.current?.click();
                  } else {
                    dispatch({ type: 'SET_MUSIC', payload: option.id });
                  }
                }}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
                  isSelected 
                    ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
                    : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {option.id === 'custom' && (
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-brand-wood/10'}`}>
                      <Upload className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-brand-wood'}`} />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {isUploading && option.id === 'custom' ? 'Đang tải lên...' : option.desc}
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
                </div>
              </button>
              
              {isSelected && option.id === 'custom' && !isUploading && music && (
                <div className="mt-2 pl-2 flex items-center gap-2 text-sm text-brand-accent-green">
                  <Music className="w-4 h-4" />
                  <span>Đã tải lên nhạc tùy chỉnh thành công!</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="ml-auto text-xs underline opacity-80 hover:opacity-100"
                  >
                    Thay đổi
                  </button>
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
        accept="audio/*" 
        className="hidden" 
      />
    </div>
  );
}
