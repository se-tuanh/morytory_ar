import { useDesign, useDesignDispatch } from '../store/DesignContext';

const MUSIC_OPTIONS = [
  { id: null, name: 'Không dùng nhạc', desc: 'Chỉ phát hiệu ứng hình ảnh' },
  { id: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Happy_Birthday_to_You_%28Vocal%29.mp3', name: 'Happy Birthday', desc: 'Nhạc chúc mừng sinh nhật (Vocal)' },
  { id: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mp3', name: 'Nhạc Piano thư giãn', desc: 'Chopin - Nocturne Op 9 No 2' },
];

export default function Step4MusicSelection() {
  const { music } = useDesign();
  const dispatch = useDesignDispatch();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">4. Chọn Nhạc Nền (Mới)</h3>
      <p className="text-sm text-gray-500">Nhạc sẽ tự động phát khi người nhận quét mã AR trúng bức ảnh.</p>
      
      <div className="grid grid-cols-1 gap-3">
        {MUSIC_OPTIONS.map((option, idx) => {
          const isSelected = music === option.id;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => dispatch({ type: 'SET_MUSIC', payload: option.id })}
              className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
                isSelected 
                  ? 'bg-brand-wood text-white scale-[1.01] shadow-md border-transparent' 
                  : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
              }`}
            >
              <div>
                <div className="font-semibold">{option.name}</div>
                <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {option.desc}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-white border-white text-brand-wood' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-wood" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
